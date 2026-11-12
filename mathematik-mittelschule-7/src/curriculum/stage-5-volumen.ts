import { fmt, frac } from "../exercises/format";
import { near, numberField } from "./helpers";
import {
  BOTH,
  choice,
  lab,
  makeLesson,
  makeStage,
  output,
  range,
  task,
} from "./builders";

const LB = [5, 5] as [number, number];

export const STAGE_VOLUMEN = makeStage(
  5,
  "Rauminhalt – gerade Prismen",
  "Volumenberechnung gerader Prismen anschaulich (V = G · hₖ) und zusammengesetzte Körper im Beruf",
  "#0284c7",
  "🧊",
  LB,
  [
    makeLesson(5, 1, LB, {
      id: "vo-1-prismenvolumen-grundidee",
      title: "Volumen gerader Prismen: V = G · hₖ",
      subtitle: "Von der Grundfläche G mit der Körperhöhe hₖ zum Rauminhalt",
      tracks: BOTH,
      whyItMatters:
        "Egal ob rechteckige Kiste, dreieckiger Schacht oder (im M-Zug) trapezförmige Rinne: Alle geraden Prismen folgen derselben Volumenformel.",
      explanationHtml: `
        <p>Stell dir die <strong>Grundfläche G</strong> als dünne 1 cm hohe Schicht aus Würfelchen vor. Stapelst du diese Schicht so hoch wie die <strong>Körperhöhe h<sub>k</sub></strong>, erhältst du den gesamten Rauminhalt:</p>
        <p><strong>V = G · h<sub>k</sub></strong></p>
        <div class="example">
          <strong>Beispiel (Dreiecksprisma):</strong><br>
          Grundfläche Dreieck (g = 6 cm, h = 4 cm): G = (6 · 4) : 2 = 12 cm².<br>
          Körperhöhe h<sub>k</sub> = 10 cm → V = 12 cm² · 10 cm = <strong>120 cm³</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Bestimme immer zuerst die passende <strong>Grundfläche G</strong> (Rechteck, Parallelogramm, Dreieck; M-Zug auch Drachen, Trapez), dann mal Körperhöhe <strong>h<sub>k</sub></strong>! (1 dm³ = 1 Liter)
        </div>
      `,
      formulas: [
        {
          name: "Volumen gerades Prisma",
          html: `V = G · h<sub>k</sub>`,
          quantities: "G Inhalt der Grundfläche, hₖ Körperhöhe",
        },
        {
          name: "Liter-Umrechnung",
          html: `1 dm³ = 1 000 cm³ = 1 Liter`,
          quantities: "Volumeneinheiten für Flüssigkeiten und Schüttgut",
        },
      ],
      quiz: {
        question: "Ein gerades Prisma hat eine Grundfläche von G = 25 cm² und eine Körperhöhe von hₖ = 8 cm. Wie groß ist sein Volumen?",
        options: ["200 cm³", "33 cm³", "100 cm³"],
        correctIndex: 0,
        explanation:
          "Für jedes gerade Prisma gilt V = G · hₖ = 25 cm² · 8 cm = 200 cm³.",
      },
      lab: lab(
        "prism-volume",
        "Prismen füllen (V = G · hₖ)",
        "Wähle die Form der Grundfläche und verändere den Füllstand sowie die Maße.",
        [
          choice("shape", "Grundfläche", ["Rechteck", "Dreieck", "Parallelogramm", "Trapez (M7)", "Drachen (M7)"], 1),
          range("g", "Grundseite / Diagonale", 3, 8, 6, 1, "cm"),
          range("h", "Grundflächenhöhe", 2, 6, 4, 1, "cm"),
          range("hk", "Körperhöhe hₖ", 3, 8, 5, 1, "cm"),
          range("fill", "Füllstand", 20, 100, 100, 10, "%"),
        ],
        [
          output(
            "G",
            "Grundfläche G",
            (v) =>
              v.shape === 0 || v.shape === 2
                ? v.g * v.h
                : v.shape === 3
                  ? ((v.g + Math.max(2, v.g - 2)) / 2) * v.h
                  : (v.g * v.h) / 2,
            "cm²",
            1,
          ),
          output(
            "V",
            "Volumen V",
            (v) => {
              const G =
                v.shape === 0 || v.shape === 2
                  ? v.g * v.h
                  : v.shape === 3
                    ? ((v.g + Math.max(2, v.g - 2)) / 2) * v.h
                    : (v.g * v.h) / 2;
              return G * v.hk * (v.fill / 100);
            },
            "cm³",
            1,
            true,
          ),
        ],
        [
          {
            id: "half-fill-tri",
            text: "Fülle das Dreiecksprisma (g = 6 cm, h = 4 cm, hₖ = 5 cm) genau zur Hälfte (50 %) → 30 cm³.",
            check: (v, r) => v.shape === 1 && v.fill === 50 && near(Number(r.V), 30, 0.01),
          },
          {
            id: "para-vol",
            text: "Wähle Parallelogramm (100 % voll) und erreiche V = 120 cm³.",
            check: (v, r) => v.shape === 2 && v.fill === 100 && near(Number(r.V), 120, 0.01),
          },
          {
            id: "trap-vol",
            text: "Teste das Trapezprisma bei hₖ = 6 cm und 100 % Füllung.",
            check: (v) => v.shape === 3 && v.hk === 6 && v.fill === 100,
          },
        ],
      ),
      exercises: [
        {
          id: "prism-vol-given-G",
          make(rng, level) {
            const g = rng.int(12, 48);
            const hk = rng.stepped(3, 12, 0.5);
            const vol = Number((g * hk).toFixed(1));
            return task(
              level,
              `Gerades Prisma: Grundfläche G = ${g} cm², Körperhöhe hₖ = ${fmt(hk, 1)} cm. Berechne V.`,
              `Eine Stahlsäule hat eine Querschnittsfläche von ${g} cm² und ist ${fmt(hk, 1)} cm hoch. Welches Volumen hat die Säule?`,
              [numberField("V =", vol, "cm³", 1)],
              "V = G · hₖ.",
              [
                `V = ${g} · ${fmt(hk, 1)}`,
                `<strong>${fmt(vol, 1)} cm³</strong>`,
              ],
              { g, hk, vol },
            );
          },
        },
        {
          id: "prism-vol-shape",
          make(rng, level) {
            const isPara = rng.next() < 0.5;
            const g = rng.int(4, 10);
            const h = rng.int(3, 7);
            const hk = rng.int(5, 12);
            const G = isPara ? g * h : (g * h) / 2;
            const V = G * hk;
            return task(
              level,
              `Gerades ${isPara ? "Parallelogrammprisma" : "Dreiecksprisma"}: Grundseite ${g} cm, Dreiecks-/Parallelogrammhöhe ${h} cm, Körperhöhe hₖ = ${hk} cm.`,
              `Ein Verpackungskeil in Form eines geraden ${isPara ? "Parallelogrammprismas" : "Dreiecksprismas"} besitzt eine Grundseite von ${g} cm, eine Grundflächenhöhe von ${h} cm und ist ${hk} cm lang. Berechne das Volumen.`,
              [numberField("V =", V, "cm³", 1)],
              `Erst G berechnen (${isPara ? "g · h" : "(g · h) : 2"}), dann mit hₖ = ${hk} cm malnehmen.`,
              [
                `G = ${isPara ? `${g} · ${h}` : `(${g} · ${h}) : 2`} = ${fmt(G, 1)} cm²`,
                `V = ${fmt(G, 1)} · ${hk} = <strong>${fmt(V, 1)} cm³</strong>`,
              ],
              { G, hk, V },
            );
          },
        },
      ],
    }),

    makeLesson(5, 2, LB, {
      id: "vo-2-prismen-beruf-zusammengesetzt",
      title: "Zusammengesetzte Körper & Berufsaufgaben",
      subtitle: "Bau-, Werkstatt- und Verpackungskörper in gerade Prismen zerlegen",
      tracks: BOTH,
      whyItMatters:
        "Im Handwerk (Zimmerer, Betonbau, Metallbau) berechnet man Volumen, Literinhalt und Gewicht komplexer Werkstücke fast immer durch Zerlegen in Prismen.",
      explanationHtml: `
        <p>Zusammengesetzte Körper (z. B. ein Haus mit Satteldach oder ein Stahlträger) zerlegst du einfach in <strong>bekannte gerade Prismen</strong> (Quader + Dreiecksprisma) und addierst deren Volumina!</p>
        <div class="example">
          <strong>Beispiel (Gartenhaus):</strong><br>
          • Unten Quader: 4 m · 3 m · 2 m = 24 m³<br>
          • Dach (Dreiecksprisma): G = ${frac("4 m · 1,5 m", 2)} = 3 m², Länge 3 m → V<sub>Dach</sub> = 3 · 3 = 9 m³<br>
          • Gesamtvolumen: 24 m³ + 9 m³ = <strong>33 m³</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Zerlege den Körper in Einzelprismen oder berechne die ganze Querschnitts-Stirnfläche G<sub>ges</sub> und multipliziere einmal mit der gemeinsamen Länge h<sub>k</sub>!
        </div>
      `,
      formulas: [
        {
          name: "Zusammengesetztes Prisma",
          html: `V<sub>ges</sub> = V₁ + V₂ = (G₁ + G₂) · h<sub>k</sub>`,
          quantities: "bei gleicher Körperlänge hₖ (z. B. Haus oder Träger)",
        },
      ],
      quiz: {
        question: "Eine Garage ist ein Quader (6 m × 4 m × 2,5 m) mit einem dreieckigen Flachdach-Aufsatz von 12 m³ Volumen. Wie groß ist der Gesamtraum?",
        options: ["72 m³", "60 m³", "48 m³"],
        correctIndex: 0,
        explanation:
          "Quader: 6 · 4 · 2,5 = 60 m³. Plus Aufsatz 12 m³ = 72 m³.",
      },
      lab: lab(
        "prism-volume",
        "Werkstück- & Behältervolumen",
        "Stelle ein Aquarium oder eine Rinne ein und prüfe das Volumen bei Teil- und Vollfüllung.",
        [
          choice("shape", "Querschnitt", ["Rechteck", "Dreieck", "Trapez (M7)"], 2),
          range("g", "Breite / lange Parallelseite", 4, 8, 6, 1, "dm"),
          range("h", "Tiefe der Grundfläche", 2, 6, 3, 1, "dm"),
          range("hk", "Länge hₖ", 3, 8, 4, 1, "dm"),
          range("fill", "Füllung", 20, 100, 80, 10, "%"),
        ],
        [
          output(
            "V",
            "Inhalt (dm³ = Liter)",
            (v) => {
              const G =
                v.shape === 0
                  ? v.g * v.h
                  : v.shape === 1
                    ? (v.g * v.h) / 2
                    : ((v.g + Math.max(2, v.g - 2)) / 2) * v.h;
              return G * v.hk * (v.fill / 100);
            },
            "l",
            1,
            true,
          ),
        ],
        [
          {
            id: "full-rect-96",
            text: "Fülle ein Rechteckbecken mit 6 dm × 4 dm × 4 dm zu 100 % (96 l).",
            check: (v, r) => v.shape === 0 && v.fill === 100 && near(Number(r.V), 96, 0.01),
          },
          {
            id: "trap-gutter",
            text: "Berechne eine 100 % gefüllte Trapezrinne (g = 6 dm, h = 4 dm, hₖ = 5 dm → 100 l).",
            check: (v, r) => v.shape === 2 && v.g === 6 && v.h === 4 && v.hk === 5 && v.fill === 100 && near(Number(r.V), 100, 0.01),
          },
          {
            id: "tri-half",
            text: "Stelle ein Dreiecksbecken auf genau 40 % Füllung bei hₖ = 8 dm.",
            check: (v) => v.shape === 1 && v.hk === 8 && v.fill === 40,
          },
        ],
      ),
      exercises: [
        {
          id: "house-composite-vol",
          make(rng, level) {
            const w = rng.int(4, 8);
            const len = rng.int(5, 10);
            const hWall = rng.int(2, 4);
            const hRoof = rng.int(2, 3);
            const vWall = w * hWall * len;
            const vRoof = ((w * hRoof) / 2) * len;
            const total = vWall + vRoof;
            return task(
              level,
              `Zusammengesetzter Körper: Quader (${w} m × ${len} m × ${hWall} m) + Dreiecksprisma (g = ${w} m, h = ${hRoof} m, Länge ${len} m).`,
              `Eine Scheune ist ${w} m breit, ${len} m lang und hat ${hWall} m hohe Seitenwände. Das Satteldach bildet ein Dreiecksprisma mit ${hRoof} m Giebelhöhe. Wie viele Kubikmeter Umbauter Raum sind es insgesamt?`,
              [numberField("V =", total, "m³", 1)],
              "Berechne V_Quader + V_Dach (oder Gesamtgiebelfläche · Länge).",
              [
                `Quader: ${w} · ${len} · ${hWall} = ${vWall} m³`,
                `Dach: ((${w} · ${hRoof}) : 2) · ${len} = ${fmt(vRoof, 1)} m³`,
                `<strong>${fmt(total, 1)} m³</strong>`,
              ],
              { vWall, vRoof, total },
            );
          },
        },
        {
          id: "mass-from-volume",
          make(rng, level) {
            const g = rng.int(10, 30);
            const hk = rng.int(4, 10);
            const V = g * hk;
            const density = rng.pick([2.4, 2.7, 7.8]);
            const mass = Number((V * density).toFixed(1));
            return task(
              level,
              `Ein Prisma hat G = ${g} cm² und hₖ = ${hk} cm. 1 cm³ wiegt ${fmt(density, 1)} g. Berechne erst V und dann das Gesamtgewicht.`,
              `Ein Metallprofil (gerades Prisma mit Querschnittsfläche ${g} cm² und Länge ${hk} cm) hat eine Dichte von ${fmt(density, 1)} g pro cm³. Wie schwer ist das Werkstück?`,
              [
                numberField("V =", V, "cm³", 0),
                numberField("Masse =", mass, "g", 1),
              ],
              "Erst V = G · hₖ berechnen, danach mit dem Gewicht je cm³ multiplizieren.",
              [
                `V = ${g} · ${hk} = ${V} cm³`,
                `Masse = ${V} · ${fmt(density, 1)} g = <strong>${fmt(mass, 1)} g</strong>`,
              ],
              { V, mass },
            );
          },
        },
      ],
    }),
  ],
);
