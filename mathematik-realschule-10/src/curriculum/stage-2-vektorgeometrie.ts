import type { Lesson, Stage } from "../model/types";
import { numberField } from "./helpers";

const vektorbegriff: Lesson = {
  id: "vg-1-vektorbegriff",
  stageId: "st-2-vektorgeometrie",
  stepNumber: 1,
  title: "2.1 Der Vektorbegriff und Gegenvektoren",
  subtitle: "Pfeilklassen, Koordinaten und die Spitze-minus-Schaft-Regel",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 2.1",
  whyItMatters:
    "Ein Vektor beschreibt eine Verschiebung: Richtung und Weite im Raum. In der Physik stehen Vektoren für Kräfte, Geschwindigkeiten und Beschleunigungen.",
  explanationHtml: `
    <p>Ein <strong>Vektor</strong> fasst alle zueinander parallelen, gleich langen und gleich gerichteten Pfeile zu einer <em>Pfeilklasse</em> zusammen.</p>
    <p>Für zwei Punkte <em>A(x_A | y_A)</em> (Schaft) und <em>B(x_B | y_B)</em> (Spitze) berechnet man den Verbindungsvektor nach der <strong>Spitze-minus-Schaft-Regel</strong>:</p>
    <p class="formula-center"><strong>v = AB = B - A = (x_B - x_A, y_B - y_A)ᵀ</strong></p>
    <p>Der <strong>Gegenvektor</strong> <em>-v = BA</em> hat dieselbe Länge und Richtung, aber den entgegengesetzten Richtungssinn: <em>-v = (-v_x, -v_y)ᵀ</em>.</p>
  `,
  formulas: [
    {
      name: "Spitze minus Schaft",
      html: "v = AB = (x_B - x_A | y_B - y_A)ᵀ",
      quantities: "A Schaft (Startpunkt), B Spitze (Endpunkt)",
    },
    {
      name: "Gegenvektor",
      html: "-v = BA = (-v_x | -v_y)ᵀ",
      quantities: "v + (-v) = 0 (Nullvektor)",
    },
  ],
  quiz: {
    question: "Welchen Vektor AB erhält man für die Punkte A(-2 | 3) und B(4 | -5)?",
    options: [
      "AB = (6 | -8)ᵀ",
      "AB = (2 | -2)ᵀ",
      "AB = (-6 | 8)ᵀ",
      "AB = (8 | -8)ᵀ",
    ],
    correctIndex: 0,
    explanation:
      "Nach der Regel 'Spitze minus Schaft': x = 4 - (-2) = 6 und y = -5 - 3 = -8, also AB = (6 | -8)ᵀ.",
  },
  lab: {
    kind: "vector-plane",
    title: "Vektor-Labor",
    intro: "Verändere die x- und y-Komponenten des Vektors und sieh dir Betrag und Richtung an.",
    params: [
      { type: "range", key: "vx", label: "v_x", unit: "", min: -5, max: 8, step: 1, value: 4 },
      { type: "range", key: "vy", label: "v_y", unit: "", min: -4, max: 7, step: 1, value: 3 },
    ],
    readouts: [
      {
        key: "lenVal",
        label: "Länge |v|",
        digits: 2,
        emphasis: true,
        compute: (v) => {
          const vx = v.vx ?? 4;
          const vy = v.vy ?? 3;
          return Math.round(Math.sqrt(vx * vx + vy * vy) * 100) / 100;
        },
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle einen Vektor mit v_x = 6 und v_y = 8 ein (Länge |v| = 10).",
        check: (v) => (v.vx ?? 0) === 6 && (v.vy ?? 0) === 8,
      },
    ],
  },
  exercises: [
    {
      id: "ex-vg-1",
      make(rng, _level) {
      const ax = rng.int(-4, 3);
      const ay = rng.int(-2, 5);
      const vx = rng.int(2, 6);
      const vy = rng.int(-5, 5);
      const bx = ax + vx;
      const by = ay + vy;
      return {
        prompt: `Bestimme den Verbindungsvektor <strong>AB</strong> für die Punkte <strong>A(${ax} | ${ay})</strong> und <strong>B(${bx} | ${by})</strong>.`,
        given: [`A(${ax} | ${ay})`, `B(${bx} | ${by})`],
        formulaHint: "AB = (x_B - x_A | y_B - y_A)ᵀ",
        fields: [numberField("v_x =", vx), numberField("v_y =", vy)],
        steps: [
          `Spitze minus Schaft: v_x = ${bx} - (${ax}) = <strong>${vx}</strong>`,
          `v_y = ${by} - (${ay}) = <strong>${vy}</strong>`,
          `Also AB = (${vx} | ${vy})ᵀ.`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Super! Du beherrschst die Spitze-minus-Schaft-Regel und den Vektorbegriff.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=9C1OOlLng2Q",
    title: "Vektoren Definition & ihre Repräsentanten",
    author: "Daniel Jung",
  },
};

const vektorbetrag: Lesson = {
  id: "vg-2-vektorbetrag",
  stageId: "st-2-vektorgeometrie",
  stepNumber: 2,
  title: "2.2 Betrag und Länge eines Vektors",
  subtitle: "Satz des Pythagoras für Vektorkoordinaten",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 2.1",
  whyItMatters:
    "Der Betrag eines Vektors entspricht dem geometrischen Abstand zwischen Start- und Endpunkt. Er bestimmt z. B. die Kraftstärke oder Reisegeschwindigkeit.",
  explanationHtml: `
    <p>Der <strong>Betrag</strong> eines zweidimensionalen Vektors <em>v = (v_x, v_y)ᵀ</em> ist seine geometrische Länge. Nach dem Satz des Pythagoras gilt:</p>
    <p class="formula-center"><strong>|v| = √(v_x² + v_y²)</strong></p>
    <p>Bekannte Pythagoreische Zahlentripel erleichtern das Kopfrechnen:</p>
    <ul>
      <li>(3, 4)ᵀ hat die Länge |v| = √(9 + 16) = √25 = 5 LE.</li>
      <li>(5, 12)ᵀ hat die Länge |v| = √(25 + 144) = √169 = 13 LE.</li>
      <li>(6, 8)ᵀ hat die Länge |v| = √(36 + 64) = √100 = 10 LE.</li>
    </ul>
  `,
  formulas: [
    {
      name: "Vektorbetrag (Länge)",
      html: "|v| = √(v_x² + v_y²)",
      quantities: "v_x horizontale, v_y vertikale Koordinate",
    },
    {
      name: "Streckenlänge AB",
      html: "|AB| = √((x_B - x_A)² + (y_B - y_A)²)",
      quantities: "Abstand zwischen Punkt A und B",
    },
  ],
  quiz: {
    question: "Wie berechnet man den Betrag des Vektors v = (3 | 4)ᵀ?",
    options: [
      "|v| = √(3² + 4²) = √25 = 5 LE",
      "|v| = 3 + 4 = 7 LE",
      "|v| = 3 · 4 = 12 LE",
      "|v| = √(4 - 3) = 1 LE",
    ],
    correctIndex: 0,
    explanation:
      "Nach der Abstandsformel mit Pythagoras: |v| = √(3² + 4²) = √(9 + 16) = √25 = 5 LE.",
  },
  lab: {
    kind: "vector-plane",
    title: "Vektorbetrags-Labor",
    intro: "Erzeuge Vektoren und lies deren Betrag |v| ab.",
    params: [
      { type: "range", key: "vx", label: "v_x", unit: "", min: 0, max: 8, step: 1, value: 3 },
      { type: "range", key: "vy", label: "v_y", unit: "", min: 0, max: 8, step: 1, value: 4 },
    ],
    readouts: [
      {
        key: "lenVal",
        label: "Länge |v|",
        digits: 2,
        emphasis: true,
        compute: (v) => Math.round(Math.sqrt((v.vx ?? 3) ** 2 + (v.vy ?? 4) ** 2) * 100) / 100,
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle v = (5 | 12) oder v = (3 | 4) ein und überprüfe die ganzzahlige Länge.",
        check: (v) => ((v.vx ?? 0) === 3 && (v.vy ?? 0) === 4) || ((v.vx ?? 0) === 4 && (v.vy ?? 0) === 3),
      },
    ],
  },
  exercises: [
    {
      id: "ex-vg-2",
      make(rng, _level) {
      const trip = rng.pick([
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
        [8, 15, 17],
        [9, 12, 15],
      ]);
      const vx = trip[0];
      const vy = trip[1];
      const len = trip[2];
      return {
        prompt: `Berechne den Betrag des Vektors <strong>v = (${vx} | ${vy})ᵀ</strong>.`,
        given: [`v = (${vx} | ${vy})ᵀ`],
        formulaHint: "|v| = √(v_x² + v_y²)",
        fields: [numberField("|v| =", len, "LE", 0)],
        steps: [
          `Formel ansetzen: |v| = √(${vx}² + ${vy}²)`,
          `Quadrate addieren: √(${vx * vx} + ${vy * vy}) = √(${len * len})`,
          `Wurzel ziehen: |v| = <strong>${len} LE</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Stark! Du berechnest Vektorbeträge blitzschnell und präzise.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=yJLviEtfbFI",
    title: "Länge (Betrag) eines Vektors berechnen",
    author: "Daniel Jung",
  },
};

const vektorrechnung: Lesson = {
  id: "vg-3-vektorrechnung",
  stageId: "st-2-vektorgeometrie",
  stepNumber: 3,
  title: "2.3 Addition, Subtraktion & Skalarmultiplikation",
  subtitle: "Aneinanderhängen von Pfeilen und Streckung mit einem Faktor k",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 2.1",
  whyItMatters:
    "Gleichzeitige Bewegungen (z. B. Flugzeuggeschwindigkeit plus Seitenwind) werden durch Vektoraddition modelliert.",
  explanationHtml: `
    <p>Das Rechnen mit Vektoren erfolgt komponentenweise:</p>
    <ul>
      <li><strong>Vektoraddition:</strong> a + b = (a_x + b_x, a_y + b_y)ᵀ (Pfeil an Pfeil hängen).</li>
      <li><strong>Vektorsubtraktion:</strong> a - b = a + (-b) = (a_x - b_x, a_y - b_y)ᵀ.</li>
      <li><strong>S-Multiplikation:</strong> k · a = (k · a_x, k · a_y)ᵀ (Verlängerung/Verkürzung um Faktor k; bei k < 0 Richtungsumkehr).</li>
    </ul>
  `,
  formulas: [
    {
      name: "Vektoraddition",
      html: "a + b = (a_x + b_x | a_y + b_y)ᵀ",
      quantities: "Komponentenweise Addition",
    },
    {
      name: "Skalarmultiplikation",
      html: "k · a = (k · a_x | k · a_y)ᵀ",
      quantities: "k ∈ ℝ Streckfaktor",
    },
  ],
  quiz: {
    question: "Was ergibt die Addition der Vektoren a = (2 | -3)ᵀ und b = (4 | 5)ᵀ?",
    options: ["(6 | 2)ᵀ", "(6 | -8)ᵀ", "(8 | -15)ᵀ", "(2 | 8)ᵀ"],
    correctIndex: 0,
    explanation:
      "Komponentenweise addieren: 2 + 4 = 6 und -3 + 5 = 2. Das Ergebnis ist (6 | 2)ᵀ.",
  },
  lab: {
    kind: "vector-plane",
    title: "Vektoradditions-Labor",
    intro: "Erkunde die komponentenweise Addition von Vektoren.",
    params: [
      { type: "range", key: "vx", label: "k · v_x", unit: "", min: -6, max: 6, step: 1, value: 2 },
      { type: "range", key: "vy", label: "k · v_y", unit: "", min: -6, max: 6, step: 1, value: 4 },
    ],
    readouts: [
      {
        key: "lenVal",
        label: "Resultierende Länge",
        digits: 2,
        compute: (v) => Math.round(Math.sqrt((v.vx ?? 2) ** 2 + (v.vy ?? 4) ** 2) * 100) / 100,
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle v = (0 | 0) ein (den Nullvektor).",
        check: (v) => (v.vx ?? 1) === 0 && (v.vy ?? 1) === 0,
      },
    ],
  },
  exercises: [
    {
      id: "ex-vg-3",
      make(rng, _level) {
      const ax = rng.int(-4, 5);
      const ay = rng.int(-4, 5);
      const bx = rng.int(-4, 5);
      const by = rng.int(-4, 5);
      const rx = ax + bx;
      const ry = ay + by;
      return {
        prompt: `Berechne die Summe der Vektoren <strong>a = (${ax} | ${ay})ᵀ</strong> und <strong>b = (${bx} | ${by})ᵀ</strong>.`,
        given: [`a = (${ax} | ${ay})ᵀ`, `b = (${bx} | ${by})ᵀ`],
        formulaHint: "c = a + b = (a_x + b_x | a_y + b_y)ᵀ",
        fields: [numberField("c_x =", rx), numberField("c_y =", ry)],
        steps: [
          `x-Koordinate: ${ax} + (${bx}) = <strong>${rx}</strong>`,
          `y-Koordinate: ${ay} + (${by}) = <strong>${ry}</strong>`,
          `Ergebnis: c = (${rx} | ${ry})ᵀ`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Klasse! Du addierst und streckst Vektoren sicher.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=XKr6Qe9_trY",
    title: "Rechnen mit Vektoren, Grundlagen, Basics",
    author: "Daniel Jung",
  },
};

const skalarprodukt: Lesson = {
  id: "vg-4-skalarprodukt",
  stageId: "st-2-vektorgeometrie",
  stepNumber: 4,
  title: "2.4 Das Skalarprodukt zweier Vektoren",
  subtitle: "Zahlenwert aus zwei Vektoren und der Schnittwinkel",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 2.2",
  whyItMatters:
    "Das Skalarprodukt misst, wie weit zwei Richtungen übereinstimmen. In der Physik entspricht Kraft mal Weg entlang der Bahn der verrichteten Arbeit (W = F · s).",
  explanationHtml: `
    <p>Das <strong>Skalarprodukt</strong> zweier Vektoren <em>a = (a_x, a_y)ᵀ</em> und <em>b = (b_x, b_y)ᵀ</em> ist eine <strong>Zahl (ein Skalar)</strong>:</p>
    <p class="formula-center"><strong>a · b = a_x · b_x + a_y · b_y</strong></p>
    <p>Geometrisch hängt es mit dem eingeschlossenen Winkel <em>φ</em> zusammen:</p>
    <p class="formula-center"><strong>a · b = |a| · |b| · cos φ</strong>  ⟺  <strong>cos φ = (a · b) / (|a| · |b|)</strong></p>
  `,
  formulas: [
    {
      name: "Skalarprodukt",
      html: "a · b = a_x · b_x + a_y · b_y",
      quantities: "Ergebnis ist eine reelle Zahl",
    },
    {
      name: "Winkelformel",
      html: "cos φ = (a · b) / (|a| · |b|)",
      quantities: "φ eingeschlossener Schnittwinkel (0° ≤ φ ≤ 180°)",
    },
  ],
  quiz: {
    question: "Was ist das Ergebnis des Skalarprodukts zweier Vektoren?",
    options: [
      "Eine reelle Zahl (ein Skalar)",
      "Wieder ein zweidimensionaler Vektor",
      "Eine 2x2-Matrix",
      "Ein Kreisbogen",
    ],
    correctIndex: 0,
    explanation:
      "Das Skalarprodukt zweier Vektoren liefert eine Zahl (Skalar), keinen Vektor. Daher rührt der Name 'Skalarprodukt'.",
  },
  lab: {
    kind: "dot-product",
    title: "Skalarprodukt-Labor",
    intro: "Verändere die Vektoren a und b und beobachte den Wert des Skalarprodukts.",
    params: [
      { type: "range", key: "ax", label: "a_x", unit: "", min: -4, max: 6, step: 1, value: 4 },
      { type: "range", key: "ay", label: "a_y", unit: "", min: -4, max: 6, step: 1, value: 2 },
      { type: "range", key: "bx", label: "b_x", unit: "", min: -4, max: 6, step: 1, value: -2 },
      { type: "range", key: "by", label: "b_y", unit: "", min: -4, max: 6, step: 1, value: 4 },
    ],
    readouts: [
      {
        key: "dotVal",
        label: "Skalarprodukt a · b",
        emphasis: true,
        compute: (v) => (v.ax ?? 4) * (v.bx ?? -2) + (v.ay ?? 2) * (v.by ?? 4),
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle die Vektoren so ein, dass ihr Skalarprodukt genau 0 ergibt.",
        check: (v) => (v.ax ?? 0) * (v.bx ?? 0) + (v.ay ?? 0) * (v.by ?? 0) === 0,
      },
    ],
  },
  exercises: [
    {
      id: "ex-vg-4",
      make(rng, _level) {
      const ax = rng.int(-4, 5);
      const ay = rng.int(-4, 5);
      const bx = rng.int(-4, 5);
      const by = rng.int(-4, 5);
      const dot = ax * bx + ay * by;
      return {
        prompt: `Berechne das Skalarprodukt der Vektoren <strong>a = (${ax} | ${ay})ᵀ</strong> und <strong>b = (${bx} | ${by})ᵀ</strong>.`,
        given: [`a = (${ax} | ${ay})ᵀ`, `b = (${bx} | ${by})ᵀ`],
        formulaHint: "a · b = a_x · b_x + a_y · b_y",
        fields: [numberField("a · b =", dot)],
        steps: [
          `Produkt der x-Koordinaten: ${ax} · (${bx}) = ${ax * bx}`,
          `Produkt der y-Koordinaten: ${ay} · (${by}) = ${ay * by}`,
          `Summe bilden: ${ax * bx} + (${ay * by}) = <strong>${dot}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Perfekt! Du berechnest Skalarprodukte zuverlässig.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=gzwfDNF26eA",
    title: "Skalarprodukt von zwei Vektoren",
    author: "Daniel Jung",
  },
};

const orthogonalitaet: Lesson = {
  id: "vg-5-orthogonalitaet",
  stageId: "st-2-vektorgeometrie",
  stepNumber: 5,
  title: "2.5 Orthogonalitätskriterium & Normalenvektoren",
  subtitle: "Wann zwei Vektoren genau senkrecht aufeinander stehen",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 2.2",
  whyItMatters:
    "Rechte Winkel sind das Fundament der Geometrie. Mit dem Orthogonalitätskriterium prüft man in einem einzigen Rechenschritt, ob Linien rechtwinklig sind.",
  explanationHtml: `
    <p>Zwei vom Nullvektor verschiedene Vektoren <em>a</em> und <em>b</em> stehen genau dann <strong>orthogonal (senkrecht)</strong> aufeinander, wenn ihr <strong>Skalarprodukt gleich null</strong> ist:</p>
    <p class="formula-center"><strong>a ⟂ b  ⟺  a · b = a_x · b_x + a_y · b_y = 0</strong></p>
    <p><em>Grund:</em> Bei einem 90°-Winkel ist <em>cos 90° = 0</em>, folglich <em>|a| · |b| · cos 90° = 0</em>.</p>
    <p><strong>Orthogonalvektor bilden:</strong> Zu <em>v = (x | y)ᵀ</em> steht der um 90° gedrehte Normalenvektor <em>v⟂ = (-y | x)ᵀ</em> immer senkrecht, denn <em>x · (-y) + y · x = 0</em>.</p>
  `,
  formulas: [
    {
      name: "Orthogonalitätskriterium",
      html: "a ⟂ b ⟺ a · b = 0",
      quantities: "Für Vektoren ungleich Nullvektor",
    },
    {
      name: "Normalenvektor (90° Drehung)",
      html: "v = (x | y)ᵀ ⟹ v⟂ = (-y | x)ᵀ",
      quantities: "v · v⟂ = -xy + yx = 0",
    },
  ],
  quiz: {
    question: "Welche Bedingung muss für das Skalarprodukt a · b gelten, damit zwei Vektoren a ⟂ b senkrecht stehen?",
    options: ["a · b = 0", "a · b = 1", "a · b = |a| · |b|", "a · b < 0"],
    correctIndex: 0,
    explanation:
      "Zwei Vektoren stehen genau dann senkrecht (orthogonal) zueinander, wenn ihr Skalarprodukt gleich 0 ist.",
  },
  lab: {
    kind: "dot-product",
    title: "Orthogonalitäts-Labor",
    intro: "Finde Vektorpaare, deren Skalarprodukt null ist.",
    params: [
      { type: "range", key: "ax", label: "a_x", unit: "", min: -5, max: 5, step: 1, value: 3 },
      { type: "range", key: "ay", label: "a_y", unit: "", min: -5, max: 5, step: 1, value: 2 },
      { type: "range", key: "bx", label: "b_x", unit: "", min: -5, max: 5, step: 1, value: -2 },
      { type: "range", key: "by", label: "b_y", unit: "", min: -5, max: 5, step: 1, value: 3 },
    ],
    readouts: [
      {
        key: "dotVal",
        label: "a · b",
        emphasis: true,
        compute: (v) => (v.ax ?? 3) * (v.bx ?? -2) + (v.ay ?? 2) * (v.by ?? 3),
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Lasse a = (3|2)ᵀ stehen und setze b = (-2|3)ᵀ, sodass a · b = 0 wird.",
        check: (v) => (v.ax ?? 0) * (v.bx ?? 0) + (v.ay ?? 0) * (v.by ?? 0) === 0,
      },
    ],
  },
  exercises: [
    {
      id: "ex-vg-5",
      make(rng, _level) {
      const x = rng.int(2, 6);
      const y = rng.int(2, 6);
      const orthX = -y;
      const orthY = x;
      return {
        prompt: `Bestimme zu <strong>v = (${x} | ${y})ᵀ</strong> einen senkrechten Normalenvektor <strong>v⟂</strong> durch Vertauschen der Koordinaten und Vorzeichenwechsel an der ersten Stelle.`,
        given: [`v = (${x} | ${y})ᵀ`],
        formulaHint: "v = (x | y)ᵀ ⟹ v⟂ = (-y | x)ᵀ",
        fields: [numberField("v⟂_x =", orthX), numberField("v⟂_y =", orthY)],
        steps: [
          `Formel für 90°-Drehung gegen den Uhrzeigersinn: (-y | x)ᵀ`,
          `Einsetzen: v⟂ = (<strong>${orthX}</strong> | <strong>${orthY}</strong>)ᵀ`,
          `Probe: ${x} · (${orthX}) + ${y} · ${orthY} = ${x * orthX} + ${y * orthY} = 0.`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Ausgezeichnet! Du wendest das Orthogonalitätskriterium meisterhaft an.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=CxkJN7ez56E",
    title: "Orthogonaler Vektor, Normalenvektor bestimmen",
    author: "Daniel Jung",
  },
};

const determinante: Lesson = {
  id: "vg-6-determinante",
  stageId: "st-2-vektorgeometrie",
  stepNumber: 6,
  title: "2.6 Die 2x2-Determinante & Flächeninhalte",
  subtitle: "Flächen von Parallelogrammen und Dreiecken im Koordinatensystem",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 2.3",
  whyItMatters:
    "Mit der Determinante lässt sich der Flächeninhalt eines beliebigen Polygons im Koordinatensystem ohne Höhen und ohne Zerlegungen exakt berechnen.",
  explanationHtml: `
    <p>Die <strong>zweireihige Determinante</strong> zweier Spaltenvektoren <em>a</em> und <em>b</em> ist definiert als:</p>
    <p class="formula-center"><strong>det(a, b) = | a_x  b_x | / | a_y  b_y | = a_x · b_y - a_y · b_x</strong></p>
    <p><strong>Geometrische Bedeutung:</strong></p>
    <ul>
      <li><strong>Parallelogramm:</strong> A_Parallelogramm = |det(a, b)|.</li>
      <li><strong>Dreieck ABC:</strong> A_Dreieck = 0,5 · |det(AB, AC)| (bei mathematisch positivem Umlaufsinn gegen den Uhrzeigersinn ist der Wert bereits positiv).</li>
    </ul>
  `,
  formulas: [
    {
      name: "2x2-Determinante",
      html: "det(a, b) = a_x · b_y - a_y · b_x",
      quantities: "Hauptdiagonale minus Nebendiagonale",
    },
    {
      name: "Dreiecksfläche mit Determinante",
      html: "A = 0,5 · det(AB, AC)",
      quantities: "AB und AC aufspannende Vektoren im Gegenuhrzeigersinn",
    },
  ],
  quiz: {
    question: "Wie berechnet man den Wert der Determinante det(a, b) für a = (4 | 1)ᵀ und b = (1 | 5)ᵀ?",
    options: [
      "4 · 5 - 1 · 1 = 20 - 1 = 19",
      "4 · 1 + 1 · 5 = 4 + 5 = 9",
      "4 · 5 + 1 · 1 = 20 + 1 = 21",
      "4 - 5 = -1",
    ],
    correctIndex: 0,
    explanation:
      "Nach der Formel a_x · b_y - a_y · b_x: 4 · 5 - 1 · 1 = 20 - 1 = 19.",
  },
  lab: {
    kind: "determinant-area",
    title: "Determinanten-Labor",
    intro: "Verändere die aufspannenden Vektoren und beobachte den Determinantenwert und den Flächeninhalt.",
    params: [
      { type: "range", key: "ax", label: "a_x", unit: "", min: 1, max: 6, step: 1, value: 4 },
      { type: "range", key: "ay", label: "a_y", unit: "", min: 0, max: 5, step: 1, value: 1 },
      { type: "range", key: "bx", label: "b_x", unit: "", min: 0, max: 5, step: 1, value: 1 },
      { type: "range", key: "by", label: "b_y", unit: "", min: 1, max: 6, step: 1, value: 4 },
    ],
    readouts: [
      {
        key: "detVal",
        label: "det(a, b)",
        emphasis: true,
        compute: (v) => (v.ax ?? 4) * (v.by ?? 4) - (v.ay ?? 1) * (v.bx ?? 1),
      },
      {
        key: "areaVal",
        label: "Dreiecksfläche",
        digits: 1,
        compute: (v) => {
          const det = (v.ax ?? 4) * (v.by ?? 4) - (v.ay ?? 1) * (v.bx ?? 1);
          return Math.round(0.5 * Math.abs(det) * 10) / 10;
        },
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle die Vektoren so ein, dass die Dreiecksfläche genau 9,5 FE beträgt.",
        check: (v) => Math.abs((v.ax ?? 0) * (v.by ?? 0) - (v.ay ?? 0) * (v.bx ?? 0)) === 19,
      },
    ],
  },
  exercises: [
    {
      id: "ex-vg-6",
      make(rng, _level) {
      const ax = rng.int(2, 5);
      const ay = rng.int(1, 3);
      const bx = rng.int(1, 3);
      const by = rng.int(4, 7);
      const det = ax * by - ay * bx;
      const area = Math.round(0.5 * Math.abs(det) * 10) / 10;
      return {
        prompt: `Die Vektoren <strong>a = (${ax} | ${ay})ᵀ</strong> und <strong>b = (${bx} | ${by})ᵀ</strong> spannen ein Dreieck auf. Berechne die 2x2-Determinante <strong>det(a, b)</strong> und den Flächeninhalt <strong>A</strong>.`,
        given: [`a = (${ax} | ${ay})ᵀ`, `b = (${bx} | ${by})ᵀ`],
        formulaHint: "det(a, b) = a_x · b_y - a_y · b_x; A = 0,5 · |det|",
        fields: [numberField("det =", det), numberField("A =", area, "FE", 1)],
        steps: [
          `Determinante: ${ax} · ${by} - ${ay} · ${bx} = ${ax * by} - ${ay * bx} = <strong>${det}</strong>`,
          `Dreiecksfläche: A = 0,5 · |${det}| = <strong>${area} FE</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Klasse! Du berechnest Flächen mit Determinanten mühelos.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=N6vEOowa7Uk",
    title: "Was gibt die Determinante einer Matrix an",
    author: "Daniel Jung",
  },
};

const drehung: Lesson = {
  id: "vg-7-drehung",
  stageId: "st-2-vektorgeometrie",
  stepNumber: 7,
  title: "2.7 Vektordrehung & Abbildungsmatrix",
  subtitle: "Drehung um den Ursprung mit der orthogonalen Drehmatrix D_φ",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 2.3",
  whyItMatters:
    "Grafik-Engines (Videospiele, 3D-Animation, Robotik) berechnen jede Bewegung und Drehung von Objekten über 2D- und 3D-Abbildungsmatrizen.",
  explanationHtml: `
    <p>Wird ein Vektor <em>v = (x | y)ᵀ</em> um den Ursprung <em>Z(0|0)</em> um den Winkel <em>φ</em> gegen den Uhrzeigersinn gedreht, so lautet die <strong>Drehmatrix D_φ</strong>:</p>
    <p class="formula-center"><strong>D_φ = [ cos φ  -sin φ ; sin φ  cos φ ]</strong></p>
    <p>Der Bildvektor <em>v' = (x' | y')ᵀ</em> berechnet sich durch Matrix-Vektor-Multiplikation:</p>
    <p class="formula-center"><strong>x' = x · cos φ - y · sin φ</strong><br /><strong>y' = x · sin φ + y · cos φ</strong></p>
    <p><em>Spezialfall φ = 90°:</em> cos 90° = 0, sin 90° = 1 ⟹ <em>v' = (-y | x)ᵀ</em>.</p>
  `,
  formulas: [
    {
      name: "Drehmatrix D_φ",
      html: "D_φ = [ cos φ  -sin φ ; sin φ  cos φ ]",
      quantities: "Drehzentrum Z(0|0), Drehwinkel φ gegen Uhrzeigersinn",
    },
    {
      name: "Bildkoordinaten",
      html: "x' = x · cos φ - y · sin φ, y' = x · sin φ + y · cos φ",
      quantities: "(x' | y') Bildvektor",
    },
  ],
  quiz: {
    question: "Welchen Bildvektor v' erhält man, wenn man v = (4 | 0)ᵀ um φ = 90° dreht?",
    options: ["(0 | 4)ᵀ", "(4 | 4)ᵀ", "(-4 | 0)ᵀ", "(0 | -4)ᵀ"],
    correctIndex: 0,
    explanation:
      "Bei 90° Drehung gilt x' = -y und y' = x. Da y = 0 und x = 4 ist, folgt v' = (0 | 4)ᵀ.",
  },
  lab: {
    kind: "vector-rotation",
    title: "Drehungs-Labor",
    intro: "Verändere den Drehwinkel φ und beobachte den Bildvektor v'.",
    params: [
      { type: "range", key: "phi", label: "Drehwinkel φ", unit: "°", min: 0, max: 360, step: 15, value: 90 },
      { type: "range", key: "vx", label: "v_x", unit: "", min: -5, max: 5, step: 1, value: 4 },
      { type: "range", key: "vy", label: "v_y", unit: "", min: -5, max: 5, step: 1, value: 0 },
    ],
    readouts: [
      {
        key: "rotX",
        label: "v'_x",
        digits: 2,
        compute: (v) => {
          const rad = ((v.phi ?? 90) * Math.PI) / 180;
          return Math.round(((v.vx ?? 4) * Math.cos(rad) - (v.vy ?? 0) * Math.sin(rad)) * 100) / 100;
        },
      },
      {
        key: "rotY",
        label: "v'_y",
        digits: 2,
        compute: (v) => {
          const rad = ((v.phi ?? 90) * Math.PI) / 180;
          return Math.round(((v.vx ?? 4) * Math.sin(rad) + (v.vy ?? 0) * Math.cos(rad)) * 100) / 100;
        },
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle φ = 180° ein (Punktspiegelung am Ursprung).",
        check: (v) => Math.abs((v.phi ?? 0) - 180) <= 2,
      },
    ],
  },
  exercises: [
    {
      id: "ex-vg-7",
      make(rng, _level) {
      const vx = rng.int(2, 6);
      const rx = 0;
      const ry = vx;
      return {
        prompt: `Der Vektor <strong>v = (${vx} | 0)ᵀ</strong> wird um das Zentrum Z(0|0) um den Winkel <strong>φ = 90°</strong> gegen den Uhrzeigersinn gedreht. Berechne den Bildvektor <strong>v'</strong>.`,
        given: [`v = (${vx} | 0)ᵀ`, `φ = 90°`],
        formulaHint: "x' = x·cos φ - y·sin φ; y' = x·sin φ + y·cos φ",
        fields: [numberField("v'_x =", rx), numberField("v'_y =", ry)],
        steps: [
          `Mit cos(90°) = 0 und sin(90°) = 1:`,
          `x' = ${vx} · 0 - 0 · 1 = <strong>0</strong>`,
          `y' = ${vx} · 1 + 0 · 0 = <strong>${vx}</strong>`,
          `Bildvektor: v' = (0 | ${vx})ᵀ`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Glückwunsch! Du beherrschst Vektordrehungen und die Drehmatrix.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=X8QDtWIWu6Q",
    title: "Drehmatrix, Drehung um den Ursprung",
    author: "Daniel Jung",
  },
};

export const STAGE_VEKTORGEOMETRIE: Stage = {
  id: "st-2-vektorgeometrie",
  stageNumber: 2,
  title: "Ebene Vektorgeometrie & Abbildungen",
  subtitle: "Vektorbegriff, Skalarprodukt, Determinante und Drehungen",
  icon: "🧭",
  accent: "#10b981",
  badgeTitle: "Vektor-Navigator",
  lehrplanLabel: "M10 (I) LB 2",
  lessons: [
    vektorbegriff,
    vektorbetrag,
    vektorrechnung,
    skalarprodukt,
    orthogonalitaet,
    determinante,
    drehung,
  ],
};
