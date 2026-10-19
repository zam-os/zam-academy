import { fmt, fmtUnit } from "../exercises/format";
import type { Lesson, Stage } from "../model/types";
import { near, within } from "./helpers";

const STAGE_ID = "stage-4-elektrizitaet";

// 4.1 Elektromagnetismus ───────────────────────────────────────────────────

const elektromagnet: Lesson = {
  id: "el-1-elektromagnet",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "4.1 Elektromagnetismus: Leiter, Spule, Elektromagnet",
  subtitle: "Wie Strom ein Magnetfeld erzeugt",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 3 (I) · Ph9 LB 3 (II/III): Elektromagnetismus, Magnetfeld eines geraden Leiters und einer Spule, Elektromagnet",
  whyItMatters:
    "Türöffner, Schrottkran, Lautsprecher, Relais: Ein Elektromagnet ist ein Magnet mit Schalter. Wie stark er wird, kannst du selbst einstellen.",
  explanationHtml: `
    <p>Fließt Strom durch einen Leiter, umgibt ihn ein <strong>Magnetfeld</strong>. Man beschreibt es mit <strong>Feldlinien</strong>, die vom Nordpol zum Südpol zeigen.</p>
    <ul>
      <li><strong>Gerader Leiter:</strong> Die Feldlinien sind Kreise um den Draht. <em>Rechte-Faust-Regel:</em> Daumen in technische Stromrichtung (+ nach −), die gekrümmten Finger zeigen die Feldlinienrichtung.</li>
      <li><strong>Spule:</strong> Innen addieren sich die Felder der Windungen. Außen sieht das Feld aus wie das eines Stabmagneten mit Nord- und Südpol. <em>Rechte-Hand-Regel:</em> Finger in Stromrichtung der Windungen, der Daumen zeigt zum Nordpol.</li>
      <li><strong>Stärker wird das Feld</strong> mit größerer Stromstärke I, mehr Windungen N und einem <strong>Eisenkern</strong>, der das Feld um ein Vielfaches verstärkt. Ein Maß für Strom und Windungen zusammen ist das Produkt N · I.</li>
      <li>Wird der Strom <strong>umgepolt</strong>, vertauschen sich Nord- und Südpol. Ohne Strom ist der Elektromagnet (mit Weicheisenkern) wieder fast unmagnetisch.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Mehr Strom, mehr Windungen, Eisenkern: stärkerer Elektromagnet. Stromrichtung umkehren: Pole tauschen.</div>
  `,
  formulas: [
    { name: "Stärke des Elektromagneten", html: "wächst mit N · I (und mit Eisenkern)", quantities: "N Windungszahl, I in A" },
  ],
  quiz: {
    question: "Wie kannst du bei einem Elektromagneten Nord- und Südpol vertauschen?",
    options: [
      "Mehr Windungen aufwickeln",
      "Die Stromrichtung umkehren",
      "Den Eisenkern herausziehen",
    ],
    correctIndex: 1,
    explanation: "Die Lage der Pole hängt von der Stromrichtung ab. Windungszahl und Kern ändern nur die Stärke.",
  },
  lab: {
    kind: "electromagnet",
    title: "Labor: Spule mit Eisenkern",
    intro: "Stelle Windungszahl, Stromstärke, Stromrichtung und Eisenkern ein. Wie viele Büroklammern hält der Elektromagnet im Modell?",
    params: [
      { type: "range", key: "N", label: "Windungszahl N", unit: "", min: 10, max: 1000, step: 10, value: 200 },
      { type: "range", key: "I", label: "Stromstärke I", unit: "A", min: 0, max: 5, step: 0.1, value: 1, digits: 1 },
      {
        type: "choice",
        key: "dir",
        label: "Stromrichtung",
        options: [
          { value: 0, label: "normal" },
          { value: 1, label: "umgepolt" },
        ],
        value: 0,
      },
      {
        type: "choice",
        key: "core",
        label: "Kern",
        options: [
          { value: 0, label: "ohne Eisenkern" },
          { value: 1, label: "mit Eisenkern" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "NI", label: "N · I", unit: "A", digits: 0, emphasis: true, compute: (v) => v.N * v.I },
      { key: "strength", label: "Relative Feldstärke (Modell)", digits: 2, compute: (v) => Math.min(1, (v.N * v.I) / 2000) * (v.core === 1 ? 1 : 0.35) },
      { key: "clips", label: "Gehaltene Büroklammern (Modell)", digits: 0, compute: (v) => Math.round(Math.min(1, (v.N * v.I) / 2000) * (v.core === 1 ? 1 : 0.35) * 24) },
      { key: "northSide", label: "Nordpol liegt", compute: (v) => (v.dir === 0 ? "rechts" : "links") },
    ],
    goals: [
      { id: "tausend", text: "Erreiche N · I = 1 000 A (±5 %).", check: (_v, r) => near(Number(r.NI), 1000, 0.05) },
      { id: "umpolen", text: "Vertausche die Pole, ohne die Spule anzufassen.", check: (v) => v.dir === 1 },
      { id: "kern", text: "Verstärke den Magneten ohne mehr Strom: Setze bei N · I ≥ 500 A den Eisenkern ein.", check: (v, r) => v.core === 1 && Number(r.NI) >= 500 },
    ],
  },
  exercises: [
    {
      id: "durchflutung",
      make: (rng, level) => {
        if (level === 1) {
          const N = rng.int(5, 80) * 10;
          const I = rng.stepped(0.2, 4, 0.1);
          return {
            prompt: `Eine Spule hat ${fmt(N, 0)} Windungen, durch die ${fmtUnit(I, "A", 1)} fließen. Berechne das Produkt N · I, ein Maß für die Stärke des Elektromagneten.`,
            given: [`N = ${fmt(N, 0)}`, `I = ${fmtUnit(I, "A", 1)}`],
            formulaHint: "N · I",
            answer: N * I,
            unit: "A",
            digits: 0,
            solutionHtml: `N · I = ${fmt(N, 0)} · ${fmt(I, 1)} A = <strong>${fmtUnit(N * I, "A", 0)}</strong>`,
          };
        }
        const N = rng.int(10, 60) * 10;
        const target = rng.int(2, 12) * 100;
        const I = target / N;
        return {
          prompt: `Ein Elektromagnet mit ${fmt(N, 0)} Windungen soll N · I = ${fmtUnit(target, "A", 0)} erreichen. Welche Stromstärke ist dafür nötig?`,
          given: [`N = ${fmt(N, 0)}`, `N · I = ${fmtUnit(target, "A", 0)}`],
          answer: I,
          unit: "A",
          digits: 2,
          solutionHtml: `I = (N · I) / N = ${fmt(target, 0)} A / ${fmt(N, 0)} = <strong>${fmtUnit(I, "A", 2)}</strong>`,
        };
      },
    },
    {
      id: "windungszahl",
      make: (rng, level) => {
        if (level === 1) {
          const target = rng.int(3, 20) * 100;
          const I = rng.pick([0.5, 1, 2, 2.5, 4, 5]);
          return {
            prompt: `Ein Elektromagnet soll N · I = ${fmtUnit(target, "A", 0)} haben. Das Netzgerät liefert ${fmtUnit(I, "A", 1)}. Wie viele Windungen braucht die Spule?`,
            given: [`N · I = ${fmtUnit(target, "A", 0)}`, `I = ${fmtUnit(I, "A", 1)}`],
            formulaHint: "N = (N · I) / I",
            answer: target / I,
            unit: "Windungen",
            digits: 0,
            solutionHtml: `N = ${fmt(target, 0)} A / ${fmt(I, 1)} A = <strong>${fmt(target / I, 0)} Windungen</strong>`,
          };
        }
        const NA = rng.int(10, 40) * 10;
        const IA = rng.pick([1, 1.5, 2, 3]);
        const IB = rng.pick([0.25, 0.5, 0.6, 0.75]);
        const NB = (NA * IA) / IB;
        return {
          prompt: `Spule A hat ${fmt(NA, 0)} Windungen und wird von ${fmtUnit(IA, "A", 1)} durchflossen. Spule B soll bei nur ${fmtUnit(IB, "A", 2)} genauso stark sein (ohne Kern, gleiche Form). Wie viele Windungen braucht Spule B?`,
          given: [`N_A · I_A = ${fmt(NA, 0)} · ${fmt(IA, 1)} A = ${fmtUnit(NA * IA, "A", 0)}`, `I_B = ${fmtUnit(IB, "A", 2)}`],
          answer: NB,
          unit: "Windungen",
          digits: 0,
          solutionHtml: `N_B · I_B = N_A · I_A ⇒ N_B = ${fmt(NA * IA, 0)} A / ${fmt(IB, 2)} A = <strong>${fmt(NB, 0)} Windungen</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du baust Elektromagnete nach Maß: Strom, Windungen, Kern.",
};

// 4.2 Lorentzkraft und Elektromotor ───────────────────────────────────────

const lorentz: Lesson = {
  id: "el-2-lorentzkraft-motor",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "4.2 Kraft auf Leiter im Magnetfeld: Lorentzkraft und Motor",
  subtitle: "UVW-Regel, Drehspulinstrument und Elektromotor",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 3 (I): Lorentzkraft, UVW-Regel der linken Hand, Drehspulinstrument, Elektromotor · Ph9 LB 3 (II/III): Aufbau und Funktionsweise eines Elektromotors",
  whyItMatters:
    "Jeder Elektromotor, vom Handy-Vibrationsalarm bis zum E-Auto, nutzt dieselbe Kraft: Ein stromdurchflossener Leiter wird im Magnetfeld zur Seite gedrückt.",
  explanationHtml: `
    <p>Fließt Strom durch einen Leiter, der quer in einem Magnetfeld liegt, wirkt auf ihn eine Kraft: die <strong>Lorentzkraft</strong>. Eine Leiterschaukel schlägt aus.</p>
    <ul>
      <li>Die Richtung liefert die <strong>UVW-Regel der linken Hand</strong>: <strong>U</strong>rsache (Daumen) = Richtung der <em>Elektronen</em> (vom Minuspol zum Pluspol), <strong>V</strong>ermittlung (Zeigefinger) = Magnetfeld von N nach S, <strong>W</strong>irkung (Mittelfinger) = Kraft.</li>
      <li>Die Kraft ist umso größer, je größer Stromstärke, Magnetfeld und Leiterlänge im Feld sind. Strom oder Feld umkehren: Die Kraft kehrt sich um. Beides umkehren: Kraft bleibt.</li>
      <li><strong>Drehspulinstrument:</strong> Eine Spule im Magnetfeld dreht sich gegen eine Feder. Der Zeigerausschlag ist <strong>proportional zur Stromstärke</strong>.</li>
      <li><strong>Elektromotor:</strong> Eine drehbare Spule (Rotor) im Feld eines Magneten (Stator). Damit sie nicht in der Gleichgewichtslage stehen bleibt, kehrt der <strong>Kommutator (Polwender)</strong> nach jeder halben Umdrehung die Stromrichtung um. Wechselstrommotoren brauchen keinen Polwender: der Strom wechselt von selbst.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Linke Hand, Daumen Elektronenstrom, Zeigefinger Feld N→S, Mittelfinger Kraft. Der Polwender hält den Motor am Drehen.</div>
  `,
  formulas: [
    { name: "Lorentzkraft (qualitativ)", html: "F wächst mit I, mit dem Magnetfeld und mit der Leiterlänge", quantities: "Richtung: UVW-Regel der linken Hand" },
    { name: "Drehspulinstrument", html: "Zeigerausschlag α ~ I", quantities: "proportional: doppelte Stromstärke, doppelter Ausschlag" },
  ],
  quiz: {
    question: "Bei einer Leiterschaukel werden gleichzeitig die Stromrichtung und die Lage des Magneten (N und S) vertauscht. Was passiert mit der Kraftrichtung?",
    options: [
      "Sie kehrt sich um",
      "Sie bleibt gleich",
      "Die Kraft verschwindet",
    ],
    correctIndex: 1,
    explanation: "Jede der beiden Umkehrungen allein dreht die Kraft um. Beide zusammen heben sich auf: Die Richtung bleibt.",
  },
  lab: {
    kind: "lorentz",
    title: "Labor: Leiterschaukel",
    intro: "Lege Elektronenstromrichtung und Magnetfeld fest und lies ab, in welche Richtung die Kraft auf den Leiter wirkt. Prüfe mit der linken Hand.",
    params: [
      {
        type: "choice",
        key: "e",
        label: "Elektronenstrom",
        options: [
          { value: 0, label: "in den Bildschirm hinein ⊗" },
          { value: 1, label: "aus dem Bildschirm heraus ⊙" },
        ],
        value: 0,
      },
      {
        type: "choice",
        key: "b",
        label: "Magnetfeld",
        options: [
          { value: 0, label: "Nordpol links (Feld nach rechts)" },
          { value: 1, label: "Nordpol rechts (Feld nach links)" },
        ],
        value: 1,
      },
      { type: "range", key: "I", label: "Stromstärke I", unit: "A", min: 0, max: 3, step: 0.1, value: 1.5, digits: 1 },
    ],
    readouts: [
      {
        key: "dir",
        label: "Kraftrichtung",
        emphasis: true,
        compute: (v) => {
          if (v.I === 0) return "keine";
          const sign = (v.e === 0 ? 1 : -1) * (v.b === 0 ? 1 : -1);
          return sign > 0 ? "nach oben" : "nach unten";
        },
      },
      { key: "F", label: "Relative Kraft (Modell)", digits: 2, compute: (v) => v.I / 3 },
    ],
    goals: [
      { id: "oben", text: "Lass den Leiter nach oben ausschlagen, während der Nordpol links liegt.", check: (v, r) => v.b === 0 && r.dir === "nach oben" },
      { id: "unten-heraus", text: "Lass den Leiter nach unten ausschlagen mit Elektronenstrom aus dem Bildschirm heraus.", check: (v, r) => v.e === 1 && r.dir === "nach unten" },
      { id: "beides", text: "Stelle Elektronen heraus (⊙) und Nordpol rechts ein: Gegenüber ⊗ mit Nordpol links sind beide umgekehrt, die Kraft zeigt wieder nach oben.", check: (v, r) => v.e === 1 && v.b === 1 && r.dir === "nach oben" },
    ],
  },
  exercises: [
    {
      id: "drehspul-proportional",
      make: (rng, level) => {
        if (level === 1) {
          const I1 = rng.pick([0.1, 0.2, 0.25, 0.4, 0.5]);
          const a1 = rng.int(5, 20);
          const I2 = I1 * rng.pick([1.5, 2, 2.5, 3]);
          const a2 = (a1 * I2) / I1;
          return {
            prompt: `Bei einem Drehspulinstrument zeigt der Zeiger bei ${fmtUnit(I1, "A", 2)} auf ${fmt(a1, 0)} Skalenteile. Auf wie viele Skalenteile zeigt er bei ${fmtUnit(I2, "A", 2)}?`,
            given: [`I₁ = ${fmtUnit(I1, "A", 2)} → ${fmt(a1, 0)} Skt`, `I₂ = ${fmtUnit(I2, "A", 2)}`],
            formulaHint: "Ausschlag α ~ I, also α₂ = α₁ · I₂ / I₁",
            answer: a2,
            unit: "Skt",
            digits: 1,
            solutionHtml: `α₂ = α₁ · I₂ / I₁ = ${fmt(a1, 0)} · ${fmt(I2, 2)} / ${fmt(I1, 2)} = <strong>${fmt(a2, 1)} Skalenteile</strong>`,
          };
        }
        const full = rng.pick([30, 50, 60, 100]);
        const Imax = rng.pick([50, 100, 150, 300]);
        const pos = rng.int(5, full - 5);
        const I = (Imax * pos) / full;
        return {
          prompt: `Ein Drehspulinstrument hat Vollausschlag (${fmt(full, 0)} Skalenteile) bei ${fmtUnit(Imax, "mA", 0)}. Der Zeiger steht auf ${fmt(pos, 0)} Skalenteilen. Welche Stromstärke fließt (in mA)?`,
          given: [`${fmt(full, 0)} Skt entsprechen ${fmtUnit(Imax, "mA", 0)}`, `Zeiger: ${fmt(pos, 0)} Skt`],
          answer: I,
          unit: "mA",
          digits: 1,
          solutionHtml: `I = I_max · ${fmt(pos, 0)} / ${fmt(full, 0)} = ${fmt(Imax, 0)} mA · ${fmt(pos / full, 3)} = <strong>${fmtUnit(I, "mA", 1)}</strong>`,
        };
      },
    },
    {
      id: "kraft-proportional",
      make: (rng, level) => {
        if (level === 1) {
          const I1 = rng.pick([0.5, 1, 1.5, 2]);
          const F1 = rng.int(2, 20) / 100;
          const I2 = I1 * rng.pick([2, 3, 4]);
          const F2 = (F1 * I2) / I1;
          return {
            prompt: `Auf eine Leiterschaukel wirkt bei ${fmtUnit(I1, "A", 1)} die Kraft ${fmtUnit(F1, "N", 2)}. Wie groß ist die Kraft bei ${fmtUnit(I2, "A", 1)} im gleichen Magnetfeld?`,
            given: [`I₁ = ${fmtUnit(I1, "A", 1)} → F₁ = ${fmtUnit(F1, "N", 2)}`, `I₂ = ${fmtUnit(I2, "A", 1)}`],
            formulaHint: "F ~ I, also F₂ = F₁ · I₂ / I₁",
            answer: F2,
            unit: "N",
            digits: 2,
            solutionHtml: `F₂ = F₁ · I₂ / I₁ = ${fmt(F1, 2)} N · ${fmt(I2, 1)} / ${fmt(I1, 1)} = <strong>${fmtUnit(F2, "N", 2)}</strong>`,
          };
        }
        const I1 = rng.pick([0.8, 1, 1.2, 1.5]);
        const F1 = rng.int(4, 12) / 100;
        const F2 = F1 * rng.pick([1.5, 2.5, 3, 5]);
        const I2 = (I1 * F2) / F1;
        return {
          prompt: `Bei ${fmtUnit(I1, "A", 1)} wirkt auf einen Leiter im Magnetfeld die Kraft ${fmtUnit(F1, "N", 2)}. Welche Stromstärke ist nötig, damit die Kraft ${fmtUnit(F2, "N", 2)} beträgt?`,
          given: [`I₁ = ${fmtUnit(I1, "A", 1)}, F₁ = ${fmtUnit(F1, "N", 2)}`, `F₂ = ${fmtUnit(F2, "N", 2)}`],
          answer: I2,
          unit: "A",
          digits: 2,
          solutionHtml: `F ~ I ⇒ I₂ = I₁ · F₂ / F₁ = ${fmt(I1, 1)} A · ${fmt(F2, 2)} / ${fmt(F1, 2)} = <strong>${fmtUnit(I2, "A", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Linke Hand, drei Finger: Du findest die Kraftrichtung und weißt, warum der Motor dreht.",
};

// 4.3 Spannung, Energie, Leistung ──────────────────────────────────────────

const energieLeistung: Lesson = {
  id: "el-3-energie-leistung",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "4.3 Spannung, elektrische Energie und Leistung",
  subtitle: "Was auf dem Typenschild steht und was die Stromrechnung zählt",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 3 (I) · Ph9 LB 3 (II/III): elektrische Spannung als abgeleitete Größe, elektrische Energie, Arbeit und Leistung",
  whyItMatters:
    "Der Stromzähler zählt keine Ampere und keine Volt, sondern Kilowattstunden: elektrische Energie. Mit P = U · I und W = P · t rechnest du jedes Typenschild in Euro um.",
  explanationHtml: `
    <p>Die <strong>Spannung U</strong> gibt an, wie viel Energie pro Ladung übertragen wird: U = W / Q, Einheit <strong>1 V = 1 J/C</strong>. Sie ist der „Antrieb“ des Stroms.</p>
    <ul>
      <li><strong>Elektrische Leistung:</strong> <strong>P = U · I</strong>, Einheit 1 W = 1 V · A. Ein Wasserkocher mit 230 V und 8,7 A hat 2000 W.</li>
      <li><strong>Elektrische Energie (Arbeit):</strong> <strong>W = P · t = U · I · t</strong>, in Joule (Ws) oder in <strong>Kilowattstunden</strong>: 1 kWh = 1000 W · 3600 s = <strong>3,6 MJ</strong>.</li>
      <li>Stromkosten = Energie in kWh · Preis pro kWh. Bei 35 ct/kWh kostet eine Stunde Wasserkocher (2 kWh) 70 Cent.</li>
      <li>Messen: Das <strong>Amperemeter</strong> liegt in Reihe im Stromkreis, das <strong>Voltmeter</strong> parallel zum Bauteil.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> P = U · I und W = P · t. Für die Rechnung: Watt mal Stunden geteilt durch 1000 ergibt Kilowattstunden.</div>
  `,
  formulas: [
    { name: "Spannung", html: "U = W / Q", quantities: "U in V (1 V = 1 J/C)" },
    { name: "Elektrische Leistung", html: "P = U · I", quantities: "P in W, U in V, I in A" },
    { name: "Elektrische Energie", html: "W = P · t = U · I · t", quantities: "W in J oder kWh; 1 kWh = 3,6 MJ" },
  ],
  quiz: {
    question: "Ein Gerät mit 500 W läuft 3 Stunden. Welche Energie verbraucht es?",
    options: ["1 500 kWh", "1,5 kWh", "150 kWh"],
    correctIndex: 1,
    explanation: "W = P · t = 500 W · 3 h = 1500 Wh = 1,5 kWh.",
  },
  lab: {
    kind: "electric-power",
    title: "Labor: Gerät am Netz",
    intro: "Stelle Spannung, Stromstärke und Laufzeit ein. Lies Leistung, Energie und Kosten ab.",
    params: [
      {
        type: "choice",
        key: "U",
        label: "Spannung U",
        options: [
          { value: 230, label: "230 V (Steckdose)" },
          { value: 12, label: "12 V (Auto)" },
          { value: 5, label: "5 V (USB)" },
        ],
        value: 230,
      },
      { type: "range", key: "I", label: "Stromstärke I", unit: "A", min: 0.01, max: 16, step: 0.01, value: 2, digits: 2 },
      { type: "range", key: "t", label: "Laufzeit t", unit: "h", min: 0, max: 24, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "price", label: "Strompreis", unit: "ct/kWh", min: 20, max: 50, step: 1, value: 35 },
    ],
    readouts: [
      { key: "P", label: "Leistung P = U · I", unit: "W", digits: 1, emphasis: true, compute: (v) => v.U * v.I },
      { key: "W", label: "Energie W = P · t", unit: "kWh", digits: 3, emphasis: true, compute: (v) => (v.U * v.I * v.t) / 1000 },
      { key: "cost", label: "Kosten", unit: "€", digits: 2, compute: (v) => ((v.U * v.I * v.t) / 1000) * (v.price / 100) },
    ],
    goals: [
      { id: "zwei-kw", text: "Betreibe ein 2-kW-Gerät (±100 W) genau eine Stunde: Lies die Energie in kWh ab.", check: (v, r) => within(Number(r.P), 2000, 100) && v.t === 1 },
      { id: "lampe", text: "Finde die Stromstärke einer 60-W-Lampe (±2 W) an 230 V.", check: (v, r) => v.U === 230 && within(Number(r.P), 60, 2) },
      { id: "euro", text: "Lass ein Gerät so lange laufen, dass es mehr als 1 € kostet.", check: (_v, r) => Number(r.cost) > 1 },
    ],
  },
  exercises: [
    {
      id: "leistung",
      make: (rng, level) => {
        if (level === 1) {
          const U = rng.pick([230, 12, 24, 9, 5]);
          const I = rng.stepped(0.1, 8, 0.1);
          return {
            prompt: `Ein Gerät wird mit ${fmtUnit(U, "V", 0)} betrieben, es fließen ${fmtUnit(I, "A", 1)}. Berechne die elektrische Leistung.`,
            given: [`U = ${fmtUnit(U, "V", 0)}`, `I = ${fmtUnit(I, "A", 1)}`],
            formulaHint: "P = U · I",
            answer: U * I,
            unit: "W",
            digits: 1,
            solutionHtml: `P = U · I = ${fmt(U, 0)} V · ${fmt(I, 1)} A = <strong>${fmtUnit(U * I, "W", 1)}</strong>`,
          };
        }
        const P = rng.pick([40, 60, 100, 800, 1200, 2000, 2200]);
        const h = rng.stepped(0.5, 8, 0.5);
        const price = rng.int(28, 42);
        const kwh = (P * h) / 1000;
        const cost = kwh * (price / 100);
        return {
          prompt: `Ein Gerät mit ${fmtUnit(P, "W", 0)} läuft ${fmtUnit(h, "h", 1)}. Der Strom kostet ${fmtUnit(price, "ct/kWh", 0)}. Wie viel kostet der Betrieb in Euro?`,
          given: [`P = ${fmtUnit(P, "W", 0)}`, `t = ${fmtUnit(h, "h", 1)}`, `Preis = ${fmtUnit(price, "ct/kWh", 0)}`],
          answer: cost,
          unit: "€",
          digits: 2,
          absTolerance: 0.01,
          solutionHtml: `W = P · t = ${fmt(P, 0)} W · ${fmt(h, 1)} h = ${fmtUnit(P * h, "Wh", 0)} = ${fmtUnit(kwh, "kWh", 3)}<br>Kosten = ${fmt(kwh, 3)} kWh · ${fmt(price, 0)} ct/kWh = ${fmtUnit(kwh * price, "ct", 1)} = <strong>${fmtUnit(cost, "€", 2)}</strong>`,
        };
      },
    },
    {
      id: "stromstaerke",
      make: (rng, level) => {
        if (level === 1) {
          const U = rng.pick([230, 12, 24, 5]);
          const P = rng.pick([5, 10, 20, 40, 60, 100, 500, 1000, 2000]);
          const I = P / U;
          return {
            prompt: `Ein Gerät hat die Leistung ${fmtUnit(P, "W", 0)} bei ${fmtUnit(U, "V", 0)}. Welche Stromstärke fließt?`,
            given: [`P = ${fmtUnit(P, "W", 0)}`, `U = ${fmtUnit(U, "V", 0)}`],
            formulaHint: "P = U · I, also I = P / U",
            answer: I,
            unit: "A",
            digits: 3,
            solutionHtml: `I = P / U = ${fmt(P, 0)} W / ${fmt(U, 0)} V = <strong>${fmtUnit(I, "A", 3)}</strong>`,
          };
        }
        const P1 = rng.pick([1800, 2000, 2200]);
        const P2 = rng.pick([800, 1000, 1200, 1500]);
        const I = (P1 + P2) / 230;
        return {
          prompt: `An einer Steckdosenleiste (230 V) laufen ein Wasserkocher (${fmtUnit(P1, "W", 0)}) und ein Toaster (${fmtUnit(P2, "W", 0)}) gleichzeitig. Welche Gesamtstromstärke fließt? (Die Sicherung löst bei 16 A aus.)`,
          given: [`P_ges = ${fmtUnit(P1, "W", 0)} + ${fmtUnit(P2, "W", 0)} = ${fmtUnit(P1 + P2, "W", 0)}`, "U = 230 V"],
          answer: I,
          unit: "A",
          digits: 2,
          solutionHtml: `I = P_ges / U = ${fmt(P1 + P2, 0)} W / 230 V = <strong>${fmtUnit(I, "A", 2)}</strong>${I > 16 ? " – die Sicherung löst aus!" : " – die Sicherung hält."}`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Watt, Kilowattstunde, Euro: Du liest Typenschilder wie eine Stromrechnung.",
};

// 4.4 Kennlinien und Ohm ───────────────────────────────────────────────────

const kennlinie: Lesson = {
  id: "el-4-kennlinie-ohm",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "4.4 Kennlinien, Widerstand und das Gesetz von Ohm",
  subtitle: "Was die U-I-Kennlinie über ein Bauteil verrät",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 3 (I) · Ph9 LB 3 (II/III): Kennlinien und Widerstand von Leitern, Gesetz von Ohm, Leitwert (I)",
  whyItMatters:
    "Legst du an einen Draht die doppelte Spannung, fließt der doppelte Strom, aber nur, solange er nicht heiß wird. Die Kennlinie zeigt dir, ob ein Bauteil sich an diese Regel hält.",
  explanationHtml: `
    <p>Trägt man für ein Bauteil die Stromstärke I über der Spannung U auf, erhält man seine <strong>U-I-Kennlinie</strong>.</p>
    <ul>
      <li>Der <strong>elektrische Widerstand</strong> ist <em>definiert</em> als <strong>R = U / I</strong>, Einheit <strong>1 Ω (Ohm) = 1 V/A</strong>. Diese Definition gilt für jedes Bauteil und jeden Messpunkt.</li>
      <li>Das <strong>Gesetz von Ohm</strong> ist mehr: Bei <strong>metallischen Leitern mit konstanter Temperatur</strong> ist I proportional zu U. Die Kennlinie ist eine Gerade durch den Ursprung, R ist konstant.</li>
      <li>Eine <strong>Glühlampe</strong> hält sich nicht daran: Ihr Draht wird heiß, der Widerstand steigt, die Kennlinie wird flacher. Ohm gilt hier nicht.</li>
      <li>Der <strong>Leitwert G = 1 / R = I / U</strong> in Siemens (S) sagt, wie gut ein Bauteil leitet.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> R = U / I ist immer die Definition. „Gesetz von Ohm“ heißt: R bleibt konstant, und das gilt nur bei konstanter Temperatur.</div>
  `,
  formulas: [
    { name: "Widerstand (Definition)", html: "R = U / I", quantities: "R in Ω (1 Ω = 1 V/A)" },
    { name: "Gesetz von Ohm", html: "I ~ U bei konstanter Temperatur", quantities: "Kennlinie: Gerade durch den Ursprung" },
    { name: "Leitwert", html: "G = 1 / R = I / U", quantities: "G in S (Siemens)" },
  ],
  quiz: {
    question: "Die Kennlinie einer Glühlampe wird bei höherer Spannung flacher. Was bedeutet das?",
    options: [
      "Der Widerstand der Lampe nimmt mit der Temperatur zu",
      "Der Widerstand der Lampe nimmt ab, weil mehr Strom fließt",
      "Die Lampe hält sich besonders gut an das Gesetz von Ohm",
    ],
    correctIndex: 0,
    explanation: "Flacher heißt: Pro Volt kommt weniger Strom dazu, R = U / I wächst. Der heiße Glühdraht hat einen größeren Widerstand.",
  },
  lab: {
    kind: "characteristic",
    title: "Labor: Kennlinie aufnehmen",
    intro: "Ändere die Spannung und beobachte die Stromstärke. Vergleiche einen Metallwiderstand mit konstanter Temperatur und eine Glühlampe.",
    params: [
      { type: "range", key: "U", label: "Spannung U", unit: "V", min: 0, max: 12, step: 0.1, value: 6, digits: 1 },
      { type: "range", key: "R", label: "Widerstand R (bei 0 V)", unit: "Ω", min: 1, max: 100, step: 1, value: 20 },
      {
        type: "choice",
        key: "device",
        label: "Bauteil",
        options: [
          { value: 0, label: "Metallwiderstand, Temperatur konstant" },
          { value: 1, label: "Glühlampe" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "Reff", label: "Widerstand R = U / I", unit: "Ω", digits: 1, compute: (v) => (v.device === 1 ? v.R * (1 + (1.5 * v.U) / 12) : v.R) },
      { key: "I", label: "Stromstärke I", unit: "A", digits: 3, emphasis: true, compute: (v) => v.U / (v.device === 1 ? v.R * (1 + (1.5 * v.U) / 12) : v.R) },
      { key: "ImA", label: "Stromstärke in mA", unit: "mA", digits: 0, compute: (v) => (1000 * v.U) / (v.device === 1 ? v.R * (1 + (1.5 * v.U) / 12) : v.R) },
      { key: "G", label: "Leitwert G = I / U", unit: "S", digits: 4, compute: (v) => 1 / (v.device === 1 ? v.R * (1 + (1.5 * v.U) / 12) : v.R) },
    ],
    goals: [
      { id: "halbes-ampere", text: "Stelle am Metallwiderstand bei 6 V genau 0,5 A ein (±2 %).", check: (v, r) => v.device === 0 && near(v.U, 6, 0.001) && near(Number(r.I), 0.5, 0.02) },
      { id: "doppelt", text: "Finde bei der Glühlampe die Spannung, bei der ihr Widerstand doppelt so groß ist wie bei 0 V (±0,2 V).", check: (v) => v.device === 1 && within(v.U, 8, 0.2) },
      { id: "proportional", text: "Ohm prüfen: Stelle den Metallwiderstand auf 30 Ω und 6 V (I = 0,2 A). Bei 3 V wären es 0,1 A.", check: (v) => v.device === 0 && v.R === 30 && near(v.U, 6, 0.001) },
    ],
  },
  exercises: [
    {
      id: "widerstand",
      make: (rng, level) => {
        if (level === 1) {
          const U = rng.pick([1.5, 3, 4.5, 6, 9, 12, 24]);
          const I = rng.stepped(0.05, 2, 0.05);
          return {
            prompt: `An einem Bauteil liegen ${fmtUnit(U, "V", 1)} an, es fließen ${fmtUnit(I, "A", 2)}. Berechne den Widerstand.`,
            given: [`U = ${fmtUnit(U, "V", 1)}`, `I = ${fmtUnit(I, "A", 2)}`],
            formulaHint: "R = U / I",
            answer: U / I,
            unit: "Ω",
            digits: 2,
            solutionHtml: `R = U / I = ${fmt(U, 1)} V / ${fmt(I, 2)} A = <strong>${fmtUnit(U / I, "Ω", 2)}</strong>`,
          };
        }
        const U1 = rng.pick([2, 3, 4, 5]);
        const I1 = rng.stepped(0.1, 0.6, 0.05);
        const U2 = U1 * rng.pick([2, 2.5, 3]);
        const I2 = (I1 * U2) / U1;
        return {
          prompt: `Durch einen Metalldraht mit konstanter Temperatur fließen bei ${fmtUnit(U1, "V", 0)} genau ${fmtUnit(I1, "A", 2)}. Welche Stromstärke fließt bei ${fmtUnit(U2, "V", 1)}?`,
          given: [`U₁ = ${fmtUnit(U1, "V", 0)}, I₁ = ${fmtUnit(I1, "A", 2)}`, `U₂ = ${fmtUnit(U2, "V", 1)}`],
          answer: I2,
          unit: "A",
          digits: 3,
          solutionHtml: `Gesetz von Ohm: I ~ U ⇒ I₂ = I₁ · U₂ / U₁ = ${fmt(I1, 2)} A · ${fmt(U2, 1)} / ${fmt(U1, 0)} = <strong>${fmtUnit(I2, "A", 3)}</strong> (R = ${fmtUnit(U1 / I1, "Ω", 1)} bleibt gleich)`,
        };
      },
    },
    {
      id: "stromstaerke-ohm",
      make: (rng, level) => {
        if (level === 1) {
          const U = rng.pick([3, 4.5, 6, 9, 12]);
          const R = rng.pick([10, 15, 20, 25, 30, 40, 50, 60, 100, 150, 200]);
          return {
            prompt: `Ein Widerstand von ${fmtUnit(R, "Ω", 0)} liegt an ${fmtUnit(U, "V", 1)}. Welche Stromstärke fließt?`,
            given: [`U = ${fmtUnit(U, "V", 1)}`, `R = ${fmtUnit(R, "Ω", 0)}`],
            formulaHint: "R = U / I, also I = U / R",
            answer: U / R,
            unit: "A",
            digits: 3,
            solutionHtml: `I = U / R = ${fmt(U, 1)} V / ${fmt(R, 0)} Ω = <strong>${fmtUnit(U / R, "A", 3)}</strong>`,
          };
        }
        const R = rng.pick([200, 250, 400, 500, 800, 1000, 2000, 2500]);
        const G = 1000 / R;
        return {
          prompt: `Ein Bauteil hat den Widerstand ${fmtUnit(R, "Ω", 0)}. Berechne seinen Leitwert in Millisiemens (mS).`,
          given: [`R = ${fmtUnit(R, "Ω", 0)}`],
          answer: G,
          unit: "mS",
          digits: 2,
          solutionHtml: `G = 1 / R = 1 / ${fmt(R, 0)} Ω = ${fmt(1 / R, 4)} S = <strong>${fmtUnit(G, "mS", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Definition und Gesetz sauber getrennt: R = U / I immer, Ohm nur bei konstanter Temperatur.",
};

// 4.5 Widerstandsgesetz ────────────────────────────────────────────────────

const MATERIALS = [
  { name: "Kupfer", rho: 0.0178 },
  { name: "Aluminium", rho: 0.0278 },
  { name: "Eisen", rho: 0.1 },
  { name: "Konstantan", rho: 0.5 },
];

const widerstandsgesetz: Lesson = {
  id: "el-5-widerstandsgesetz",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "4.5 Widerstandsgesetz und Temperaturabhängigkeit",
  subtitle: "Wovon der Widerstand eines Drahtes abhängt",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 3 (I) · Ph9 LB 3 (II/III): Widerstandsgesetz, Abhängigkeit des elektrischen Widerstands von der Temperatur, Supraleitung (I)",
  whyItMatters:
    "Warum sind Starkstromkabel dick und Heizdrähte dünn und lang? Weil Länge, Querschnitt und Material den Widerstand bestimmen. Und Temperatur spielt auch noch mit.",
  explanationHtml: `
    <p>Der Widerstand eines Drahtes hängt von drei Dingen ab. Das <strong>Widerstandsgesetz</strong> fasst sie zusammen:</p>
    <p class="formula-line">R = ρ · l / A</p>
    <ul>
      <li><strong>Länge l:</strong> Doppelte Länge, doppelter Widerstand (R ~ l).</li>
      <li><strong>Querschnittsfläche A:</strong> Doppelter Querschnitt, halber Widerstand (R ~ 1/A). Für einen runden Draht gilt A = π · d² / 4.</li>
      <li><strong>Material:</strong> Der <strong>spezifische Widerstand ρ</strong> in Ω · mm²/m. Kupfer 0,0178, Aluminium 0,0278, Eisen etwa 0,10, Konstantan 0,50.</li>
      <li><strong>Temperatur:</strong> Bei Metallen steigt der Widerstand mit der Temperatur (Kaltleiter). Konstantan ist eine Legierung, deren Widerstand kaum von der Temperatur abhängt, deshalb der Name.</li>
      <li><strong>Supraleitung:</strong> Unterhalb einer Sprungtemperatur nahe dem absoluten Nullpunkt verschwindet der Widerstand mancher Stoffe vollständig.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Lang und dünn: großer Widerstand. Kurz und dick: kleiner Widerstand. Material über ρ, Temperatur bei Metallen nach oben.</div>
  `,
  formulas: [
    { name: "Widerstandsgesetz", html: "R = ρ · l / A", quantities: "R in Ω, ρ in Ω·mm²/m, l in m, A in mm²" },
    { name: "Querschnitt eines runden Drahtes", html: "A = π · d² / 4", quantities: "d Durchmesser in mm" },
  ],
  quiz: {
    question: "Ein Draht wird durch einen gleich langen Draht aus demselben Material mit doppeltem Durchmesser ersetzt. Wie ändert sich der Widerstand?",
    options: [
      "Er halbiert sich",
      "Er sinkt auf ein Viertel",
      "Er verdoppelt sich",
    ],
    correctIndex: 1,
    explanation: "Doppelter Durchmesser bedeutet vierfachen Querschnitt (A ~ d²). R ~ 1/A sinkt auf ein Viertel.",
  },
  lab: {
    kind: "resistance-wire",
    title: "Labor: Draht am Ohmmeter",
    intro: "Wähle Material, Länge und Querschnitt des Drahtes und lies den Widerstand ab.",
    params: [
      {
        type: "choice",
        key: "mat",
        label: "Material",
        options: MATERIALS.map((m, index) => ({ value: index, label: `${m.name} (ρ = ${fmt(m.rho, 4)} Ω·mm²/m)` })),
        value: 0,
      },
      { type: "range", key: "l", label: "Länge l", unit: "m", min: 0.1, max: 100, step: 0.1, value: 10, digits: 1 },
      { type: "range", key: "A", label: "Querschnitt A", unit: "mm²", min: 0.1, max: 10, step: 0.1, value: 1.5, digits: 1 },
    ],
    readouts: [
      { key: "material", label: "Material", compute: (v) => MATERIALS[v.mat]?.name ?? "" },
      { key: "rho", label: "Spezifischer Widerstand ρ", unit: "Ω·mm²/m", digits: 4, compute: (v) => MATERIALS[v.mat]?.rho ?? 0 },
      { key: "R", label: "Widerstand R = ρ · l / A", unit: "Ω", digits: 3, emphasis: true, compute: (v) => ((MATERIALS[v.mat]?.rho ?? 0) * v.l) / v.A },
      { key: "G", label: "Leitwert G", unit: "S", digits: 3, compute: (v) => v.A / ((MATERIALS[v.mat]?.rho ?? 1) * v.l) },
    ],
    goals: [
      { id: "zehn-ohm", text: "Baue aus Konstantan einen Widerstand von 10 Ω (±2 %).", check: (v, r) => v.mat === 3 && near(Number(r.R), 10, 0.02) },
      { id: "kupfer", text: "Ein 10 m langes Kupferkabel soll weniger als 0,1 Ω haben. Wähle den Querschnitt.", check: (v, r) => v.mat === 0 && near(v.l, 10, 0.001) && Number(r.R) < 0.1 },
      { id: "doppelt", text: "Verdopple nur den Querschnitt: Stelle Eisen, 10 m und 2 mm² ein (halb so viel wie bei 1 mm²).", check: (v) => v.mat === 2 && near(v.l, 10, 0.001) && near(v.A, 2, 0.001) },
    ],
  },
  exercises: [
    {
      id: "widerstand-draht",
      make: (rng, level) => {
        if (level === 1) {
          const mat = rng.pick(MATERIALS);
          const l = rng.int(1, 50);
          const A = rng.pick([0.25, 0.5, 0.75, 1, 1.5, 2.5, 4]);
          const R = (mat.rho * l) / A;
          return {
            prompt: `Ein ${mat.name}draht (ρ = ${fmt(mat.rho, 4)} Ω·mm²/m) ist ${fmtUnit(l, "m", 0)} lang und hat ${fmtUnit(A, "mm²", 2)} Querschnitt. Berechne seinen Widerstand.`,
            given: [`ρ = ${fmt(mat.rho, 4)} Ω·mm²/m`, `l = ${fmtUnit(l, "m", 0)}`, `A = ${fmtUnit(A, "mm²", 2)}`],
            formulaHint: "R = ρ · l / A",
            answer: R,
            unit: "Ω",
            digits: 3,
            solutionHtml: `R = ρ · l / A = ${fmt(mat.rho, 4)} · ${fmt(l, 0)} / ${fmt(A, 2)} Ω = <strong>${fmtUnit(R, "Ω", 3)}</strong>`,
          };
        }
        const l = rng.int(10, 60);
        const A = rng.pick([1.5, 2.5, 4]);
        const R = (0.0178 * 2 * l) / A;
        return {
          prompt: `Eine Verlängerungsleitung aus Kupfer (ρ = 0,0178 Ω·mm²/m) ist ${fmtUnit(l, "m", 0)} lang, jede Ader hat ${fmtUnit(A, "mm²", 1)}. Der Strom fließt durch Hin- und Rückleiter. Berechne den Gesamtwiderstand der Leitung.`,
          given: [`Gesamtlänge des Stromwegs: 2 · ${fmt(l, 0)} m = ${fmtUnit(2 * l, "m", 0)}`, `A = ${fmtUnit(A, "mm²", 1)}`, "ρ = 0,0178 Ω·mm²/m"],
          answer: R,
          unit: "Ω",
          digits: 3,
          solutionHtml: `R = ρ · l / A = 0,0178 · ${fmt(2 * l, 0)} / ${fmt(A, 1)} Ω = <strong>${fmtUnit(R, "Ω", 3)}</strong>`,
        };
      },
    },
    {
      id: "laenge-querschnitt",
      make: (rng, level) => {
        if (level === 1) {
          const mat = rng.pick(MATERIALS);
          const A = rng.pick([0.2, 0.5, 1, 1.5]);
          const R = rng.pick([0.5, 1, 2, 5, 10]);
          const l = (R * A) / mat.rho;
          return {
            prompt: `Wie lang muss ein ${mat.name}draht (ρ = ${fmt(mat.rho, 4)} Ω·mm²/m) mit ${fmtUnit(A, "mm²", 1)} sein, damit er ${fmtUnit(R, "Ω", 1)} hat?`,
            given: [`R = ${fmtUnit(R, "Ω", 1)}`, `A = ${fmtUnit(A, "mm²", 1)}`, `ρ = ${fmt(mat.rho, 4)} Ω·mm²/m`],
            formulaHint: "R = ρ · l / A, also l = R · A / ρ",
            answer: l,
            unit: "m",
            digits: 2,
            solutionHtml: `l = R · A / ρ = ${fmt(R, 1)} · ${fmt(A, 1)} / ${fmt(mat.rho, 4)} m = <strong>${fmtUnit(l, "m", 2)}</strong>`,
          };
        }
        const d = rng.pick([0.2, 0.3, 0.4, 0.5]);
        const R = rng.pick([20, 25, 30, 40, 50]);
        const A = (Math.PI * d * d) / 4;
        const l = (R * A) / 0.5;
        return {
          prompt: `Ein Heizdraht aus Konstantan (ρ = 0,5 Ω·mm²/m) hat den Durchmesser ${fmtUnit(d, "mm", 1)}. Wie lang muss er für einen Widerstand von ${fmtUnit(R, "Ω", 0)} sein?`,
          given: [`d = ${fmtUnit(d, "mm", 1)}`, `R = ${fmtUnit(R, "Ω", 0)}`, "ρ = 0,5 Ω·mm²/m"],
          answer: l,
          unit: "m",
          digits: 2,
          solutionHtml: `A = π · d² / 4 = π · ${fmt(d, 1)}² / 4 mm² = ${fmtUnit(A, "mm²", 4)}<br>l = R · A / ρ = ${fmt(R, 0)} · ${fmt(A, 4)} / 0,5 m = <strong>${fmtUnit(l, "m", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Lang, dünn, Material: Du berechnest Drähte nach dem Widerstandsgesetz.",
};

// 4.6 Halbleiter ───────────────────────────────────────────────────────────

const halbleiter: Lesson = {
  id: "el-6-halbleiter",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "4.6 Halbleiter: NTC, LDR, Diode, LED und Solarzelle",
  subtitle: "Bauteile, die auf Wärme, Licht und Stromrichtung reagieren",
  tracks: ["I"],
  lehrplan: "Ph9 LB 3 (I): Halbleiter, Heißleiter (NTC), Fotowiderstand (LDR), Halbleiterdiode, Leuchtdiode (LED), Solarzelle",
  whyItMatters:
    "Ohne Halbleiter kein Smartphone: Dioden lassen Strom nur in eine Richtung durch, LEDs leuchten, Solarzellen liefern Strom aus Licht, NTC und LDR messen Temperatur und Helligkeit.",
  explanationHtml: `
    <p><strong>Halbleiter</strong> wie Silizium leiten bei Zimmertemperatur schlecht. Wärme, Licht oder gezielt eingebaute Fremdatome (Dotierung) setzen Ladungsträger frei und verbessern die Leitfähigkeit.</p>
    <ul>
      <li><strong>Heißleiter (NTC):</strong> Der Widerstand <strong>sinkt</strong> mit steigender Temperatur, genau umgekehrt wie bei Metallen. Einsatz als Temperaturfühler.</li>
      <li><strong>Fotowiderstand (LDR):</strong> Der Widerstand sinkt, je heller es wird. Einsatz in Dämmerungsschaltern.</li>
      <li><strong>Halbleiterdiode:</strong> Am pn-Übergang entsteht eine Sperrschicht. In <strong>Durchlassrichtung</strong> (Pluspol an p) fließt ab etwa 0,7 V (Silizium) Strom, in <strong>Sperrrichtung</strong> praktisch keiner. Die Kennlinie ist stark gekrümmt.</li>
      <li><strong>Leuchtdiode (LED):</strong> Eine Diode, die in Durchlassrichtung Licht aussendet. Sie braucht einen <strong>Vorwiderstand</strong>: R<sub>V</sub> = (U − U<sub>LED</sub>) / I.</li>
      <li><strong>Solarzelle:</strong> Ein großflächiger pn-Übergang. Licht erzeugt Ladungsträger, es entsteht eine Spannung von etwa 0,5 bis 0,6 V pro Zelle. Mehrere Zellen in Reihe ergeben ein Modul.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> NTC: warm leitet besser. LDR: hell leitet besser. Diode: Einbahnstraße ab 0,7 V. LED immer mit Vorwiderstand.</div>
  `,
  formulas: [
    { name: "Vorwiderstand einer LED", html: "R<sub>V</sub> = (U − U<sub>LED</sub>) / I", quantities: "U Versorgungsspannung, U_LED Durchlassspannung (rot ≈ 1,8 V, blau/weiß ≈ 3 V), I in A" },
    { name: "Solarmodul", html: "U<sub>ges</sub> = n · U<sub>Zelle</sub>", quantities: "n Zellen in Reihe" },
  ],
  quiz: {
    question: "Wie verhält sich der Widerstand eines NTC, wenn er wärmer wird?",
    options: [
      "Er steigt wie bei einem Metall",
      "Er sinkt, der NTC leitet besser",
      "Er bleibt gleich, deshalb heißt er Heißleiter",
    ],
    correctIndex: 1,
    explanation: "Wärme setzt im Halbleiter Ladungsträger frei: Der Heißleiter leitet heiß besser, sein Widerstand sinkt.",
  },
  lab: {
    kind: "semiconductor",
    title: "Labor: Halbleiter-Kennlinien",
    intro: "Wähle ein Bauteil und ändere Temperatur, Beleuchtung oder Spannung. Lies Widerstand oder Stromstärke an der Kennlinie ab.",
    params: [
      {
        type: "choice",
        key: "dev",
        label: "Bauteil",
        options: [
          { value: 0, label: "Heißleiter (NTC)" },
          { value: 1, label: "Fotowiderstand (LDR)" },
          { value: 2, label: "Silizium-Diode" },
        ],
        value: 0,
      },
      { type: "range", key: "theta", label: "Temperatur ϑ (NTC)", unit: "°C", min: 0, max: 100, step: 1, value: 25 },
      { type: "range", key: "E", label: "Beleuchtungsstärke (LDR)", unit: "lx", min: 1, max: 1000, step: 1, value: 100 },
      { type: "range", key: "U", label: "Spannung U (Diode)", unit: "V", min: -5, max: 0.9, step: 0.01, value: 0.6, digits: 2 },
    ],
    readouts: [
      { key: "RN", label: "NTC: Widerstand", unit: "kΩ", digits: 2, compute: (v) => 10 * Math.exp(3500 * (1 / (v.theta + 273.15) - 1 / 298.15)) },
      { key: "RL", label: "LDR: Widerstand", unit: "kΩ", digits: 1, compute: (v) => 100 * (v.E / 10) ** -0.7 },
      { key: "ID", label: "Diode: Stromstärke", unit: "mA", digits: 2, compute: (v) => (v.U < 0 ? 0 : 1e-8 * (Math.exp(v.U / 0.04) - 1)) },
      {
        key: "active",
        label: "Ablesung",
        emphasis: true,
        compute: (v) => {
          if (v.dev === 0) {
            const R = 10 * Math.exp(3500 * (1 / (v.theta + 273.15) - 1 / 298.15));
            return `NTC bei ${fmt(v.theta, 0)} °C: R = ${fmtUnit(R, "kΩ", 2)}`;
          }
          if (v.dev === 1) {
            const R = 100 * (v.E / 10) ** -0.7;
            return `LDR bei ${fmt(v.E, 0)} lx: R = ${fmtUnit(R, "kΩ", 1)}`;
          }
          const I = v.U < 0 ? 0 : 1e-8 * (Math.exp(v.U / 0.04) - 1);
          return `Diode bei ${fmt(v.U, 2)} V: I = ${fmtUnit(I, "mA", 2)} (${v.U < 0 ? "Sperrrichtung" : I < 0.1 ? "noch gesperrt" : "Durchlassrichtung"})`;
        },
      },
    ],
    goals: [
      { id: "ntc", text: "Finde die Temperatur, bei der der NTC nur noch 1 kΩ hat (±0,1 kΩ).", check: (v, r) => v.dev === 0 && within(Number(r.RN), 1, 0.1) },
      { id: "diode", text: "Finde die Spannung, ab der die Diode zwischen 1 mA und 3 mA durchlässt.", check: (v, r) => v.dev === 2 && Number(r.ID) >= 1 && Number(r.ID) <= 3 },
      { id: "ldr", text: "Mache es so dunkel, dass der LDR mindestens 300 kΩ hat.", check: (v, r) => v.dev === 1 && Number(r.RL) >= 300 },
    ],
  },
  exercises: [
    {
      id: "led-vorwiderstand",
      make: (rng, level) => {
        if (level === 1) {
          const U = rng.pick([5, 6, 9, 12]);
          const Uled = rng.pick([1.8, 2, 2.2, 3, 3.3]);
          const ImA = rng.pick([10, 15, 20, 25]);
          const R = (U - Uled) / (ImA / 1000);
          return {
            prompt: `Eine LED (Durchlassspannung ${fmtUnit(Uled, "V", 1)}) soll an ${fmtUnit(U, "V", 0)} mit ${fmtUnit(ImA, "mA", 0)} betrieben werden. Berechne den Vorwiderstand.`,
            given: [`U = ${fmtUnit(U, "V", 0)}`, `U_LED = ${fmtUnit(Uled, "V", 1)}`, `I = ${fmtUnit(ImA, "mA", 0)} = ${fmtUnit(ImA / 1000, "A", 3)}`],
            formulaHint: "R_V = (U − U_LED) / I",
            answer: R,
            unit: "Ω",
            digits: 0,
            solutionHtml: `R_V = (U − U_LED) / I = (${fmt(U, 0)} − ${fmt(Uled, 1)}) V / ${fmt(ImA / 1000, 3)} A = <strong>${fmtUnit(R, "Ω", 0)}</strong>`,
          };
        }
        const Uled = rng.pick([1.8, 2.1, 3.2]);
        const ImA = rng.pick([12, 15, 18, 20]);
        const colour = Uled < 2 ? "rote" : Uled < 3 ? "gelbe" : "weiße";
        const R = (9 - Uled) / (ImA / 1000);
        return {
          prompt: `Eine ${colour} LED (Durchlassspannung ${fmtUnit(Uled, "V", 1)}) soll an einer 9-V-Blockbatterie mit ${fmtUnit(ImA, "mA", 0)} leuchten. Welcher Vorwiderstand ist nötig?`,
          given: [`U = 9 V`, `U_LED = ${fmtUnit(Uled, "V", 1)}`, `I = ${fmtUnit(ImA, "mA", 0)}`],
          answer: R,
          unit: "Ω",
          digits: 0,
          solutionHtml: `Am Vorwiderstand fallen ${fmt(9 - Uled, 1)} V ab.<br>R_V = ${fmt(9 - Uled, 1)} V / ${fmt(ImA / 1000, 3)} A = <strong>${fmtUnit(R, "Ω", 0)}</strong>`,
        };
      },
    },
    {
      id: "solarzelle-reihe",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(4, 36);
          const Uz = rng.pick([0.5, 0.55, 0.6]);
          return {
            prompt: `${fmt(n, 0)} Solarzellen mit je ${fmtUnit(Uz, "V", 2)} werden in Reihe geschaltet. Welche Gesamtspannung liefert das Modul?`,
            given: [`n = ${fmt(n, 0)}`, `U_Zelle = ${fmtUnit(Uz, "V", 2)}`],
            formulaHint: "Reihenschaltung: U_ges = n · U_Zelle",
            answer: n * Uz,
            unit: "V",
            digits: 2,
            solutionHtml: `U_ges = n · U_Zelle = ${fmt(n, 0)} · ${fmt(Uz, 2)} V = <strong>${fmtUnit(n * Uz, "V", 2)}</strong>`,
          };
        }
        const Uz = rng.pick([0.5, 0.6]);
        const target = rng.pick([6, 9, 12, 18, 24]);
        const n = Math.ceil(target / Uz);
        return {
          prompt: `Ein Solarmodul soll mindestens ${fmtUnit(target, "V", 0)} liefern. Eine Zelle gibt ${fmtUnit(Uz, "V", 1)}. Wie viele Zellen müssen mindestens in Reihe geschaltet werden?`,
          given: [`U_ges ≥ ${fmtUnit(target, "V", 0)}`, `U_Zelle = ${fmtUnit(Uz, "V", 1)}`],
          answer: n,
          unit: "Zellen",
          digits: 0,
          tolerance: 0,
          absTolerance: 0.4,
          solutionHtml: `n = U_ges / U_Zelle = ${fmt(target, 0)} V / ${fmt(Uz, 1)} V = ${fmt(target / Uz, 1)}, aufgerundet <strong>${fmt(n, 0)} Zellen</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "NTC, LDR, Diode, LED, Solarzelle: Du weißt, worauf jedes Halbleiterbauteil reagiert.",
};

export const STAGE_ELEKTRIK: Stage = {
  id: STAGE_ID,
  stageNumber: 4,
  title: "Elektrizitätslehre",
  subtitle: "Elektromagnetismus, Motor, Energie und Leistung, Kennlinien, Widerstand und Halbleiter",
  icon: "⚡",
  accent: "#7c3aed",
  badgeTitle: "Stromkreis-Meister",
  lehrplanLabel: "Ph9 LB 3 (I) · Ph9 LB 3 (II/III)",
  lessons: [elektromagnet, lorentz, energieLeistung, kennlinie, widerstandsgesetz, halbleiter],
};
