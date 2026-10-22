import type { Lesson, Stage } from "../model/types";
import { numberField, sinD, cosD, DEG } from "./helpers";

const einheitskreis: Lesson = {
  id: "tr-1-einheitskreis",
  stageId: "st-1-trigonometrie",
  stepNumber: 1,
  title: "1.1 Sinus und Kosinus am Einheitskreis",
  subtitle: "Winkelfunktionen für alle Winkel von 0° bis 360° und Vorzeichen",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I) LB 1.1 / M10 (II/III) LB 1.1",
  whyItMatters:
    "Im rechtwinkligen Dreieck sind Winkel auf unter 90° begrenzt. Am Einheitskreis lassen sich Sinus und Kosinus für beliebige Drehwinkel definieren, was für Wellen und Schwingungen in der Physik unverzichtbar ist.",
  explanationHtml: `
    <p>Der <strong>Einheitskreis</strong> hat den Radius <em>r = 1</em> und seinen Mittelpunkt im Koordinatenursprung <em>(0|0)</em>.</p>
    <p>Dreht man einen Zeiger um den Winkel <em>α</em> gegen den Uhrzeigersinn, so hat der Endpunkt <em>P</em> auf der Kreislinie die Koordinaten:</p>
    <p class="formula-center"><strong>P(cos α | sin α)</strong></p>
    <ul>
      <li><strong>Kosinus:</strong> x-Koordinate des Punktes P. Positiv im I. und IV. Quadranten.</li>
      <li><strong>Sinus:</strong> y-Koordinate des Punktes P. Positiv im I. und II. Quadranten.</li>
      <li><strong>Wichtige Werte:</strong> sin 0° = 0, sin 90° = 1, sin 180° = 0, sin 270° = -1; cos 0° = 1, cos 90° = 0, cos 180° = -1.</li>
    </ul>
  `,
  formulas: [
    {
      name: "Koordinaten am Einheitskreis",
      html: "P(x | y) = (cos α | sin α)",
      quantities: "x = cos α (Abszisse), y = sin α (Ordinate)",
    },
    {
      name: "Trigonometrischer Pythagoras",
      html: "sin² α + cos² α = 1",
      quantities: "Gilt für jeden beliebigen Winkel α",
    },
  ],
  quiz: {
    question: "Welches Vorzeichen haben Sinus und Kosinus für einen Winkel von α = 120° (II. Quadrant)?",
    options: [
      "sin(120°) > 0 und cos(120°) < 0",
      "sin(120°) < 0 und cos(120°) > 0",
      "Beide sind positiv",
      "Beide sind negativ",
    ],
    correctIndex: 0,
    explanation:
      "Im II. Quadranten (90° < α < 180°) ist die y-Koordinate positiv (sin 120° = √3/2 ≈ 0,87 > 0) und die x-Koordinate negativ (cos 120° = -0,5 < 0).",
  },
  lab: {
    kind: "unit-circle",
    title: "Einheitskreis-Labor",
    intro: "Bewege den Winkel-Schieberegler oder ziehe den Zeiger, um Sinus und Kosinus in allen 4 Quadranten zu beobachten.",
    params: [
      {
        type: "range",
        key: "alpha",
        label: "Winkel α",
        unit: "°",
        min: 0,
        max: 360,
        step: 5,
        value: 60,
      },
    ],
    readouts: [
      {
        key: "sinVal",
        label: "sin α (y)",
        digits: 3,
        emphasis: true,
        compute: (v) => Math.round(sinD(v.alpha ?? 60) * 1000) / 1000,
      },
      {
        key: "cosVal",
        label: "cos α (x)",
        digits: 3,
        compute: (v) => Math.round(cosD(v.alpha ?? 60) * 1000) / 1000,
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle einen Winkel im II. Quadranten ein (zwischen 90° und 180°).",
        check: (v) => (v.alpha ?? 0) > 90 && (v.alpha ?? 0) < 180,
      },
      {
        id: "g2",
        text: "Finde einen Winkel, bei dem der Sinus genau -1 ist (Tiefpunkt bei 270°).",
        check: (v) => Math.abs((v.alpha ?? 0) - 270) <= 2,
      },
    ],
  },
  exercises: [
    {
      id: "ex-tr-1",
      make(rng, _level) {
        const alpha = rng.pick([30, 45, 60, 120, 135, 150, 210, 240, 300, 315, 330]);
        const s = Math.round(sinD(alpha) * 100) / 100;
        return {
          prompt: `Bestimme den Sinuswert für den Winkel <strong>α = ${alpha}°</strong> am Einheitskreis (auf 2 Nachkommastellen gerundet).`,
          given: [`Winkel α = ${alpha}°`],
          formulaHint: "Am Einheitskreis ist sin α die vertikale Projektion (y-Koordinate).",
          fields: [numberField("sin α =", s, "", 2)],
          steps: [
            `Winkel α = ${alpha}° liegt im ${alpha <= 90 ? "I." : alpha <= 180 ? "II." : alpha <= 270 ? "III." : "IV."} Quadranten.`,
            `Der Sinuswert entspricht der y-Koordinate: sin(${alpha}°) = <strong>${s}</strong>.`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Perfekt! Du verstehst Sinus und Kosinus am Einheitskreis für beliebige Winkel.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=T8kNcfv8LvY",
    title: "Sinus-/Kosinusfunktion verdeutlicht mit Einheitskreis",
    author: "Daniel Jung",
  },
};

const sinussatz: Lesson = {
  id: "tr-2-sinussatz",
  stageId: "st-1-trigonometrie",
  stepNumber: 2,
  title: "1.2 Der Sinussatz im beliebigen Dreieck",
  subtitle: "Seiten und Gegenwinkel ohne rechten Winkel berechnen",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I) LB 1.2 / M10 (II/III) LB 1.2",
  whyItMatters:
    "In der Praxis (Vermessung, Geodäsie, Navigation) sind Dreiecke selten rechtwinklig. Mit dem Sinussatz lassen sich unzugängliche Distanzen über Winkelpeilungen ermitteln.",
  explanationHtml: `
    <p>In <em>jedem</em> beliebigen Dreieck verhalten sich die Längen zweier Seiten wie die Sinuswerte ihrer gegenüberliegenden Winkel:</p>
    <p class="formula-center"><strong>a / sin α = b / sin β = c / sin γ</strong></p>
    <p>Der Sinussatz kommt zum Einsatz, wenn ein <strong>vollständiges Paar</strong> (eine Seite und ihr Gegenwinkel) sowie eine weitere Größe bekannt sind (Kongruenzsätze WSW, Ssw).</p>
  `,
  formulas: [
    {
      name: "Sinussatz",
      html: "a / sin α = b / sin β = c / sin γ",
      quantities: "a, b, c Seiten; α, β, γ jeweilige Gegenwinkel",
    },
  ],
  quiz: {
    question: "Wann kann der Sinussatz direkt angewendet werden?",
    options: [
      "Wenn eine Seite und ihr gegenüberliegender Winkel sowie eine weitere Größe bekannt sind",
      "Nur wenn ein rechter Winkel von 90° vorhanden ist",
      "Wenn alle drei Seiten gegeben sind, aber kein einziger Winkel",
      "Ausschließlich bei gleichseitigen Dreiecken",
    ],
    correctIndex: 0,
    explanation:
      "Für den Sinussatz benötigt man ein bekanntes Paar aus Seite und Gegenwinkel (z. B. a und α), um über den Quotienten weitere Seiten oder Winkel zu berechnen.",
  },
  lab: {
    kind: "sine-cosine-law",
    title: "Sinussatz-Labor",
    intro: "Verändere die Seiten und Winkel im allgemeinen Dreieck und beobachte das Verhältnis a / sin α.",
    params: [
      { type: "range", key: "a", label: "Seite a", unit: "cm", min: 4, max: 12, step: 0.5, value: 7 },
      { type: "range", key: "b", label: "Seite b", unit: "cm", min: 4, max: 12, step: 0.5, value: 8 },
      { type: "range", key: "gamma", label: "Winkel γ", unit: "°", min: 30, max: 120, step: 5, value: 60 },
    ],
    readouts: [
      {
        key: "cVal",
        label: "Seite c",
        digits: 2,
        emphasis: true,
        compute: (v) => {
          const a = v.a ?? 7;
          const b = v.b ?? 8;
          const g = (v.gamma ?? 60) * DEG;
          return Math.round(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(g)) * 100) / 100;
        },
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle ein Dreieck mit gamma = 90° ein (der Pythagoras ist ein Spezialfall).",
        check: (v) => Math.abs((v.gamma ?? 0) - 90) <= 2,
      },
    ],
  },
  exercises: [
    {
      id: "ex-tr-2",
      make(rng, _level) {
        const a = rng.int(6, 12);
        const alpha = rng.int(35, 65);
        const beta = rng.int(40, 75);
        const b = Math.round(((a * sinD(beta)) / sinD(alpha)) * 10) / 10;
        return {
          prompt: `Im Dreieck ABC sind gegeben: <strong>a = ${a} cm</strong>, <strong>α = ${alpha}°</strong> und <strong>β = ${beta}°</strong>. Berechne die Seitenlänge <strong>b</strong> auf eine Nachkommastelle.`,
          given: [`a = ${a} cm`, `α = ${alpha}°`, `β = ${beta}°`],
          formulaHint: "b = a · sin(β) / sin(α)",
          fields: [numberField("b =", b, "cm", 1)],
          steps: [
            `Ansatz nach Sinussatz: b / sin(β) = a / sin(α)`,
            `Umstellen nach b: b = ${a} · sin(${beta}°) / sin(${alpha}°)`,
            `Einsetzen: b ≈ <strong>${b} cm</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Hervorragend! Du kannst den Sinussatz sicher anwenden.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=jl3w0wGoWlY",
    title: "Sinussatz, Dreieck berechnen",
    author: "Daniel Jung",
  },
};

const kosinussatz: Lesson = {
  id: "tr-3-kosinussatz",
  stageId: "st-1-trigonometrie",
  stepNumber: 3,
  title: "1.3 Der Kosinussatz im beliebigen Dreieck",
  subtitle: "Drei Seiten (SSS) oder zwei Seiten mit eingeschlossenem Winkel (SWS)",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I) LB 1.2 / M10 (II/III) LB 1.2",
  whyItMatters:
    "Wenn kein vollständiges Paar aus Seite und Gegenwinkel vorliegt (z. B. wenn alle drei Seiten gemessen wurden), versagt der Sinussatz. Der Kosinussatz löst genau diese Fälle.",
  explanationHtml: `
    <p>Der <strong>Kosinussatz</strong> verallgemeinert den Satz des Pythagoras für alle Dreiecke:</p>
    <p class="formula-center"><strong>c² = a² + b² - 2ab · cos γ</strong></p>
    <p>Ist <em>γ = 90°</em>, so ist <em>cos 90° = 0</em> und die Formel reduziert sich exakt auf <em>c² = a² + b²</em>.</p>
    <p>Zur Winkelberechnung bei drei gegebenen Seiten (SSS) stellt man um:</p>
    <p class="formula-center"><strong>cos γ = (a² + b² - c²) / (2ab)</strong></p>
  `,
  formulas: [
    {
      name: "Kosinussatz",
      html: "c² = a² + b² - 2ab · cos γ",
      quantities: "c dritte Seite, a und b anliegende Seiten, γ eingeschlossener Winkel",
    },
  ],
  quiz: {
    question: "Was geschieht mit dem Kosinussatz c² = a² + b² - 2ab · cos γ, wenn γ = 90° beträgt?",
    options: [
      "Da cos 90° = 0 ist, entsteht der Satz des Pythagoras c² = a² + b²",
      "Er ergibt c² = a² - b²",
      "Er lässt sich für 90° nicht berechnen",
      "Der Wert verdoppelt sich zu 2c²",
    ],
    correctIndex: 0,
    explanation:
      "Für γ = 90° ist cos(90°) = 0, wodurch der Term -2ab·cos(90°) wegfällt. Der Satz des Pythagoras ist also ein Spezialfall des Kosinussatzes.",
  },
  lab: {
    kind: "sine-cosine-law",
    title: "Kosinussatz-Labor",
    intro: "Untersuche, wie sich Seite c verändert, wenn der eingeschlossene Winkel gamma spitz, recht oder stumpf wird.",
    params: [
      { type: "range", key: "a", label: "Seite a", unit: "cm", min: 4, max: 10, step: 1, value: 5 },
      { type: "range", key: "b", label: "Seite b", unit: "cm", min: 4, max: 10, step: 1, value: 6 },
      { type: "range", key: "gamma", label: "Winkel γ", unit: "°", min: 20, max: 150, step: 5, value: 90 },
    ],
    readouts: [
      {
        key: "cVal",
        label: "Seite c",
        digits: 2,
        emphasis: true,
        compute: (v) => {
          const a = v.a ?? 5;
          const b = v.b ?? 6;
          const g = (v.gamma ?? 90) * DEG;
          return Math.round(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(g)) * 100) / 100;
        },
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle einen stumpfen Winkel γ > 90° ein und beobachte, dass c größer als √(a²+b²) wird.",
        check: (v) => (v.gamma ?? 0) > 100,
      },
    ],
  },
  exercises: [
    {
      id: "ex-tr-3",
      make(rng, _level) {
        const a = rng.int(5, 9);
        const b = rng.int(6, 10);
        const gamma = rng.pick([45, 60, 120]);
        const gRad = gamma * DEG;
        const c2 = a * a + b * b - 2 * a * b * Math.cos(gRad);
        const c = Math.round(Math.sqrt(c2) * 10) / 10;
        return {
          prompt: `Berechne im Dreieck ABC die Seite <strong>c</strong> aus <strong>a = ${a} cm</strong>, <strong>b = ${b} cm</strong> und dem eingeschlossenen Winkel <strong>γ = ${gamma}°</strong>.`,
          given: [`a = ${a} cm`, `b = ${b} cm`, `γ = ${gamma}°`],
          formulaHint: "c = √(a² + b² - 2ab · cos γ)",
          fields: [numberField("c =", c, "cm", 1)],
          steps: [
            `Kosinussatz ansetzen: c² = ${a}² + ${b}² - 2 · ${a} · ${b} · cos(${gamma}°)`,
            `Ausrechnen: c² = ${a * a} + ${b * b} - ${2 * a * b} · cos(${gamma}°) ≈ ${Math.round(c2 * 10) / 10}`,
            `Wurzel ziehen: c ≈ <strong>${c} cm</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Super! Du beherrschst den Kosinussatz im Dreieck.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=PaF_ClPIc_A",
    title: "Kosinussatz erkennen, aufstellen",
    author: "Daniel Jung",
  },
};

const dreiecksflaeche: Lesson = {
  id: "tr-4-dreiecksflaeche",
  stageId: "st-1-trigonometrie",
  stepNumber: 4,
  title: "1.4 Trigonometrischer Flächeninhalt",
  subtitle: "Dreiecksfläche ohne explizite Höhe berechnen",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I) LB 1.2 / M10 (II/III) LB 1.2",
  whyItMatters:
    "Oft ist die Höhe eines Dreiecks im Gelände schwer messbar. Die trigonometrische Formel benötigt nur zwei gemessene Seiten und ihren Zwischenwinkel.",
  explanationHtml: `
    <p>Der Flächeninhalt eines Dreiecks lässt sich direkt aus zwei Seiten und dem eingeschlossenen Winkel berechnen:</p>
    <p class="formula-center"><strong>A = 0,5 · a · b · sin γ = 0,5 · b · c · sin α = 0,5 · a · c · sin β</strong></p>
    <p>Da die Höhe <em>h_a = b · sin γ</em> ist, folgt die Formel unmittelbar aus der Grundflächenformel <em>A = 0,5 · Grundlinie · Höhe</em>.</p>
  `,
  formulas: [
    {
      name: "Flächeninhalt mit Sinus",
      html: "A = 0,5 · a · b · sin γ",
      quantities: "a, b zwei Seiten; γ der von ihnen eingeschlossene Winkel",
    },
  ],
  quiz: {
    question: "Welche Größen werden für die trigonometrische Flächenformel benötigt?",
    options: [
      "Zwei Seiten und der von ihnen eingeschlossene Winkel",
      "Alle drei Winkel und keine einzige Seite",
      "Nur die drei Seitenlängen ohne Winkel",
      "Eine Seite und zwei beliebige Winkel",
    ],
    correctIndex: 0,
    explanation:
      "Die Formel A = 0,5 · a · b · sin γ benötigt genau zwei Seiten und den eingeschlossenen Winkel zwischen diesen beiden Seiten.",
  },
  lab: {
    kind: "triangle-area",
    title: "Dreiecksflächen-Labor",
    intro: "Verändere a, b und γ und beobachte, wie sich der Flächeninhalt des Dreiecks verhält.",
    params: [
      { type: "range", key: "a", label: "Seite a", unit: "cm", min: 3, max: 10, step: 0.5, value: 6 },
      { type: "range", key: "b", label: "Seite b", unit: "cm", min: 3, max: 10, step: 0.5, value: 8 },
      { type: "range", key: "gamma", label: "Winkel γ", unit: "°", min: 15, max: 150, step: 5, value: 50 },
    ],
    readouts: [
      {
        key: "areaVal",
        label: "Fläche A",
        unit: "cm²",
        digits: 2,
        emphasis: true,
        compute: (v) => {
          const a = v.a ?? 6;
          const b = v.b ?? 8;
          const g = (v.gamma ?? 50) * DEG;
          return Math.round(0.5 * a * b * Math.sin(g) * 100) / 100;
        },
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Finde heraus, bei welchem Winkel γ die Fläche bei festen Seiten maximal wird (bei 90° ist sin γ = 1).",
        check: (v) => Math.abs((v.gamma ?? 0) - 90) <= 3,
      },
    ],
  },
  exercises: [
    {
      id: "ex-tr-4",
      make(rng, _level) {
        const a = rng.int(5, 12);
        const b = rng.int(6, 14);
        const gamma = rng.pick([30, 45, 60, 75]);
        const area = Math.round(0.5 * a * b * sinD(gamma) * 10) / 10;
        return {
          prompt: `Ein dreieckiges Grundstück hat die Seiten <strong>a = ${a} m</strong> und <strong>b = ${b} m</strong>, die einen Winkel von <strong>γ = ${gamma}°</strong> einschließen. Berechne den Flächeninhalt <strong>A</strong> auf eine Dezimalstelle.`,
          given: [`a = ${a} m`, `b = ${b} m`, `γ = ${gamma}°`],
          formulaHint: "A = 0,5 · a · b · sin γ",
          fields: [numberField("A =", area, "m²", 1)],
          steps: [
            `Formel ansetzen: A = 0,5 · ${a} · ${b} · sin(${gamma}°)`,
            `Berechnung: A = ${0.5 * a * b} · sin(${gamma}°) ≈ <strong>${area} m²</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Klasse! Du berechnest Dreiecksflächen souverän mit der Sinusformel.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=uGcc2Ij57R8",
    title: "Dreiecksfläche mit Sinus berechnen",
    author: "Daniel Jung",
  },
};

const bogenmass: Lesson = {
  id: "tr-5-bogenmass",
  stageId: "st-1-trigonometrie",
  stepNumber: 5,
  title: "1.5 Bogenmaß und Kreisbogen",
  subtitle: "Winkel als reelle Zahlen im Bogenmaß (Radiant)",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 1.3",
  whyItMatters:
    "In der höheren Mathematik und Analysis rechnen Taschenrechner und Computeralgebrasysteme Winkel grundsätzlich im Bogenmaß, weil Ableitungen wie (sin x)' = cos x nur im Bogenmaß gelten.",
  explanationHtml: `
    <p>Das <strong>Bogenmaß</strong> eines Winkels ist die Länge des zugehörigen Kreisbogens am Einheitskreis (Radius <em>r = 1</em>):</p>
    <ul>
      <li>Vollkreis: 360° entspricht dem Umfang <em>2π ≈ 6,28 rad</em>.</li>
      <li>Halbkreis: 180° entspricht genau <em>π rad ≈ 3,14</em>.</li>
      <li>Rechter Winkel: 90° entspricht <em>π / 2 rad ≈ 1,57</em>.</li>
    </ul>
    <p>Umrechnungsformeln:</p>
    <p class="formula-center"><strong>Bogenmaß x = α · π / 180°  |  Gradmaß α = x · 180° / π</strong></p>
  `,
  formulas: [
    {
      name: "Bogenmaß",
      html: "x = α · π / 180°",
      quantities: "x Bogenmaß in rad, α Gradmaß in °",
    },
    {
      name: "Kreisbogenlänge",
      html: "b = r · x = r · α · π / 180°",
      quantities: "b Bogenlänge, r Radius",
    },
  ],
  quiz: {
    question: "Welchem Bogenmaß entspricht ein Winkel von α = 180°?",
    options: ["π rad (ca. 3,14)", "2π rad (ca. 6,28)", "π/2 rad (ca. 1,57)", "1 rad"],
    correctIndex: 0,
    explanation:
      "Ein Vollkreis (360°) hat den Umfang 2π. Der Halbkreis mit 180° entspricht somit genau der Bogenlänge π rad ≈ 3,1416.",
  },
  lab: {
    kind: "radian-arc",
    title: "Bogenmaß-Labor",
    intro: "Vergleiche Gradmaß und Bogenmaß am Kreisbogen.",
    params: [
      { type: "range", key: "deg", label: "Winkel α", unit: "°", min: 0, max: 360, step: 15, value: 90 },
    ],
    readouts: [
      {
        key: "radVal",
        label: "Bogenmaß x",
        unit: "rad",
        digits: 3,
        emphasis: true,
        compute: (v) => Math.round(((v.deg ?? 90) * Math.PI) / 180 * 1000) / 1000,
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle α = 180° ein, um den Wert π (ca. 3,142 rad) abzulesen.",
        check: (v) => Math.abs((v.deg ?? 0) - 180) <= 2,
      },
    ],
  },
  exercises: [
    {
      id: "ex-tr-5",
      make(rng, _level) {
        const deg = rng.pick([30, 45, 60, 90, 120, 135, 150, 180, 270]);
        const rad = Math.round(((deg * Math.PI) / 180) * 100) / 100;
        return {
          prompt: `Rechne den Winkel <strong>α = ${deg}°</strong> in das Bogenmaß <strong>x</strong> um (auf 2 Nachkommastellen gerundet).`,
          given: [`α = ${deg}°`],
          formulaHint: "x = α · π / 180°",
          fields: [numberField("x =", rad, "rad", 2)],
          steps: [
            `Umrechnungsformel anwenden: x = ${deg}° · π / 180°`,
            `Kürzen und ausrechnen: x ≈ <strong>${rad} rad</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Großartig! Du rechnest sicher zwischen Gradmaß und Bogenmaß um.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=XTgsWytG7cI",
    title: "Bogenmaß und Gradmaß umrechnen",
    author: "Daniel Jung",
  },
};

export const STAGE_TRIGONOMETRIE: Stage = {
  id: "st-1-trigonometrie",
  stageNumber: 1,
  title: "Trigonometrie am Einheitskreis & beliebigen Dreiecken",
  subtitle: "Sinussatz, Kosinussatz, Dreiecksfläche und Bogenmaß",
  icon: "📐",
  accent: "#3b82f6",
  badgeTitle: "Trigonometrie-Pionier",
  lehrplanLabel: "M10 (I) LB 1 / M10 (II/III) LB 1",
  lessons: [einheitskreis, sinussatz, kosinussatz, dreiecksflaeche, bogenmass],
};

