import { fmt, fmtUnit } from "../exercises/format";
import { G } from "../lab/engine";
import { trackEnergies } from "../lab/physics";
import type { Lesson, Stage } from "../model/types";
import { near } from "./helpers";

const STAGE_ID = "stage-3-energie";

// 3.1 Schiefe Ebene ────────────────────────────────────────────────────────

const schiefeEbene: Lesson = {
  id: "en-1-schiefe-ebene",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "3.1 Kraftwandler: die schiefe Ebene",
  subtitle: "Weniger Kraft, dafür ein längerer Weg",
  tracks: ["I"],
  lehrplan: "Ph8 LB 1 (I): Kraftwandler: schiefe Ebene (Zerlegung der Gewichtskraft), Goldene Regel",
  whyItMatters:
    "Rampen, Serpentinen und Schrauben machen schwere Lasten beweglich. Du lernst, warum eine lange, flache Rampe wenig Kraft braucht und warum man dafür trotzdem keine Arbeit spart.",
  explanationHtml: `
    <p>Ein <strong>Kraftwandler</strong> ändert Betrag, Richtung oder Angriffspunkt einer Kraft. Er <em>spart Kraft, nie Arbeit</em>.</p>
    <p>Auf der <strong>schiefen Ebene</strong> (Länge l, Höhe h) wird die Gewichtskraft F<sub>G</sub> eines Körpers <strong>zeichnerisch zerlegt</strong>, mit einem Kräfteparallelogramm in zwei Teile:</p>
    <ul>
      <li><strong>Hangabtriebskraft F<sub>H</sub></strong> (parallel zur Ebene, den Hang hinunter): Sie will den Körper rutschen lassen. Mit einer Kraft F = F<sub>H</sub> kann man ihn (ohne Reibung) gerade festhalten oder gleichförmig hinaufschieben.</li>
      <li><strong>Normalkraft F<sub>N</sub></strong> (senkrecht zur Ebene): Sie drückt auf die Unterlage.</li>
    </ul>
    <p>Das Kräftedreieck und die Ebene sind ähnliche Dreiecke. Deshalb gilt <strong>F<sub>H</sub> / F<sub>G</sub> = h / l</strong>, also F<sub>H</sub> = F<sub>G</sub> · h / l.</p>
    <ul>
      <li>Je flacher (länger) die Ebene bei gleicher Höhe, desto kleiner die Kraft, aber desto länger der Weg.</li>
      <li><strong>Goldene Regel der Mechanik:</strong> Was man an Kraft spart, muss man an Weg zusetzen: <strong>F · l = F<sub>G</sub> · h</strong>. Die Arbeit ändert sich nicht (Reibung macht sie sogar größer).</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Doppelt so lange Rampe bei gleicher Höhe: halbe Kraft, doppelter Weg, gleiche Arbeit.</div>
  `,
  formulas: [
    { name: "Hangabtriebskraft", html: "F<sub>H</sub> = F<sub>G</sub> · h / l", quantities: "F<sub>G</sub> = m · g, g = 9,81 N/kg; h Höhe, l Länge der Ebene" },
    { name: "Goldene Regel", html: "F · l = F<sub>G</sub> · h", quantities: "ohne Reibung, F in N, l und h in m" },
    { name: "Länge der Rampe", html: "l = F<sub>G</sub> · h / F", quantities: "bei gegebener Maximalkraft F" },
  ],
  quiz: {
    question: "Eine Rampe ist doppelt so lang wie hoch (l = 2 · h). Wie groß ist die nötige Kraft längs der Rampe im Vergleich zur Gewichtskraft (ohne Reibung)?",
    options: [
      "Halb so groß wie die Gewichtskraft",
      "Genauso groß wie die Gewichtskraft",
      "Doppelt so groß wie die Gewichtskraft",
    ],
    correctIndex: 0,
    explanation: "F = F_G · h / l = F_G / 2: Die Kraft halbiert sich, dafür verdoppelt sich der Weg.",
  },
  lab: {
    kind: "inclined-plane",
    title: "Labor: Kiste auf der Rampe",
    intro: "Ändere Masse, Höhe und Länge der Rampe. Lies die Hangabtriebskraft ab und vergleiche sie mit der Gewichtskraft.",
    params: [
      { type: "range", key: "m", label: "Masse m", unit: "kg", min: 10, max: 200, step: 10, value: 100 },
      { type: "range", key: "h", label: "Höhe h", unit: "m", min: 0.5, max: 3, step: 0.5, value: 1.5, digits: 1 },
      { type: "range", key: "l", label: "Länge l", unit: "m", min: 3, max: 12, step: 1, value: 7 },
    ],
    readouts: [
      { key: "FG", label: "Gewichtskraft F_G = m · g", unit: "N", digits: 0, compute: (v) => v.m * G },
      { key: "FH", label: "Hangabtriebskraft F_H = F_G · h / l", unit: "N", digits: 0, emphasis: true, compute: (v) => (v.m * G * v.h) / v.l },
      { key: "ratio", label: "Länge : Höhe", digits: 2, compute: (v) => v.l / v.h },
      { key: "W", label: "Arbeit W = F · l = F_G · h", unit: "J", digits: 0, compute: (v) => v.m * G * v.h },
    ],
    goals: [
      { id: "handkraft", text: "Schiebe 100 kg mit höchstens 250 N auf 2 m Höhe.", check: (v, r) => v.m === 100 && v.h === 2 && Number(r.FH) <= 250 },
      { id: "vierfach", text: "Mache die Rampe genau viermal so lang wie hoch (l : h = 4).", check: (_v, r) => near(Number(r.ratio), 4, 0.001) },
      { id: "arbeit-gleich", text: "Zeige, dass die Arbeit gleich bleibt: Stelle 100 kg, h = 2 m und l = 12 m ein. Die Kraft wird klein, die Arbeit bleibt 1962 J.", check: (v) => v.m === 100 && v.h === 2 && v.l === 12 },
    ],
  },
  exercises: [
    {
      id: "hangabtrieb",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(2, 30) * 10;
          const h = rng.stepped(1, 4, 0.5);
          const l = h * rng.pick([2, 3, 4, 5, 6]);
          const F = (m * G * h) / l;
          return {
            prompt: `Eine Kiste mit ${fmtUnit(m, "kg", 0)} wird über eine ${fmtUnit(l, "m", 1)} lange Rampe auf ${fmtUnit(h, "m", 1)} Höhe geschoben. Welche Kraft längs der Rampe ist ohne Reibung nötig? (g = 9,81 N/kg)`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`, `l = ${fmtUnit(l, "m", 1)}`],
            formulaHint: "F = F_G · h / l mit F_G = m · g",
            answer: F,
            unit: "N",
            digits: 0,
            solutionHtml: `F<sub>G</sub> = m · g = ${fmtUnit(m * G, "N", 1)}<br>F = F<sub>G</sub> · h / l = ${fmt(m * G, 1)} N · ${fmt(h, 1)} / ${fmt(l, 1)} = <strong>${fmtUnit(F, "N", 0)}</strong>`,
          };
        }
        const m = rng.int(8, 15) * 10;
        const h = rng.stepped(0.4, 1.2, 0.1);
        const F = rng.pick([100, 120, 150, 200]);
        const l = (m * G * h) / F;
        return {
          prompt: `Eine Rollstuhlrampe soll einen Höhenunterschied von ${fmtUnit(h, "m", 1)} überwinden. Rollstuhl und Person wiegen zusammen ${fmtUnit(m, "kg", 0)}. Eine Hilfsperson kann höchstens ${fmtUnit(F, "N", 0)} aufbringen. Wie lang muss die Rampe mindestens sein (ohne Reibung, g = 9,81 N/kg)?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`, `F = ${fmtUnit(F, "N", 0)}`],
          answer: l,
          unit: "m",
          digits: 2,
          solutionHtml: `F · l = F<sub>G</sub> · h ⇒ l = m · g · h / F = ${fmt(m, 0)} · 9,81 · ${fmt(h, 1)} / ${fmt(F, 0)} m = <strong>${fmtUnit(l, "m", 2)}</strong>`,
        };
      },
    },
    {
      id: "steigung",
      make: (rng, level) => {
        if (level === 1) {
          const pct = rng.pick([5, 8, 10, 12, 15, 20]);
          const FG = rng.pick([2000, 5000, 8000, 12000]);
          const FH = (FG * pct) / 100;
          return {
            prompt: `Eine Straße hat ${pct} % Steigung: Auf 100 m Strecke gewinnt man ${pct} m an Höhe. Ein Fahrzeug hat die Gewichtskraft ${fmtUnit(FG, "N", 0)}. Wie groß ist die Hangabtriebskraft?`,
            given: [`h / l = ${fmtUnit(pct, "m", 0)} / 100 m = ${fmt(pct / 100, 2)}`, `F_G = ${fmtUnit(FG, "N", 0)}`],
            formulaHint: "F_H = F_G · h / l",
            answer: FH,
            unit: "N",
            digits: 0,
            solutionHtml: `F<sub>H</sub> = F<sub>G</sub> · h / l = ${fmt(FG, 0)} N · ${fmt(pct / 100, 2)} = <strong>${fmtUnit(FH, "N", 0)}</strong>`,
          };
        }
        const m = rng.pick([900, 1200, 1500]);
        const pct = rng.pick([8, 12, 15]);
        const FH = m * G * (pct / 100);
        return {
          prompt: `Ein Auto (${fmtUnit(m, "kg", 0)}) steht auf einer Straße mit ${pct} % Steigung (${pct} m Höhe auf 100 m Strecke). Mit welcher Kraft muss die Bremse es ohne Reibung gegen das Hinabrollen halten?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `Steigung ${pct} % = ${fmt(pct / 100, 2)}`, "g = 9,81 N/kg"],
          answer: FH,
          unit: "N",
          digits: 0,
          solutionHtml: `F<sub>G</sub> = ${fmt(m, 0)} kg · 9,81 N/kg = ${fmt(m * G, 0)} N<br>F<sub>H</sub> = F<sub>G</sub> · ${fmt(pct / 100, 2)} = <strong>${fmtUnit(FH, "N", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du zerlegst die Gewichtskraft und kennst die Goldene Regel: Kraft sparen heißt Weg zusetzen.",
};

// 3.2 Hebel ────────────────────────────────────────────────────────────────

function leverState(v: { F1: number; a1: number; F2: number; a2: number }): string {
  const m1 = v.F1 * v.a1;
  const m2 = v.F2 * v.a2;
  if (Math.abs(m1 - m2) < 0.5) return "im Gleichgewicht";
  return m1 > m2 ? "links sinkt" : "rechts sinkt";
}

const hebel: Lesson = {
  id: "en-2-hebel",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "3.2 Kraftwandler: der Hebel",
  subtitle: "Kraft mal Kraftarm gleich Last mal Lastarm",
  tracks: ["I"],
  lehrplan: "Ph8 LB 1 (I): Kraftwandler: Hebel (Flaschenzug oder Hebel), Hebelgesetz, einfache Berechnungen",
  whyItMatters:
    "Mit einem Brecheisen hebst du einen Stein, den du sonst nie bewegen könntest. Schere, Zange, Wippe und Schubkarre sind alle Hebel.",
  explanationHtml: `
    <p>Ein <strong>Hebel</strong> ist ein starrer Körper, der sich um einen <strong>Drehpunkt</strong> drehen kann. Der <strong>Hebelarm</strong> a ist der senkrechte Abstand der Kraft vom Drehpunkt. An einer Seite wirkt die Kraft F<sub>1</sub> (Kraftarm a<sub>1</sub>), an der anderen die Last F<sub>2</sub> (Lastarm a<sub>2</sub>).</p>
    <p><strong>Hebelgesetz:</strong> Der Hebel ist im Gleichgewicht, wenn die Drehmomente links und rechts gleich sind:</p>
    <p class="formula-line">F<sub>1</sub> · a<sub>1</sub> = F<sub>2</sub> · a<sub>2</sub></p>
    <ul>
      <li>Ein langer Kraftarm bedeutet wenig Kraft: F<sub>1</sub> = F<sub>2</sub> · a<sub>2</sub> / a<sub>1</sub>.</li>
      <li><strong>Zweiseitiger Hebel:</strong> Der Drehpunkt liegt zwischen den Kräften (Wippe, Schere, Zange).</li>
      <li><strong>Einseitiger Hebel:</strong> Beide Kräfte liegen auf derselben Seite (Schubkarre, Flaschenöffner, Nussknacker).</li>
      <li><strong>Goldene Regel:</strong> Der lange Hebelarm bewegt sich entsprechend weiter: Was man an Kraft spart, muss man an Weg zusetzen. Die Arbeit F · s bleibt gleich.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Die Seite mit dem größeren Produkt aus Kraft und Hebelarm sinkt.</div>
  `,
  formulas: [
    { name: "Hebelgesetz", html: "F<sub>1</sub> · a<sub>1</sub> = F<sub>2</sub> · a<sub>2</sub>", quantities: "F in N, Hebelarme a in cm oder m (gleiche Einheit)" },
    { name: "Gesuchte Kraft", html: "F<sub>1</sub> = F<sub>2</sub> · a<sub>2</sub> / a<sub>1</sub>", quantities: "" },
    { name: "Gesuchter Hebelarm", html: "a<sub>1</sub> = F<sub>2</sub> · a<sub>2</sub> / F<sub>1</sub>", quantities: "" },
  ],
  quiz: {
    question: "Mit einem 1,5 m langen Brecheisen hebst du einen Stein. Wo greifst du am besten an, damit du möglichst wenig Kraft brauchst?",
    options: [
      "Nahe am Drehpunkt",
      "Am Ende, weit vom Drehpunkt",
      "Das ist egal",
    ],
    correctIndex: 1,
    explanation: "Ein langer Kraftarm a₁ macht F₁ klein: F₁ = F₂ · a₂ / a₁. Dafür muss das Ende einen langen Weg zurücklegen.",
  },
  lab: {
    kind: "lever",
    title: "Labor: Wippe",
    intro: "Hänge links und rechts Kräfte an den Hebel und wähle die Hebelarme. Beobachte, welche Seite sinkt.",
    params: [
      { type: "range", key: "F1", label: "Kraft links F₁", unit: "N", min: 10, max: 100, step: 10, value: 50 },
      { type: "range", key: "a1", label: "Hebelarm links a₁", unit: "cm", min: 10, max: 60, step: 10, value: 40 },
      { type: "range", key: "F2", label: "Kraft rechts F₂", unit: "N", min: 10, max: 200, step: 10, value: 100 },
      { type: "range", key: "a2", label: "Hebelarm rechts a₂", unit: "cm", min: 10, max: 60, step: 10, value: 30 },
    ],
    readouts: [
      { key: "M1", label: "Links: F₁ · a₁", unit: "N·cm", digits: 0, compute: (v) => v.F1 * v.a1 },
      { key: "M2", label: "Rechts: F₂ · a₂", unit: "N·cm", digits: 0, compute: (v) => v.F2 * v.a2 },
      { key: "state", label: "Zustand", emphasis: true, compute: (v) => leverState({ F1: v.F1, a1: v.a1, F2: v.F2, a2: v.a2 }) },
    ],
    goals: [
      { id: "gleichgewicht", text: "Bringe den Hebel ins Gleichgewicht.", check: (_v, r) => r.state === "im Gleichgewicht" },
      { id: "zwanzig-newton", text: "Halte mit F₁ = 20 N eine Last F₂ = 100 N bei a₂ = 10 cm im Gleichgewicht. Wie lang muss a₁ sein?", check: (v, r) => v.F1 === 20 && v.F2 === 100 && v.a2 === 10 && r.state === "im Gleichgewicht" },
      { id: "links-sinkt", text: "Lass die linke Seite sinken.", check: (_v, r) => r.state === "links sinkt" },
    ],
  },
  exercises: [
    {
      id: "hebelgesetz",
      make: (rng, level) => {
        if (level === 1) {
          const F1 = rng.int(2, 20) * 10;
          const a1 = rng.pick([20, 30, 40, 50, 60, 80]);
          const a2 = rng.pick([5, 10, 15, 20]);
          const F2 = (F1 * a1) / a2;
          return {
            prompt: `An einem Hebel wirkt die Kraft F₁ = ${fmtUnit(F1, "N", 0)} im Abstand a₁ = ${fmtUnit(a1, "cm", 0)} vom Drehpunkt. Welche Kraft F₂ hält im Abstand a₂ = ${fmtUnit(a2, "cm", 0)} auf der anderen Seite das Gleichgewicht?`,
            given: [`F₁ = ${fmtUnit(F1, "N", 0)}`, `a₁ = ${fmtUnit(a1, "cm", 0)}`, `a₂ = ${fmtUnit(a2, "cm", 0)}`],
            formulaHint: "F₁ · a₁ = F₂ · a₂, also F₂ = F₁ · a₁ / a₂",
            answer: F2,
            unit: "N",
            digits: 0,
            solutionHtml: `F₂ = F₁ · a₁ / a₂ = ${fmt(F1, 0)} N · ${fmt(a1, 0)} / ${fmt(a2, 0)} = <strong>${fmtUnit(F2, "N", 0)}</strong>`,
          };
        }
        const stone = rng.pick([1400, 2000, 2800, 3500]);
        const a2 = rng.pick([10, 15, 20]);
        const total = rng.pick([120, 150, 180]);
        const a1 = total - a2;
        const F1 = (stone * a2) / a1;
        return {
          prompt: `Mit einer ${fmtUnit(total, "cm", 0)} langen Brechstange soll ein Stein angehoben werden, der mit ${fmtUnit(stone, "N", 0)} nach unten drückt. Der Drehpunkt liegt ${fmtUnit(a2, "cm", 0)} vom Stein entfernt, du ziehst am anderen Ende. Mit welcher Kraft musst du ziehen?`,
          given: [`Gesamtlänge ${fmtUnit(total, "cm", 0)}`, `Lastarm a₂ = ${fmtUnit(a2, "cm", 0)}`, `Last F₂ = ${fmtUnit(stone, "N", 0)}`],
          answer: F1,
          unit: "N",
          digits: 0,
          solutionHtml: `Kraftarm a₁ = ${fmt(total, 0)} cm − ${fmt(a2, 0)} cm = ${fmt(a1, 0)} cm<br>F₁ = F₂ · a₂ / a₁ = ${fmt(stone, 0)} N · ${fmt(a2, 0)} / ${fmt(a1, 0)} = <strong>${fmtUnit(F1, "N", 0)}</strong>`,
        };
      },
    },
    {
      id: "hebelarm",
      make: (rng, level) => {
        if (level === 1) {
          const F1 = rng.pick([20, 40, 50, 80]);
          const F2 = rng.pick([100, 120, 160, 200]);
          const a2 = rng.pick([10, 15, 20, 30]);
          const a1 = (F2 * a2) / F1;
          return {
            prompt: `Ein Hebel ist im Gleichgewicht: F₁ = ${fmtUnit(F1, "N", 0)}, F₂ = ${fmtUnit(F2, "N", 0)}, a₂ = ${fmtUnit(a2, "cm", 0)}. Wie lang ist der Hebelarm a₁?`,
            given: [`F₁ = ${fmtUnit(F1, "N", 0)}`, `F₂ = ${fmtUnit(F2, "N", 0)}`, `a₂ = ${fmtUnit(a2, "cm", 0)}`],
            formulaHint: "a₁ = F₂ · a₂ / F₁",
            answer: a1,
            unit: "cm",
            digits: 1,
            solutionHtml: `a₁ = F₂ · a₂ / F₁ = ${fmt(F2, 0)} N · ${fmt(a2, 0)} cm / ${fmt(F1, 0)} N = <strong>${fmtUnit(a1, "cm", 1)}</strong>`,
          };
        }
        const m1 = rng.pick([25, 30, 35]);
        const m2 = rng.pick([40, 45, 50]);
        const a1 = rng.pick([1.6, 1.8, 2]);
        const a2 = (m1 * a1) / m2;
        return {
          prompt: `Auf einer Wippe sitzt Anna (${fmtUnit(m1, "kg", 0)}) ${fmtUnit(a1, "m", 1)} vom Drehpunkt entfernt. Ben (${fmtUnit(m2, "kg", 0)}) möchte die Wippe ins Gleichgewicht bringen. Wie weit vom Drehpunkt muss er sitzen? (Die Gewichtskräfte sind proportional zu den Massen.)`,
          given: [`m₁ = ${fmtUnit(m1, "kg", 0)}, a₁ = ${fmtUnit(a1, "m", 1)}`, `m₂ = ${fmtUnit(m2, "kg", 0)}`],
          answer: a2,
          unit: "m",
          digits: 2,
          solutionHtml: `m₁ · a₁ = m₂ · a₂ ⇒ a₂ = m₁ · a₁ / m₂ = ${fmt(m1, 0)} kg · ${fmt(a1, 1)} m / ${fmt(m2, 0)} kg = <strong>${fmtUnit(a2, "m", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du wendest das Hebelgesetz an: Kraft mal Kraftarm gleich Last mal Lastarm.",
};

// 3.3 Flaschenzug (Wahl) ───────────────────────────────────────────────────

const flaschenzug: Lesson = {
  id: "en-3-flaschenzug",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "3.3 Kraftwandler: Rollen und Flaschenzug (Wahl)",
  subtitle: "Mehr Seilstücke, weniger Kraft, mehr Seil",
  tracks: ["I"],
  lehrplan: "Ph8 LB 1 (I): Kraftwandler: Flaschenzug (entweder Flaschenzug oder Hebel)",
  whyItMatters:
    "Kräne und Segelschiffe heben und ziehen Lasten mit Rollen. Der Lehrplan lässt wählen, ob man nach der schiefen Ebene den Hebel oder den Flaschenzug behandelt. Hier kannst du beides lernen.",
  explanationHtml: `
    <p><strong>Feste Rolle:</strong> Sie lenkt die Kraft nur um (man zieht nach unten, die Last geht nach oben). F = F<sub>G</sub>, der Seilweg ist gleich der Hubhöhe.</p>
    <p><strong>Lose Rolle:</strong> Die Last hängt an der Rolle, das Seil trägt von zwei Seiten. F = F<sub>G</sub> / 2, aber der Seilweg ist s = 2 · h.</p>
    <p><strong>Flaschenzug:</strong> Tragen <strong>n Seilstücke</strong> die Last (die Rollen selbst als leicht gedacht), so ist</p>
    <p class="formula-line">F = F<sub>G</sub> / n und s = n · h</p>
    <ul>
      <li>Man zählt die Seilstücke, die an der <em>unteren</em> Rolle ziehen.</li>
      <li><strong>Goldene Regel:</strong> Die Arbeit W = F · s = F<sub>G</sub> · h ist gleich geblieben, nur Kraft und Weg sind getauscht.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> n tragende Seilstücke: n-mal weniger Kraft, n-mal längerer Seilweg.</div>
  `,
  formulas: [
    { name: "Zugkraft", html: "F = F<sub>G</sub> / n", quantities: "n Zahl der tragenden Seilstücke" },
    { name: "Seilweg", html: "s = n · h", quantities: "h Hubhöhe der Last" },
    { name: "Arbeit", html: "W = F · s = F<sub>G</sub> · h", quantities: "bleibt gleich (ohne Reibung)" },
  ],
  quiz: {
    question: "An einem Flaschenzug tragen vier Seilstücke die Last. Du ziehst die Last um 2 m hoch. Wie viel Seil musst du einziehen?",
    options: [
      "2 m",
      "8 m",
      "4 m",
    ],
    correctIndex: 1,
    explanation: "Jedes der vier Seilstücke muss um 2 m kürzer werden: s = n · h = 4 · 2 m = 8 m. Dafür ist die Zugkraft nur ein Viertel.",
  },
  lab: {
    kind: "pulley",
    title: "Labor: Flaschenzug",
    intro: "Wähle die Last, die Hubhöhe und die Zahl der tragenden Seilstücke. Vergleiche Zugkraft, Seilweg und Arbeit.",
    params: [
      { type: "range", key: "m", label: "Masse der Last", unit: "kg", min: 10, max: 200, step: 10, value: 80 },
      {
        type: "choice",
        key: "n",
        label: "Tragende Seilstücke n",
        options: [
          { value: 1, label: "1 (feste Rolle)" },
          { value: 2, label: "2 (lose Rolle)" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
          { value: 5, label: "5" },
          { value: 6, label: "6" },
        ],
        value: 1,
      },
      { type: "range", key: "h", label: "Hubhöhe h", unit: "m", min: 0.5, max: 3, step: 0.5, value: 1, digits: 1 },
    ],
    readouts: [
      { key: "FG", label: "Gewichtskraft der Last", unit: "N", digits: 0, compute: (v) => v.m * G },
      { key: "F", label: "Zugkraft F = F_G / n", unit: "N", digits: 0, emphasis: true, compute: (v) => (v.m * G) / v.n },
      { key: "s", label: "Seilweg s = n · h", unit: "m", digits: 1, emphasis: true, compute: (v) => v.n * v.h },
      { key: "W", label: "Arbeit W = F · s", unit: "J", digits: 0, compute: (v) => ((v.m * G) / v.n) * v.n * v.h },
    ],
    goals: [
      { id: "zweihundert", text: "Hebe 80 kg mit höchstens 200 N Zugkraft.", check: (v, r) => v.m === 80 && Number(r.F) <= 200 },
      { id: "seilweg", text: "Hebe die Last 2 m hoch und ziehe dafür genau 6 m Seil ein.", check: (v, r) => v.h === 2 && Number(r.s) === 6 },
      { id: "arbeit", text: "Hebe 100 kg um 1 m mit fünf tragenden Seilstücken: Die Arbeit bleibt 981 J.", check: (v) => v.m === 100 && v.h === 1 && v.n === 5 },
    ],
  },
  exercises: [
    {
      id: "zugkraft",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(8, 40) * 10;
          const n = rng.int(2, 6);
          const FG = m * G;
          return {
            prompt: `Eine Last von ${fmtUnit(m, "kg", 0)} hängt an einem Flaschenzug mit ${n} tragenden Seilstücken. Welche Zugkraft braucht man (ohne Reibung und Rollengewicht, g = 9,81 N/kg)?`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, `n = ${n}`],
            formulaHint: "F = F_G / n mit F_G = m · g",
            answer: FG / n,
            unit: "N",
            digits: 0,
            solutionHtml: `F<sub>G</sub> = ${fmt(m, 0)} kg · 9,81 N/kg = ${fmt(FG, 0)} N<br>F = F<sub>G</sub> / n = ${fmt(FG, 0)} N / ${n} = <strong>${fmtUnit(FG / n, "N", 0)}</strong>`,
          };
        }
        const Fmax = rng.pick([200, 250, 300, 400]);
        const m = rng.pick([80, 100, 120, 150]);
        const FG = m * G;
        const n = Math.ceil(FG / Fmax);
        return {
          prompt: `Ein Monteur kann an einem Seil höchstens ${fmtUnit(Fmax, "N", 0)} ziehen. Er will ${fmtUnit(m, "kg", 0)} anheben (g = 9,81 N/kg). Wie viele tragende Seilstücke braucht der Flaschenzug mindestens?`,
          given: [`F_max = ${fmtUnit(Fmax, "N", 0)}`, `m = ${fmtUnit(m, "kg", 0)}`],
          answer: n,
          unit: "Seilstücke",
          digits: 0,
          tolerance: 0.001,
          solutionHtml: `F<sub>G</sub> = ${fmt(FG, 0)} N, nötig: n ≥ F<sub>G</sub> / F<sub>max</sub> = ${fmt(FG / Fmax, 2)}, also mindestens <strong>${n} Seilstücke</strong>.`,
        };
      },
    },
    {
      id: "seilweg",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(2, 6);
          const h = rng.pick([1, 1.5, 2, 3]);
          return {
            prompt: `Eine Last wird mit einem Flaschenzug mit ${n} tragenden Seilstücken um ${fmtUnit(h, "m", 1)} gehoben. Wie viel Seil muss eingezogen werden?`,
            given: [`n = ${n}`, `h = ${fmtUnit(h, "m", 1)}`],
            formulaHint: "s = n · h",
            answer: n * h,
            unit: "m",
            digits: 1,
            solutionHtml: `s = n · h = ${n} · ${fmt(h, 1)} m = <strong>${fmtUnit(n * h, "m", 1)}</strong>`,
          };
        }
        const m = rng.pick([60, 80, 100]);
        const n = rng.int(3, 5);
        const h = rng.pick([2, 3, 4]);
        const W = m * G * h;
        return {
          prompt: `Ein Flaschenzug mit ${n} tragenden Seilstücken hebt ${fmtUnit(m, "kg", 0)} um ${fmtUnit(h, "m", 0)}. Welche Arbeit verrichtet die ziehende Person (ohne Reibung, g = 9,81 N/kg)? Rechne mit Kraft mal Seilweg.`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `n = ${n}`, `h = ${fmtUnit(h, "m", 0)}`],
          answer: W,
          unit: "J",
          digits: 0,
          solutionHtml: `F = m · g / n = ${fmt((m * G) / n, 1)} N, s = n · h = ${fmt(n * h, 0)} m<br>W = F · s = <strong>${fmtUnit(W, "J", 0)}</strong>, genauso viel wie m · g · h.`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  optional: true,
  celebrationMessage: "Du zählst die tragenden Seilstücke und weißt, dass der Flaschenzug Kraft in Weg tauscht.",
};

// 3.4 Arbeit ───────────────────────────────────────────────────────────────

const arbeit: Lesson = {
  id: "en-4-arbeit",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "3.4 Mechanische Arbeit",
  subtitle: "Kraft längs eines Weges",
  tracks: ["I"],
  lehrplan: "Ph8 LB 1 (I): Arbeit als abgeleitete Größe und als Übertragungsgröße",
  whyItMatters:
    "Im Alltag ist „Arbeit“ alles, was anstrengt. In der Physik wird nur dann Arbeit verrichtet, wenn eine Kraft einen Körper längs eines Weges bewegt. Wer eine schwere Tasche nur festhält, verrichtet physikalisch keine Arbeit.",
  explanationHtml: `
    <p>Wirkt eine <strong>konstante Kraft F in Richtung des Weges s</strong>, so wird die <strong>Arbeit</strong> verrichtet:</p>
    <p class="formula-line">W = F · s</p>
    <ul>
      <li>Einheit: <strong>1 Joule (J) = 1 N · m</strong>. Außerdem 1 kJ = 1000 J.</li>
      <li><strong>Hubarbeit:</strong> Beim Heben um die Höhe h ist F = F<sub>G</sub>, also <strong>W = m · g · h</strong>.</li>
      <li><strong>Reibungsarbeit:</strong> W = F<sub>R</sub> · s, die Arbeit gegen die Reibung. Sie erwärmt die Körper.</li>
      <li>Im Kraft-Weg-Diagramm ist die Arbeit der <strong>Flächeninhalt</strong> unter der Kraftlinie.</li>
      <li>Steht die Kraft <strong>senkrecht</strong> zur Bewegung (Tasche waagerecht tragen) oder gibt es keinen Weg (Tasche halten), wird <em>keine</em> Arbeit in diesem Sinn verrichtet.</li>
    </ul>
    <p>Arbeit ist eine <strong>Übertragungsgröße</strong>: Sie beschreibt, wie viel Energie von einem Körper auf einen anderen übertragen wird.</p>
    <div class="merke"><strong>Merke:</strong> Kein Weg in Kraftrichtung, keine Arbeit. Kraftwandler ändern F und s, aber nicht das Produkt F · s.</div>
  `,
  formulas: [
    { name: "Arbeit", html: "W = F · s", quantities: "W in J, F in N (in Wegrichtung), s in m" },
    { name: "Hubarbeit", html: "W = m · g · h", quantities: "m in kg, g = 9,81 N/kg, h in m" },
    { name: "Reibungsarbeit", html: "W = F<sub>R</sub> · s", quantities: "" },
  ],
  quiz: {
    question: "Du trägst einen Koffer von 100 N auf ebenem Boden 20 m weit geradeaus. Welche Hubarbeit verrichtest du physikalisch?",
    options: [
      "2000 J",
      "5 J",
      "Keine, denn die Tragekraft steht senkrecht zum Weg",
    ],
    correctIndex: 2,
    explanation: "Die Kraft (nach oben) steht senkrecht zum Weg (waagerecht). Ohne Weg in Kraftrichtung ist die Arbeit null.",
  },
  lab: {
    kind: "work-force",
    title: "Labor: Kraft, Weg und Arbeit",
    intro: "Wähle Kraft, Weg und die Richtung der Kraft. Im Diagramm ist die Arbeit die Fläche unter der Kraftlinie.",
    params: [
      { type: "range", key: "F", label: "Kraft F", unit: "N", min: 10, max: 500, step: 10, value: 200 },
      { type: "range", key: "s", label: "Weg s", unit: "m", min: 0.5, max: 10, step: 0.5, value: 2, digits: 1 },
      {
        type: "choice",
        key: "dir",
        label: "Richtung der Kraft",
        options: [{ value: 0, label: "in Wegrichtung" }, { value: 1, label: "senkrecht zum Weg (waagerecht tragen)" }],
        value: 0,
      },
    ],
    readouts: [
      { key: "W", label: "Arbeit W = F · s", unit: "J", digits: 0, emphasis: true, compute: (v) => (v.dir === 0 ? v.F * v.s : 0) },
      { key: "kJ", label: "Arbeit in kJ", unit: "kJ", digits: 2, compute: (v) => (v.dir === 0 ? (v.F * v.s) / 1000 : 0) },
    ],
    goals: [
      { id: "tausend-joule", text: "Verrichte genau 1000 J Arbeit.", check: (_v, r) => Number(r.W) === 1000 },
      { id: "keine-arbeit", text: "Trage eine Last mit mindestens 300 N über mindestens 5 m waagerecht: Die Arbeit ist null.", check: (v, r) => v.dir === 1 && v.F >= 300 && v.s >= 5 && Number(r.W) === 0 },
      { id: "vier-kj", text: "Verrichte mindestens 4 kJ Arbeit.", check: (_v, r) => Number(r.W) >= 4000 },
    ],
  },
  exercises: [
    {
      id: "arbeit-berechnen",
      make: (rng, level) => {
        if (level === 1) {
          const F = rng.int(2, 40) * 10;
          const s = rng.pick([2, 3, 4, 5, 8, 10]);
          return {
            prompt: `Eine Kraft von ${fmtUnit(F, "N", 0)} schiebt einen Wagen ${fmtUnit(s, "m", 0)} weit in Kraftrichtung. Welche Arbeit wird verrichtet?`,
            given: [`F = ${fmtUnit(F, "N", 0)}`, `s = ${fmtUnit(s, "m", 0)}`],
            formulaHint: "W = F · s",
            answer: F * s,
            unit: "J",
            digits: 0,
            solutionHtml: `W = F · s = ${fmt(F, 0)} N · ${fmt(s, 0)} m = <strong>${fmtUnit(F * s, "J", 0)}</strong>`,
          };
        }
        const m = rng.int(2, 9) * 10;
        const h = rng.pick([1.5, 2, 2.5, 3]);
        const W = m * G * h;
        return {
          prompt: `Ein Lagerarbeiter hebt eine Kiste mit ${fmtUnit(m, "kg", 0)} auf ein Regal in ${fmtUnit(h, "m", 1)} Höhe. Wie viel Hubarbeit verrichtet er (g = 9,81 N/kg)?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`],
          answer: W,
          unit: "J",
          digits: 0,
          solutionHtml: `F = F<sub>G</sub> = m · g = ${fmt(m * G, 1)} N<br>W = F · h = ${fmt(m * G, 1)} N · ${fmt(h, 1)} m = <strong>${fmtUnit(W, "J", 0)}</strong>`,
        };
      },
    },
    {
      id: "weg-aus-arbeit",
      make: (rng, level) => {
        if (level === 1) {
          const F = rng.pick([40, 50, 80, 100, 200]);
          const s = rng.pick([3, 5, 6, 10, 12]);
          const W = F * s;
          return {
            prompt: `Bei einer Kraft von ${fmtUnit(F, "N", 0)} in Wegrichtung werden ${fmtUnit(W, "J", 0)} Arbeit verrichtet. Wie lang ist der Weg?`,
            given: [`F = ${fmtUnit(F, "N", 0)}`, `W = ${fmtUnit(W, "J", 0)}`],
            formulaHint: "s = W / F",
            answer: s,
            unit: "m",
            digits: 1,
            solutionHtml: `s = W / F = ${fmt(W, 0)} J / ${fmt(F, 0)} N = <strong>${fmtUnit(s, "m", 1)}</strong>`,
          };
        }
        const m = rng.pick([20, 25, 40]);
        const W = rng.pick([1500, 2000, 3000]);
        const h = W / (m * G);
        return {
          prompt: `Mit ${fmtUnit(W, "J", 0)} Arbeit soll eine Kiste von ${fmtUnit(m, "kg", 0)} hochgehoben werden (g = 9,81 N/kg). Wie hoch kommt sie?`,
          given: [`W = ${fmtUnit(W, "J", 0)}`, `m = ${fmtUnit(m, "kg", 0)}`],
          answer: h,
          unit: "m",
          digits: 2,
          solutionHtml: `W = m · g · h ⇒ h = W / (m · g) = ${fmt(W, 0)} J / (${fmt(m, 0)} kg · 9,81 N/kg) = <strong>${fmtUnit(h, "m", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du trennst Alltagsarbeit von physikalischer Arbeit und rechnest W = F · s sicher.",
};

// 3.5 Leistung ─────────────────────────────────────────────────────────────

const leistung: Lesson = {
  id: "en-5-leistung",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "3.5 Leistung",
  subtitle: "Arbeit pro Zeit: wer schneller ist, leistet mehr",
  tracks: ["I"],
  lehrplan: "Ph8 LB 1 (I): Leistung als abgeleitete Größe; Experiment zur Leistungsbestimmung planen, durchführen und auswerten (Fehlerbetrachtung)",
  whyItMatters:
    "Zwei Personen tragen dieselbe Kiste in den dritten Stock. Die Arbeit ist gleich, aber wer schneller ist, hat mehr geleistet. Leistung entscheidet bei Motoren, Lampen und Heizungen.",
  explanationHtml: `
    <p><strong>Leistung</strong> ist die in einer Zeit verrichtete Arbeit:</p>
    <p class="formula-line">P = W / t</p>
    <ul>
      <li>Einheit: <strong>1 Watt (W) = 1 J/s</strong>. Außerdem 1 kW = 1000 W. (Früher: 1 PS ≈ 735 W.)</li>
      <li>Gleiche Arbeit in kürzerer Zeit heißt größere Leistung. Umgestellt: W = P · t und t = W / P.</li>
      <li>Typische Werte: ein Mensch leistet dauerhaft etwa 100 W und kurz bis zu 1 kW, ein Pkw-Motor 50 bis 100 kW.</li>
    </ul>
    <p><strong>Experiment zur Leistungsbestimmung (Treppenlauf):</strong> Man misst die Masse m (Waage), die Höhe h der Treppe (Stufenzahl mal Stufenhöhe, mit dem Maßband) und die Zeit t (Stoppuhr). Dann ist <strong>P = m · g · h / t</strong>.</p>
    <p><strong>Fehlerbetrachtung:</strong> Die Zeit hat den größten relativen Fehler (Reaktionszeit des Stoppens, etwa 0,2 s bei nur 5 s Laufzeit). Verbesserungen: mehrere Läufe und Mittelwert, längere Strecke, Lichtschranke statt Handstoppung, Stufenhöhe mehrfach messen.</p>
    <div class="merke"><strong>Merke:</strong> Arbeit ist die Menge, Leistung die Geschwindigkeit, mit der sie verrichtet wird.</div>
  `,
  formulas: [
    { name: "Leistung", html: "P = W / t", quantities: "P in W (1 W = 1 J/s), W in J, t in s" },
    { name: "Treppenlauf", html: "P = m · g · h / t", quantities: "m in kg, g = 9,81 N/kg, h in m" },
    { name: "Arbeit und Zeit", html: "W = P · t, t = W / P", quantities: "" },
  ],
  quiz: {
    question: "Anna und Ben tragen gleich schwere Kisten in den dritten Stock. Anna braucht 60 s, Ben 120 s. Was gilt?",
    options: [
      "Anna verrichtet doppelt so viel Arbeit wie Ben",
      "Beide verrichten gleich viel Arbeit und haben dieselbe Leistung",
      "Beide verrichten gleich viel Arbeit, aber Anna hat die doppelte Leistung",
    ],
    correctIndex: 2,
    explanation: "Die Hubarbeit m · g · h ist gleich. P = W / t ist bei halber Zeit doppelt so groß.",
  },
  lab: {
    kind: "power-stairs",
    title: "Labor: Treppenlauf",
    intro: "Stelle Masse, Höhe der Treppe und Laufzeit ein. Lies Arbeit und Leistung ab.",
    params: [
      { type: "range", key: "m", label: "Masse m", unit: "kg", min: 40, max: 100, step: 5, value: 60 },
      { type: "range", key: "h", label: "Höhe der Treppe h", unit: "m", min: 2, max: 10, step: 0.5, value: 4, digits: 1 },
      { type: "range", key: "t", label: "Laufzeit t", unit: "s", min: 2, max: 30, step: 1, value: 8 },
    ],
    readouts: [
      { key: "W", label: "Hubarbeit W = m · g · h", unit: "J", digits: 0, compute: (v) => v.m * G * v.h },
      { key: "P", label: "Leistung P = W / t", unit: "W", digits: 0, emphasis: true, compute: (v) => (v.m * G * v.h) / v.t },
    ],
    goals: [
      { id: "kilowatt", text: "Erreiche kurzzeitig eine Leistung von mindestens 1 kW.", check: (_v, r) => Number(r.P) >= 1000 },
      { id: "gemuetlich", text: "Gehe gemütlich: Die Leistung bleibt unter 100 W.", check: (_v, r) => Number(r.P) < 100 },
      { id: "halbe-zeit", text: "Gleiche Arbeit in der halben Zeit: Stelle bei 60 kg und 4 m die Laufzeit 4 s ein.", check: (v) => v.m === 60 && v.h === 4 && v.t === 4 },
    ],
  },
  exercises: [
    {
      id: "leistung-berechnen",
      make: (rng, level) => {
        if (level === 1) {
          const W = rng.int(2, 40) * 100;
          const t = rng.pick([4, 5, 8, 10, 16, 20, 25, 40]);
          return {
            prompt: `In ${fmtUnit(t, "s", 0)} wird die Arbeit ${fmtUnit(W, "J", 0)} verrichtet. Welche Leistung ist das?`,
            given: [`W = ${fmtUnit(W, "J", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "P = W / t",
            answer: W / t,
            unit: "W",
            digits: 1,
            solutionHtml: `P = W / t = ${fmt(W, 0)} J / ${fmt(t, 0)} s = <strong>${fmtUnit(W / t, "W", 1)}</strong>`,
          };
        }
        const m = rng.int(20, 90) * 10;
        const h = rng.int(6, 25);
        const t = rng.int(20, 90);
        const P = (m * G * h) / t;
        return {
          prompt: `Ein Baukran hebt eine Palette mit ${fmtUnit(m, "kg", 0)} in ${fmtUnit(t, "s", 0)} gleichmäßig um ${fmtUnit(h, "m", 0)}. Welche Leistung bringt der Kran dabei auf (g = 9,81 N/kg)?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
          answer: P,
          unit: "W",
          digits: 0,
          solutionHtml: `W = m · g · h = ${fmtUnit(m * G * h, "J", 0)}<br>P = W / t = ${fmt(m * G * h, 0)} J / ${fmt(t, 0)} s = <strong>${fmtUnit(P, "W", 0)}</strong>`,
        };
      },
    },
    {
      id: "treppenlauf",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([45, 50, 55, 60, 65, 70]);
          const h = rng.pick([3, 3.5, 4, 4.5]);
          const t = rng.pick([6, 7, 8, 9, 10]);
          const P = (m * G * h) / t;
          return {
            prompt: `Beim Experiment zur Leistungsbestimmung läuft eine Schülerin (${fmtUnit(m, "kg", 0)}) in ${fmtUnit(t, "s", 0)} eine Treppe mit ${fmtUnit(h, "m", 1)} Höhe hinauf. Berechne ihre mittlere Leistung (g = 9,81 N/kg).`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "P = m · g · h / t",
            answer: P,
            unit: "W",
            digits: 0,
            solutionHtml: `P = ${fmt(m, 0)} kg · 9,81 N/kg · ${fmt(h, 1)} m / ${fmt(t, 0)} s = <strong>${fmtUnit(P, "W", 0)}</strong>`,
          };
        }
        const n = rng.pick([24, 30, 36, 42]);
        const stepCm = rng.pick([17, 17.5, 18]);
        const m = rng.pick([55, 65, 75]);
        const t = rng.pick([8, 10, 12]);
        const h = (n * stepCm) / 100;
        const P = (m * G * h) / t;
        return {
          prompt: `Ein Schüler (${fmtUnit(m, "kg", 0)}) läuft in ${fmtUnit(t, "s", 0)} eine Treppe mit ${n} Stufen hinauf. Jede Stufe ist ${fmtUnit(stepCm, "cm", 1)} hoch. Welche mittlere Leistung bringt er auf (g = 9,81 N/kg)?`,
          given: [`${n} Stufen à ${fmtUnit(stepCm, "cm", 1)}`, `m = ${fmtUnit(m, "kg", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
          answer: P,
          unit: "W",
          digits: 0,
          solutionHtml: `h = ${n} · ${fmt(stepCm, 1)} cm = ${fmt(h, 2)} m<br>P = m · g · h / t = ${fmt(m, 0)} · 9,81 · ${fmt(h, 2)} / ${fmt(t, 0)} W = <strong>${fmtUnit(P, "W", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du unterscheidest Arbeit und Leistung und kannst eine Leistungsmessung auswerten und kritisch bewerten.",
};

// 3.6 Energieformen ────────────────────────────────────────────────────────

const energieformen: Lesson = {
  id: "en-6-energieformen",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "3.6 Energie und Energieformen",
  subtitle: "Lageenergie, Bewegungsenergie, Spannenergie",
  tracks: ["I"],
  lehrplan: "Ph8 LB 1 (I): Arbeit als Übertragungsgröße, Energie als Speichergröße; Überblick über Energieformen (potenzielle, kinetische, Spannenergie; propädeutisch innere, elektrische, chemische Energie)",
  whyItMatters:
    "Eine gespannte Feder, ein hochgehobener Stein und ein fahrendes Auto haben eines gemeinsam: Sie können Arbeit verrichten. Diese gespeicherte Fähigkeit heißt Energie.",
  explanationHtml: `
    <p><strong>Energie</strong> ist die in einem Körper oder System gespeicherte Fähigkeit, Arbeit zu verrichten (<strong>Speichergröße</strong>). Einheit: Joule (J). <strong>Arbeit</strong> ist dagegen die <strong>Übertragungsgröße</strong>: Sie ändert die Energie eines Körpers um W = ΔE.</p>
    <ul>
      <li><strong>Lageenergie</strong> (potenzielle Energie): <strong>E<sub>pot</sub> = m · g · h</strong>. Gespeicherte Hubarbeit; h misst man von einer frei gewählten Nullhöhe.</li>
      <li><strong>Bewegungsenergie</strong> (kinetische Energie): <strong>E<sub>kin</sub> = ½ · m · v²</strong>. Doppelte Geschwindigkeit bedeutet vierfache Bewegungsenergie.</li>
      <li><strong>Spannenergie</strong>: in einer gespannten Feder, einem gespannten Bogen, einem zusammengedrückten Gas. Sie wächst mit der Verformung.</li>
      <li>Im Überblick (propädeutisch): <strong>innere Energie</strong> (Wärme, Teilchenbewegung), <strong>elektrische Energie</strong> und <strong>chemische Energie</strong> (Nahrung, Benzin, Batterie).</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Energie ist ein Vorrat, Arbeit ist der Transport. Ein Körper „hat“ Energie, aber er „hat“ keine Arbeit.</div>
  `,
  formulas: [
    { name: "Lageenergie", html: "E<sub>pot</sub> = m · g · h", quantities: "E in J, m in kg, g = 9,81 N/kg, h in m" },
    { name: "Bewegungsenergie", html: "E<sub>kin</sub> = ½ · m · v²", quantities: "v in m/s (1 m/s = 3,6 km/h)" },
    { name: "Arbeit ändert Energie", html: "W = ΔE", quantities: "Übertragungsgröße und Speichergröße haben dieselbe Einheit" },
  ],
  quiz: {
    question: "Ein Radfahrer fährt doppelt so schnell wie vorher. Wie ändert sich seine Bewegungsenergie?",
    options: [
      "Sie verdoppelt sich",
      "Sie vervierfacht sich",
      "Sie bleibt gleich, nur die Masse zählt",
    ],
    correctIndex: 1,
    explanation: "E_kin = ½ · m · v² hängt vom Quadrat der Geschwindigkeit ab: 2² = 4.",
  },
  lab: {
    kind: "energy-forms",
    title: "Labor: Lage- und Bewegungsenergie",
    intro: "Links hebt ein Kran die Masse auf die Höhe h. Rechts fährt ein Wagen mit derselben Masse mit der Geschwindigkeit v. Vergleiche die Energien.",
    params: [
      { type: "range", key: "m", label: "Masse m", unit: "kg", min: 1, max: 100, step: 1, value: 10 },
      { type: "range", key: "h", label: "Höhe h", unit: "m", min: 0, max: 20, step: 1, value: 5 },
      { type: "range", key: "v", label: "Geschwindigkeit v", unit: "m/s", min: 0, max: 30, step: 1, value: 5 },
    ],
    readouts: [
      { key: "Epot", label: "Lageenergie E_pot = m · g · h", unit: "J", digits: 0, emphasis: true, compute: (v) => v.m * G * v.h },
      { key: "Ekin", label: "Bewegungsenergie E_kin = ½ · m · v²", unit: "J", digits: 0, emphasis: true, compute: (v) => 0.5 * v.m * v.v * v.v },
    ],
    goals: [
      { id: "gleich-gross", text: "Mache E_pot und E_kin gleich groß (±2 %), mit einer Höhe über 0 m.", check: (v, r) => v.h > 0 && near(Number(r.Epot), Number(r.Ekin), 0.02) },
      { id: "vierfach", text: "Verdopple die Geschwindigkeit von 10 auf 20 m/s bei 10 kg: Die Bewegungsenergie vervierfacht sich auf 2000 J.", check: (v) => v.m === 10 && v.v === 20 },
      { id: "ein-kj", text: "Speichere etwa 1 kJ Lageenergie (±5 %).", check: (_v, r) => near(Number(r.Epot), 1000, 0.05) },
    ],
  },
  exercises: [
    {
      id: "lageenergie",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(2, 60);
          const h = rng.stepped(0.5, 12, 0.5);
          return {
            prompt: `Ein Körper mit ${fmtUnit(m, "kg", 0)} Masse liegt ${fmtUnit(h, "m", 1)} über dem Boden. Welche Lageenergie hat er bezogen auf den Boden (g = 9,81 N/kg)?`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`],
            formulaHint: "E_pot = m · g · h",
            answer: m * G * h,
            unit: "J",
            digits: 0,
            solutionHtml: `E<sub>pot</sub> = m · g · h = ${fmt(m, 0)} kg · 9,81 N/kg · ${fmt(h, 1)} m = <strong>${fmtUnit(m * G * h, "J", 0)}</strong>`,
          };
        }
        const m = rng.pick([60, 70, 80]);
        const dh = rng.pick([400, 600, 800, 1200]);
        const E = (m * G * dh) / 1000;
        return {
          prompt: `Eine Bergsteigerin (${fmtUnit(m, "kg", 0)}) steigt ${fmtUnit(dh, "m", 0)} hoch. Um wie viel Kilojoule wächst ihre Lageenergie (g = 9,81 N/kg)?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `Δh = ${fmtUnit(dh, "m", 0)}`],
          answer: E,
          unit: "kJ",
          digits: 0,
          solutionHtml: `ΔE<sub>pot</sub> = m · g · Δh = ${fmt(m, 0)} · 9,81 · ${fmt(dh, 0)} J = ${fmt(m * G * dh, 0)} J = <strong>${fmtUnit(E, "kJ", 0)}</strong>`,
        };
      },
    },
    {
      id: "bewegungsenergie",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([2, 5, 10, 20, 50]);
          const v = rng.pick([2, 4, 5, 10, 12]);
          const E = 0.5 * m * v * v;
          return {
            prompt: `Ein Körper mit ${fmtUnit(m, "kg", 0)} Masse bewegt sich mit ${fmtUnit(v, "m/s", 0)}. Wie groß ist seine Bewegungsenergie?`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, `v = ${fmtUnit(v, "m/s", 0)}`],
            formulaHint: "E_kin = ½ · m · v²",
            answer: E,
            unit: "J",
            digits: 0,
            solutionHtml: `E<sub>kin</sub> = ½ · m · v² = 0,5 · ${fmt(m, 0)} kg · (${fmt(v, 0)} m/s)² = <strong>${fmtUnit(E, "J", 0)}</strong>`,
          };
        }
        const m = rng.pick([800, 1000, 1200]);
        const kmh = rng.pick([36, 54, 72, 90]);
        const v = kmh / 3.6;
        const E = (0.5 * m * v * v) / 1000;
        return {
          prompt: `Ein Auto (${fmtUnit(m, "kg", 0)}) fährt mit ${fmtUnit(kmh, "km/h", 0)}. Wie viel Bewegungsenergie hat es in Kilojoule? Rechne die Geschwindigkeit zuerst in m/s um.`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `v = ${fmtUnit(kmh, "km/h", 0)}`],
          answer: E,
          unit: "kJ",
          digits: 1,
          solutionHtml: `v = ${fmt(kmh, 0)} km/h / 3,6 = ${fmt(v, 1)} m/s<br>E<sub>kin</sub> = ½ · ${fmt(m, 0)} · (${fmt(v, 1)})² J = ${fmt(E * 1000, 0)} J = <strong>${fmtUnit(E, "kJ", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du unterscheidest Speichergröße Energie und Übertragungsgröße Arbeit und rechnest Lage- und Bewegungsenergie aus.",
};

// 3.7 Energieumwandlung und Energieerhaltung ───────────────────────────────

const energieerhaltung: Lesson = {
  id: "en-7-energieerhaltung",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "3.7 Energieumwandlung und Energieerhaltung",
  subtitle: "Energie geht nie verloren, sie wechselt nur die Form",
  tracks: ["I"],
  lehrplan: "Ph8 LB 1 (I): Energieumwandlungen, Prinzip der Energieerhaltung",
  whyItMatters:
    "Eine Achterbahn braucht nur einen Motor für den ersten Hügel. Danach wandelt sie Lageenergie in Bewegungsenergie und zurück. Und warum steht sie am Ende doch still?",
  explanationHtml: `
    <p>Energie lässt sich von einer Form in eine andere <strong>umwandeln</strong> und von einem Körper auf einen anderen <strong>übertragen</strong>. Dabei gilt das <strong>Prinzip der Energieerhaltung</strong>:</p>
    <p class="formula-line">In einem abgeschlossenen System bleibt die Gesamtenergie konstant.</p>
    <ul>
      <li>Ohne Reibung gilt auf einer Bahn: <strong>E<sub>pot</sub> + E<sub>kin</sub> = konstant</strong>. Am höchsten Punkt ist alles Lageenergie, am tiefsten alles Bewegungsenergie.</li>
      <li>Beim Fall aus der Höhe h wird m · g · h zu ½ · m · v²: <strong>v = √(2 · g · h)</strong>, unabhängig von der Masse.</li>
      <li><strong>Mit Reibung</strong> wird ein Teil der Energie zu <strong>innerer Energie</strong> (die Körper werden wärmer). Diese Wärme verteilt sich in der Umgebung und lässt sich nicht mehr nutzen. Die Energie ist nicht weg, aber „entwertet“.</li>
      <li>Ein <strong>Perpetuum mobile</strong>, das ohne Energiezufuhr dauerhaft Arbeit verrichtet, ist unmöglich.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Energie wird umgewandelt, nicht verbraucht. Was „verloren“ scheint, steckt als innere Energie in der Umgebung.</div>
  `,
  formulas: [
    { name: "Energieerhaltung (ohne Reibung)", html: "E<sub>pot</sub> + E<sub>kin</sub> = konstant", quantities: "E<sub>pot</sub> = m · g · h, E<sub>kin</sub> = ½ · m · v²" },
    { name: "Geschwindigkeit beim Fall", html: "v = √(2 · g · h)", quantities: "g = 9,81 N/kg, h in m, v in m/s" },
    { name: "Mit Reibung", html: "E<sub>Start</sub> = E<sub>pot</sub> + E<sub>kin</sub> + E<sub>innere</sub>", quantities: "Die Summe bleibt erhalten." },
  ],
  quiz: {
    question: "Ein Wagen rollt reibungsfrei ein Tal hinab und auf der anderen Seite hinauf. Wie hoch kommt er?",
    options: [
      "Genau bis zur Starthöhe",
      "Höher als die Starthöhe",
      "Nicht ganz so hoch, denn Energie geht verloren",
    ],
    correctIndex: 0,
    explanation: "Ohne Reibung bleibt E_pot + E_kin konstant. Auf der Starthöhe ist die gesamte Bewegungsenergie wieder Lageenergie.",
  },
  lab: {
    kind: "energy-track",
    title: "Labor: Wagen im Tal",
    intro: "Schiebe den Wagen entlang der Bahn und beobachte die Energiebalken. Mit Reibung wandelt sich ein Teil der Energie in innere Energie.",
    params: [
      { type: "range", key: "m", label: "Masse m", unit: "kg", min: 10, max: 100, step: 10, value: 50 },
      { type: "range", key: "h0", label: "Starthöhe h₀", unit: "m", min: 1, max: 10, step: 1, value: 5 },
      { type: "range", key: "x", label: "Position (0 = Start, 1 = tiefster Punkt, 2 = Gegenseite)", unit: "", min: 0, max: 2, step: 0.1, value: 0, digits: 1 },
      { type: "choice", key: "fric", label: "Reibung", options: [{ value: 0, label: "ohne Reibung" }, { value: 1, label: "mit Reibung" }], value: 0 },
    ],
    readouts: [
      { key: "Epot", label: "Lageenergie", unit: "J", digits: 0, compute: (v) => trackEnergies(v.m, v.h0, v.x, v.fric).Epot },
      { key: "Ekin", label: "Bewegungsenergie", unit: "J", digits: 0, emphasis: true, compute: (v) => trackEnergies(v.m, v.h0, v.x, v.fric).Ekin },
      { key: "Eint", label: "Innere Energie durch Reibung", unit: "J", digits: 0, compute: (v) => trackEnergies(v.m, v.h0, v.x, v.fric).Eint },
      { key: "E0", label: "Gesamtenergie am Start", unit: "J", digits: 0, compute: (v) => trackEnergies(v.m, v.h0, v.x, v.fric).E0 },
      { key: "v", label: "Geschwindigkeit", unit: "m/s", digits: 1, compute: (v) => trackEnergies(v.m, v.h0, v.x, v.fric).v },
      { key: "reach", label: "Wagen an dieser Stelle?", compute: (v) => (trackEnergies(v.m, v.h0, v.x, v.fric).reachable ? "ja" : "nein, er kehrt vorher um") },
    ],
    goals: [
      { id: "tiefster-punkt", text: "Ohne Reibung ist am tiefsten Punkt (Position 1) alle Lageenergie in Bewegungsenergie verwandelt.", check: (v, r) => v.fric === 0 && v.x === 1 && near(Number(r.Ekin), Number(r.E0), 0.001) },
      { id: "gegenseite", text: "Ohne Reibung erreicht der Wagen auf der Gegenseite (Position 2) wieder die Starthöhe: Dort ist E_kin gleich null.", check: (v, r) => v.fric === 0 && v.x === 2 && Number(r.Ekin) === 0 },
      { id: "mit-reibung", text: "Mit Reibung bleibt am tiefsten Punkt weniger Bewegungsenergie als am Start: Ein Teil ist innere Energie.", check: (v, r) => v.fric === 1 && v.x === 1 && Number(r.Eint) > 0 },
    ],
  },
  exercises: [
    {
      id: "fallgeschwindigkeit",
      make: (rng, level) => {
        if (level === 1) {
          const h = rng.pick([1.25, 1.8, 3.2, 5, 7.2, 10, 20]);
          const v = Math.sqrt(2 * G * h);
          return {
            prompt: `Ein Stein fällt ohne Luftwiderstand aus ${fmtUnit(h, "m", 2)} Höhe. Mit welcher Geschwindigkeit trifft er auf (g = 9,81 N/kg)?`,
            given: [`h = ${fmtUnit(h, "m", 2)}`, "g = 9,81 N/kg"],
            formulaHint: "m · g · h = ½ · m · v², also v = √(2 · g · h)",
            answer: v,
            unit: "m/s",
            digits: 2,
            solutionHtml: `v = √(2 · g · h) = √(2 · 9,81 · ${fmt(h, 2)}) m/s = <strong>${fmtUnit(v, "m/s", 2)}</strong>`,
          };
        }
        const h = rng.pick([20, 30, 40, 50, 60]);
        const v = Math.sqrt(2 * G * h) * 3.6;
        return {
          prompt: `Ein Achterbahnwagen rollt reibungsfrei aus ${fmtUnit(h, "m", 0)} Höhe zum tiefsten Punkt. Wie schnell ist er dort in km/h (g = 9,81 N/kg)?`,
          given: [`h = ${fmtUnit(h, "m", 0)}`],
          answer: v,
          unit: "km/h",
          digits: 0,
          solutionHtml: `v = √(2 · 9,81 · ${fmt(h, 0)}) m/s = ${fmt(Math.sqrt(2 * G * h), 2)} m/s<br>· 3,6 = <strong>${fmtUnit(v, "km/h", 0)}</strong>. Die Masse spielt keine Rolle.`,
        };
      },
    },
    {
      id: "energiebilanz",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([0.4, 0.5, 1, 2]);
          const h1 = rng.pick([2, 3, 4]);
          const h2 = rng.pick([1, 1.5, 2.5]);
          const dE = m * G * (h1 - h2);
          return {
            prompt: `Ein Ball (${fmtUnit(m, "kg", 1)}) fällt aus ${fmtUnit(h1, "m", 1)} Höhe, prallt auf und springt nur noch ${fmtUnit(h2, "m", 1)} hoch. In wie viel Joule innere Energie hat sich Lageenergie umgewandelt?`,
            given: [`m = ${fmtUnit(m, "kg", 1)}`, `Starthöhe ${fmtUnit(h1, "m", 1)}, Rücksprunghöhe ${fmtUnit(h2, "m", 1)}`],
            formulaHint: "ΔE = m · g · (h₁ − h₂)",
            answer: dE,
            unit: "J",
            digits: 2,
            solutionHtml: `ΔE = m · g · (h₁ − h₂) = ${fmt(m, 1)} kg · 9,81 N/kg · ${fmt(h1 - h2, 1)} m = <strong>${fmtUnit(dE, "J", 2)}</strong>`,
          };
        }
        const m = rng.pick([30, 35, 40]);
        const h = rng.pick([2, 2.5, 3]);
        const v = rng.pick([4, 5, 6]);
        const Epot = m * G * h;
        const Ekin = 0.5 * m * v * v;
        const dE = Epot - Ekin;
        return {
          prompt: `Ein Kind (${fmtUnit(m, "kg", 0)}) rutscht aus ${fmtUnit(h, "m", 1)} Höhe eine Rutsche hinab und ist unten ${fmtUnit(v, "m/s", 0)} schnell. Wie viel Energie wurde durch Reibung in innere Energie umgewandelt (g = 9,81 N/kg)?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`, `v = ${fmtUnit(v, "m/s", 0)}`],
          answer: dE,
          unit: "J",
          digits: 0,
          solutionHtml: `E<sub>pot</sub> = ${fmt(m, 0)} · 9,81 · ${fmt(h, 1)} J = ${fmt(Epot, 0)} J<br>E<sub>kin</sub> = ½ · ${fmt(m, 0)} · ${fmt(v, 0)}² J = ${fmt(Ekin, 0)} J<br>E<sub>innere</sub> = ${fmt(Epot, 0)} J − ${fmt(Ekin, 0)} J = <strong>${fmtUnit(dE, "J", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bilanzierst Energie: Die Summe bleibt, nur die Formen wechseln.",
};

// 3.8 Wirkungsgrad ─────────────────────────────────────────────────────────

const wirkungsgrad: Lesson = {
  id: "en-8-wirkungsgrad",
  stageId: STAGE_ID,
  stepNumber: 8,
  title: "3.8 Wirkungsgrad und Energieentwertung",
  subtitle: "Was wirklich ankommt",
  tracks: ["I"],
  lehrplan: "Ph8 LB 1 (I): Energieumwandlungen bewerten mit dem Wirkungsgrad; propädeutisch Energiewertigkeit und Energieentwertung",
  whyItMatters:
    "Eine Glühlampe macht aus 100 Teilen Strom nur etwa 5 Teile Licht, der Rest wird Wärme. Der Wirkungsgrad sagt, wie gut ein Gerät Energie in die gewünschte Form umwandelt.",
  explanationHtml: `
    <p>Bei jeder Energieumwandlung bleibt die Gesamtenergie erhalten, aber nur ein Teil ist die gewünschte <strong>Nutzenergie</strong>. Der Rest (meist Wärme) geht als <strong>Verlust</strong> in die Umgebung.</p>
    <p class="formula-line">η = E<sub>nutz</sub> / E<sub>zu</sub></p>
    <ul>
      <li>η (sprich: eta) ist der <strong>Wirkungsgrad</strong>. Er hat keine Einheit und ist immer kleiner als 1 (kleiner als 100 %).</li>
      <li>E<sub>nutz</sub> = η · E<sub>zu</sub>. Auch die Verluste bleiben Energie: E<sub>zu</sub> = E<sub>nutz</sub> + E<sub>Verlust</sub>.</li>
      <li>Typische Werte: Elektromotor etwa 90 %, Dieselmotor etwa 40 %, Benzinmotor etwa 30 %, Solarzelle etwa 20 %, Muskel etwa 25 %, Glühlampe etwa 5 %.</li>
      <li><strong>Energieentwertung</strong> (propädeutisch): Wärme bei niedriger Temperatur in der Umgebung ist „minderwertig“, man kann sie kaum noch nutzen. Strom oder Bewegung sind „hochwertig“. Bei jeder Umwandlung wird Energie entwertet.</li>
      <li>Mehrere Geräte hintereinander: Die Wirkungsgrade werden <strong>multipliziert</strong>: η<sub>ges</sub> = η<sub>1</sub> · η<sub>2</sub>.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Ein Wirkungsgrad über 100 % wäre ein Perpetuum mobile. Verluste sind Energie, die man nicht mehr nutzen kann.</div>
  `,
  formulas: [
    { name: "Wirkungsgrad", html: "η = E<sub>nutz</sub> / E<sub>zu</sub>", quantities: "ohne Einheit, meist in % angegeben" },
    { name: "Nutzenergie", html: "E<sub>nutz</sub> = η · E<sub>zu</sub>", quantities: "" },
    { name: "Verluste", html: "E<sub>Verlust</sub> = E<sub>zu</sub> − E<sub>nutz</sub>", quantities: "" },
    { name: "Hintereinanderschaltung", html: "η<sub>ges</sub> = η<sub>1</sub> · η<sub>2</sub>", quantities: "" },
  ],
  quiz: {
    question: "Ein Motor nimmt 100 kJ elektrische Energie auf und gibt 85 kJ mechanische Arbeit ab. Was ist mit den restlichen 15 kJ?",
    options: [
      "Sie sind verschwunden",
      "Sie sind als Wärme in die Umgebung gelangt und nicht mehr nutzbar",
      "Sie stecken weiter im Motor als Bewegungsenergie",
    ],
    correctIndex: 1,
    explanation: "Energie geht nicht verloren. Die 15 kJ sind Verluste, meist Wärme, und sie lassen sich praktisch nicht mehr nutzen.",
  },
  lab: {
    kind: "efficiency",
    title: "Labor: Energiefluss durch ein Gerät",
    intro: "Wähle ein Gerät und die zugeführte Energie. Beobachte, wie viel davon nutzbar ankommt und wie viel als Wärme verloren geht.",
    params: [
      {
        type: "choice",
        key: "device",
        label: "Gerät (Wirkungsgrad)",
        options: [
          { value: 0.05, label: "Glühlampe (5 %)" },
          { value: 0.2, label: "Solarzelle (20 %)" },
          { value: 0.25, label: "Muskel des Menschen (25 %)" },
          { value: 0.3, label: "Benzinmotor (30 %)" },
          { value: 0.4, label: "Dieselmotor (40 %)" },
          { value: 0.9, label: "Elektromotor (90 %)" },
        ],
        value: 0.4,
      },
      { type: "range", key: "Ezu", label: "Zugeführte Energie", unit: "kJ", min: 10, max: 100, step: 10, value: 50 },
    ],
    readouts: [
      { key: "eta", label: "Wirkungsgrad η", digits: 2, compute: (v) => v.device },
      { key: "Enutz", label: "Nutzenergie", unit: "kJ", digits: 1, emphasis: true, compute: (v) => v.device * v.Ezu },
      { key: "Everlust", label: "Verluste (meist Wärme)", unit: "kJ", digits: 1, compute: (v) => v.Ezu - v.device * v.Ezu },
    ],
    goals: [
      { id: "achtzig", text: "Finde das Gerät, das aus 100 kJ mehr als 80 kJ nutzbar macht.", check: (v, r) => v.Ezu === 100 && Number(r.Enutz) > 80 },
      { id: "waerme", text: "Wähle das Gerät, das 95 % der Energie als Wärme abgibt.", check: (v) => v.device === 0.05 },
      { id: "zwoelf", text: "Stelle den Benzinmotor so ein, dass genau 12 kJ Nutzenergie entstehen.", check: (v, r) => v.device === 0.3 && near(Number(r.Enutz), 12, 0.001) },
    ],
  },
  exercises: [
    {
      id: "wirkungsgrad-berechnen",
      make: (rng, level) => {
        if (level === 1) {
          const Ezu = rng.pick([100, 200, 250, 400, 500]);
          const eta = rng.pick([0.2, 0.25, 0.3, 0.4, 0.6, 0.8, 0.9]);
          const En = Ezu * eta;
          return {
            prompt: `Einer Maschine werden ${fmtUnit(Ezu, "kJ", 0)} zugeführt. Sie gibt ${fmtUnit(En, "kJ", 0)} nutzbare Energie ab. Wie groß ist der Wirkungsgrad in Prozent?`,
            given: [`E_zu = ${fmtUnit(Ezu, "kJ", 0)}`, `E_nutz = ${fmtUnit(En, "kJ", 0)}`],
            formulaHint: "η = E_nutz / E_zu (mal 100 für Prozent)",
            answer: eta * 100,
            unit: "%",
            digits: 0,
            solutionHtml: `η = E<sub>nutz</sub> / E<sub>zu</sub> = ${fmt(En, 0)} kJ / ${fmt(Ezu, 0)} kJ = ${fmt(eta, 2)} = <strong>${fmtUnit(eta * 100, "%", 0)}</strong>`,
          };
        }
        const Pzu = rng.pick([40, 60, 75, 100]);
        const Pl = rng.pick([2, 3, 4, 5]);
        const eta = (Pl / Pzu) * 100;
        return {
          prompt: `Eine Glühlampe nimmt ${fmtUnit(Pzu, "W", 0)} elektrische Leistung auf und strahlt davon ${fmtUnit(Pl, "W", 0)} als Licht ab. Wie groß ist ihr Wirkungsgrad in Prozent? Wo ist der Rest geblieben?`,
          given: [`P_zu = ${fmtUnit(Pzu, "W", 0)}`, `P_Licht = ${fmtUnit(Pl, "W", 0)}`],
          answer: eta,
          unit: "%",
          digits: 1,
          solutionHtml: `η = P<sub>nutz</sub> / P<sub>zu</sub> = ${fmt(Pl, 0)} W / ${fmt(Pzu, 0)} W = <strong>${fmtUnit(eta, "%", 1)}</strong>. Die restlichen ${fmt(Pzu - Pl, 0)} W werden als Wärme abgegeben.`,
        };
      },
    },
    {
      id: "nutzenergie",
      make: (rng, level) => {
        if (level === 1) {
          const Ezu = rng.pick([50, 80, 120, 200]);
          const eta = rng.pick([0.25, 0.3, 0.4, 0.9]);
          return {
            prompt: `Ein Motor mit dem Wirkungsgrad ${fmt(eta * 100, 0)} % bekommt ${fmtUnit(Ezu, "kJ", 0)} zugeführt. Wie viel Nutzenergie gibt er ab?`,
            given: [`η = ${fmt(eta, 2)}`, `E_zu = ${fmtUnit(Ezu, "kJ", 0)}`],
            formulaHint: "E_nutz = η · E_zu",
            answer: eta * Ezu,
            unit: "kJ",
            digits: 1,
            solutionHtml: `E<sub>nutz</sub> = η · E<sub>zu</sub> = ${fmt(eta, 2)} · ${fmt(Ezu, 0)} kJ = <strong>${fmtUnit(eta * Ezu, "kJ", 1)}</strong>`,
          };
        }
        const e1 = rng.pick([0.4, 0.45]);
        const e2 = rng.pick([0.9, 0.95]);
        const e3 = rng.pick([0.8, 0.9]);
        const eta = e1 * e2 * e3 * 100;
        return {
          prompt: `Ein Kraftwerk (${fmt(e1 * 100, 0)} %) liefert Strom über eine Leitung (${fmt(e2 * 100, 0)} %) an einen Elektromotor (${fmt(e3 * 100, 0)} %). Wie groß ist der Wirkungsgrad der ganzen Kette in Prozent?`,
          given: [`η₁ = ${fmt(e1 * 100, 0)} %`, `η₂ = ${fmt(e2 * 100, 0)} %`, `η₃ = ${fmt(e3 * 100, 0)} %`],
          answer: eta,
          unit: "%",
          digits: 1,
          solutionHtml: `η<sub>ges</sub> = η₁ · η₂ · η₃ = ${fmt(e1, 2)} · ${fmt(e2, 2)} · ${fmt(e3, 2)} = ${fmt(eta / 100, 3)} = <strong>${fmtUnit(eta, "%", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bewertest Energieumwandlungen mit dem Wirkungsgrad und weißt, dass Verluste Wärme in der Umgebung sind.",
};

export const STAGE_ENERGIE: Stage = {
  id: STAGE_ID,
  stageNumber: 3,
  title: "Mechanik und Energie",
  subtitle: "Kraftwandler, Arbeit, Leistung, Energie und Wirkungsgrad",
  icon: "⚙️",
  accent: "#0d9488",
  badgeTitle: "Energie-Buchhalter",
  lehrplanLabel: "Ph8 LB 1 (I)",
  lessons: [schiefeEbene, hebel, flaschenzug, arbeit, leistung, energieformen, energieerhaltung, wirkungsgrad],
};
