import type { Lesson, Stage } from "../model/types";
import { numberField } from "./helpers";

const rotationskoerper: Lesson = {
  id: "ap-1-rotationskoerper",
  stageId: "st-5-abschlusspruefung",
  stepNumber: 1,
  title: "5.1 Zusammengesetzte Körper & Rotationskörper",
  subtitle: "Kombinationen aus Zylinder, Kegel, Pyramide und Halbkugel",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I/II/III) LB 2 / Abschlussprüfung",
  whyItMatters:
    "Reale technische Bauteile (z. B. Silos, Raketenspitzen, Bohrer) bestehen aus zusammengesetzten Grundkörpern. In der Realschul-Abschlussprüfung ist die Raumgeometrie eine klassische Hauptaufgabe.",
  explanationHtml: `
    <p>In der Abschlussprüfung treten häufig <strong>zusammengesetzte Körper</strong> auf, z. B. ein Zylinder mit aufgesetztem Kegel oder einer ausgehöhlten Halbkugel:</p>
    <ul>
      <li><strong>Gesamtvolumen:</strong> Summe der Teilvolumina (oder Differenz bei Bohrungen/Aushöhlungen): <em>V_ges = V_Zylinder + V_Kegel</em>.</li>
      <li><strong>Oberfläche:</strong> Nur die <em>äußeren, sichtbaren Flächen</em> zählen! Berührungsflächen im Inneren (z. B. der Kreis zwischen Zylinder und Kegel) fallen weg.</li>
      <li><strong>Formelübersicht:</strong>
        <ul>
          <li>Zylinder: <em>V = π r² h</em>, <em>M = 2π r h</em></li>
          <li>Kegel: <em>V = 1/3 π r² h</em>, <em>M = π r s</em> mit <em>s = √(r² + h²)</em></li>
          <li>Kugel: <em>V = 4/3 π r³</em>, <em>O = 4π r²</em></li>
        </ul>
      </li>
    </ul>
  `,
  formulas: [
    {
      name: "Volumen Zylinder + Kegel",
      html: "V = π r² h_Zyl + 1/3 π r² h_Kegel",
      quantities: "r gemeinsamer Radius",
    },
    {
      name: "Mantellinie Kegel",
      html: "s = √(r² + h²)",
      quantities: "Pythagoras aus Radius und Höhe",
    },
  ],
  quiz: {
    question: "Welche Flächen zählen zur Gesamtoberfläche eines Körpers aus Zylinder mit aufgesetztem Kegel?",
    options: [
      "Zylinder-Kreisboden + Zylinder-Mantel + Kegel-Mantel (die Berührungsfläche im Inneren zählt nicht)",
      "Vollständige Oberfläche des Zylinders plus vollständige Oberfläche des Kegels",
      "Nur die beiden Mantelflächen ohne Boden",
      "Nur das Gesamtvolumen",
    ],
    correctIndex: 0,
    explanation:
      "Die Berührungsfläche liegt im Inneren des zusammengesetzten Körpers und gehört nicht zur äußeren Oberfläche.",
  },
  lab: {
    kind: "composite-body",
    title: "Körper-Labor",
    intro: "Verändere Radius und Höhe des zusammengesetzten Körpers.",
    params: [
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 2, max: 6, step: 0.5, value: 4 },
      { type: "range", key: "h", label: "Zylinderhöhe h", unit: "cm", min: 4, max: 12, step: 1, value: 8 },
    ],
    readouts: [
      {
        key: "volVal",
        label: "Zylindervolumen",
        unit: "cm³",
        digits: 1,
        emphasis: true,
        compute: (v) => {
          const r = v.r ?? 4;
          const h = v.h ?? 8;
          return Math.round(Math.PI * r * r * h * 10) / 10;
        },
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle r = 4 und h = 8 ein.",
        check: (v) => (v.r ?? 0) === 4 && (v.h ?? 0) === 8,
      },
    ],
  },
  exercises: [
    {
      id: "ex-ap-1",
      make(rng, _level) {
      const r = rng.int(3, 6);
      const hZyl = rng.int(6, 10);
      const hKeg = rng.int(3, 6);
      const vZyl = Math.PI * r * r * hZyl;
      const vKeg = (1 / 3) * Math.PI * r * r * hKeg;
      const vGes = Math.round((vZyl + vKeg) * 10) / 10;
      return {
        prompt: `Ein Körper besteht aus einem Zylinder (Radius <strong>r = ${r} cm</strong>, Höhe <strong>h_Z = ${hZyl} cm</strong>) mit aufgesetztem Kegel (gleicher Radius r, Höhe <strong>h_K = ${hKeg} cm</strong>). Berechne das Gesamtvolumen <strong>V</strong> auf eine Nachkommastelle.`,
        given: [`r = ${r} cm`, `h_Z = ${hZyl} cm`, `h_K = ${hKeg} cm`],
        formulaHint: "V = π·r²·h_Z + (1/3)·π·r²·h_K",
        fields: [numberField("V =", vGes, "cm³", 1)],
        steps: [
          `Zylindervolumen: V_Z = π · ${r}² · ${hZyl} ≈ ${Math.round(vZyl * 10) / 10} cm³`,
          `Kegelvolumen: V_K = 1/3 · π · ${r}² · ${hKeg} ≈ ${Math.round(vKeg * 10) / 10} cm³`,
          `Gesamtvolumen: V = V_Z + V_K ≈ <strong>${vGes} cm³</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Super! Du meisterst zusammengesetzte Körper der Abschlussprüfung.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=ZcHfje2Ojo8",
    title: "Zylinder, Kegel, Kugel Körperberechnungen",
    author: "Daniel Jung",
  },
};

const parabelnAbschluss: Lesson = {
  id: "ap-2-parabeln-abschluss",
  stageId: "st-5-abschlusspruefung",
  stepNumber: 2,
  title: "5.2 Parabeln & quadratische Gleichungen in Prüfungen",
  subtitle: "Schnittpunkte Parabel-Gerade und Parabel-Parabel mit der Mitternachtsformel",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (II/III) LB 4 / M10 (I) Vertiefung",
  whyItMatters:
    "Parabelaufgaben bilden in Zweig II/III den umfangreichsten Block der Abschlussprüfung. In Zweig I vertieft das Thema Kurvenschnittpunkte und Modellierungen.",
  explanationHtml: `
    <p>Typische Prüfungsaufgabe: Eine Parabel <em>p: y = a x² + b x + c</em> schneidet eine Gerade <em>g: y = m x + t</em>.</p>
    <p><strong>Lösungsweg:</strong></p>
    <ol>
      <li><strong>Gleichsetzen:</strong> <em>a x² + b x + c = m x + t</em></li>
      <li><strong>Auf Nullform bringen:</strong> <em>a x² + (b - m)x + (c - t) = 0</em></li>
      <li><strong>Mitternachtsformel anwenden:</strong> <em>x₁,₂ = (-B ± √(B² - 4AC)) / (2A)</em></li>
      <li><strong>Diskriminante D prüfen:</strong>
        <ul>
          <li><em>D > 0:</em> 2 Schnittpunkte (Sekante).</li>
          <li><em>D = 0:</em> 1 Berührpunkt (Tangente).</li>
          <li><em>D < 0:</em> kein Schnittpunkt (Passante).</li>
        </ul>
      </li>
      <li><strong>y-Koordinaten berechnen:</strong> x-Werte in die Geradengleichung einsetzen.</li>
    </ol>
  `,
  formulas: [
    {
      name: "Mitternachtsformel (abc-Formel)",
      html: "x₁,₂ = (-b ± √(b² - 4ac)) / (2a)",
      quantities: "ax² + bx + c = 0",
    },
  ],
  quiz: {
    question: "Was bedeutet eine Diskriminante von D = 0 beim Schnitt einer Parabel mit einer Geraden?",
    options: [
      "Die Gerade berührt die Parabel in genau einem Punkt (Tangente)",
      "Die Gerade schneidet die Parabel in zwei verschiedenen Punkten",
      "Die Gerade hat keinen gemeinsamen Punkt mit der Parabel",
      "Die Parabel degeneriert zu einer Geraden",
    ],
    correctIndex: 0,
    explanation:
      "Bei D = 0 liefert die Wurzel den Wert 0, sodass es genau eine Berührstelle gibt. Die Gerade ist eine Tangente.",
  },
  lab: {
    kind: "power-graph",
    title: "Parabel-Schnitt-Labor",
    intro: "Betrachte den Schnittpunkt einer Parabel mit einer Geraden.",
    params: [
      { type: "range", key: "exp", label: "Parabel", unit: "", min: 2, max: 2, step: 1, value: 2 },
    ],
    readouts: [
      {
        key: "typeVal",
        label: "Lagebeziehung",
        compute: () => "Gleichsetzen ⟹ Mitternachtsformel",
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Vergegenwärtige dir den Schnitt einer Normalparabel mit einer Geraden.",
        check: (v) => (v.exp ?? 0) === 2,
      },
    ],
  },
  exercises: [
    {
      id: "ex-ap-2",
      make(rng, _level) {
      const x1 = rng.int(1, 3);
      const x2 = rng.int(4, 6);
      const p = -(x1 + x2);
      const q = x1 * x2;
      return {
        prompt: `Löse die quadratische Gleichung <strong>x² + (${p})x + ${q} = 0</strong> und bestimme die kleinere Lösung <strong>x₁</strong> und die größere Lösung <strong>x₂</strong>.`,
        given: [`x² + (${p})x + ${q} = 0`],
        formulaHint: "x₁,₂ = -p/2 ± √((p/2)² - q)",
        fields: [numberField("x₁ =", x1), numberField("x₂ =", x2)],
        steps: [
          `p = ${p}, q = ${q}`,
          `x₁,₂ = ${-p / 2} ± √(${(-p / 2) ** 2} - ${q}) = ${-p / 2} ± √(${(-p / 2) ** 2 - q})`,
          `Lösungen: x₁ = <strong>${x1}</strong>, x₂ = <strong>${x2}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Klasse! Quadratische Gleichungen löst du prüfungssicher.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=T7wnzYyfc1o",
    title: "Schnittpunkt Parabel und Gerade berechnen",
    author: "Lehrerschmidt",
  },
};

const extremwerte: Lesson = {
  id: "ap-3-extremwerte",
  stageId: "st-5-abschlusspruefung",
  stepNumber: 3,
  title: "5.3 Extremwertprobleme ohne Differentialrechnung",
  subtitle: "Maximaler Flächeninhalt oder minimale Kosten über den Scheitelpunkt",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I/II/III) Abschlussprüfung",
  whyItMatters:
    "Optimierungsfragen (maximales Volumen bei minimalem Material) gehören zu den anspruchsvollsten Aufgaben der Realschulprüfung.",
  explanationHtml: `
    <p>Viele Optimierungsaufgaben führen auf eine quadratische Zielfunktion <em>A(x) = a x² + b x + c</em> mit <em>a < 0</em>:</p>
    <ul>
      <li>Der <strong>maximale Wert</strong> wird genau im <strong>Scheitelpunkt S(x_s | y_s)</strong> angenommen!</li>
      <li><strong>Scheitelkoordinaten:</strong> <em>x_s = -b / (2a)</em> und <em>y_max = c - b² / (4a)</em>.</li>
      <li>Typisches Beispiel: Ein Zaun mit gegebener Gesamtlänge <em>U</em> soll ein Rechteck mit maximalem Flächeninhalt <em>A = x · (U/2 - x)</em> umspannen.</li>
    </ul>
  `,
  formulas: [
    {
      name: "Scheitelpunktstelle",
      html: "x_s = -b / (2a)",
      quantities: "Stelle des Maximums (für a < 0) bzw. Minimums (für a > 0)",
    },
  ],
  quiz: {
    question: "Wo liegt das Maximum einer quadratischen Funktion f(x) = -2x² + 8x + 5?",
    options: ["Bei x = 2 (Scheitelstelle)", "Bei x = 4", "Bei x = 0", "Bei x = -2"],
    correctIndex: 0,
    explanation:
      "Mit x_s = -b / (2a) = -8 / (2 · (-2)) = -8 / (-4) = 2 liegt das Maximum genau bei x = 2.",
  },
  lab: {
    kind: "power-graph",
    title: "Extremwert-Labor",
    intro: "Erkenne das Maximum einer nach unten geöffneten Parabel im Scheitelpunkt.",
    params: [
      { type: "range", key: "exp", label: "Parabelform", unit: "", min: 2, max: 2, step: 1, value: 2 },
    ],
    readouts: [
      {
        key: "typeVal",
        label: "Scheitelpunkt",
        compute: () => "Maximum bei x_s = -b / (2a)",
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Veranschauliche dir den Hochpunkt einer Parabel.",
        check: (v) => (v.exp ?? 0) === 2,
      },
    ],
  },
  exercises: [
    {
      id: "ex-ap-3",
      make(rng, _level) {
      const xs = rng.int(2, 6);
      const b = 4 * xs;
      const c = rng.int(5, 20);
      const yMax = -2 * xs * xs + b * xs + c;
      return {
        prompt: `Die Fläche einer Einzäunung wird durch <strong>A(x) = -2x² + ${b}x + ${c}</strong> beschrieben. Für welchen Wert <strong>x_max</strong> wird der Flächeninhalt maximal und wie groß ist die maximale Fläche <strong>A_max</strong>?`,
        given: [`A(x) = -2x² + ${b}x + ${c}`],
        formulaHint: "x_max = -b / (2a); A_max = A(x_max)",
        fields: [numberField("x_max =", xs, "m", 0), numberField("A_max =", yMax, "m²", 0)],
        steps: [
          `Scheitelstelle berechnen: x_max = -${b} / (2 · (-2)) = -${b} / (-4) = <strong>${xs} m</strong>`,
          `Wert einsetzen: A_max = -2 · ${xs}² + ${b} · ${xs} + ${c} = <strong>${yMax} m²</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Großartig! Du löst Extremwertprobleme sicher über die Scheitelpunktform.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=G-Y_z65qvnM",
    title: "Extremwertproblem ohne Ableitung lösen",
    author: "Daniel Jung",
  },
};

export const STAGE_ABSCHLUSSPRUEFUNG: Stage = {
  id: "st-5-abschlusspruefung",
  stageNumber: 5,
  title: "Raumgeometrie & Quadratische Vertiefung",
  subtitle: "Zusammengesetzte Körper, Parabeln und Extremwertprobleme",
  icon: "🏆",
  accent: "#ec4899",
  badgeTitle: "Prüfungs-Profi",
  lehrplanLabel: "M10 (II/III) LB 2 & 4 / Abschlussprüfung",
  lessons: [rotationskoerper, parabelnAbschluss, extremwerte],
};
