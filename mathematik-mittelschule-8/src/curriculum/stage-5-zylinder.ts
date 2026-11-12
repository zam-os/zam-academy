import { near, numberField } from "./helpers";
import {
  BOTH,
  lab,
  makeLesson,
  makeStage,
  output,
  range,
  task,
} from "./builders";
import { fmt, frac } from "../exercises/format";

const LB: [number | null, number] = [5, 5];
const PI = 3.141592653589793;

export const STAGE_ZYLINDER = makeStage(
  5,
  "Rauminhalt von Zylindern",
  "Die Volumenanalogie V = G · hₖ nutzen, zusammengesetzte Körper sowie Berufsaufgaben lösen und Kreisringzylinder berechnen (M8)",
  "#d97706",
  "🥫",
  LB,
  [
    // 5.1 Zylindervolumen in Analogie zu Prismen (R + M)
    makeLesson(5, 1, LB, {
      id: "zy-1-zylindervolumen-analogie",
      title: "Zylindervolumen (Analogie V = G · hₖ)",
      subtitle: "Grundfläche r² · π mal Körperhöhe — genau wie bei geraden Prismen",
      tracks: BOTH,
      whyItMatters:
        "Ob Getränkedose, Silo, Litfaßsäule oder Brunnenschacht: Das Volumen jedes geraden Zylinders funktioniert nach derselben Grundidee wie beim Prisma.",
      explanationHtml: `
        <p>Genau wie beim Quader oder Dreiecksprisma stapelt man beim <strong>geraden Kreiszylinder</strong> lauter gleiche Grundflächen G bis zur Höhe h<sub>k</sub> übereinander.</p>
        <div class="example">
          <strong>Beispiel:</strong> Ein zylindrischer Kochtopf hat Radius r = 10 cm (1 dm) und Höhe h<sub>k</sub> = 15 cm (1,5 dm).<br>
          Grundfläche G = 1² · π ≈ 3,14 dm² → V = G · h<sub>k</sub> = 3,14 · 1,5 ≈ <strong>4,71 dm³ = 4,71 Liter</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> <strong>V = G · h<sub>k</sub> = r² · π · h<sub>k</sub></strong>. Für Umkehraufgaben gilt <strong>h<sub>k</sub> = V : (r² · π)</strong>! Vergiss nie: 1 dm³ = 1 Liter und 1 000 cm³ = 1 Liter.
        </div>
      `,
      formulas: [
        {
          name: "Volumen des geraden Zylinders",
          html: "V = G · h<sub>k</sub> = r² · π · h<sub>k</sub>",
          quantities: "G = r² · π Kreisgrundfläche, h_k Körperhöhe",
        },
        {
          name: "Umkehrung nach der Höhe",
          html: `h<sub>k</sub> = ${frac("V", "r² · π")}`,
          quantities: "Füllhöhe bei gegebenem Volumen V",
        },
      ],
      quiz: {
        question: "Eine regenfeste Tonne hat r = 2 dm und hₖ = 5 dm. Wie viele Liter passen maximal hinein?",
        options: ["20 · π ≈ 62,8 l", "10 · π ≈ 31,4 l", "40 · π ≈ 125,7 l"],
        correctIndex: 0,
        explanation:
          "V = G · h_k = 2² · π · 5 = 4 · 5 · π = 20 · π ≈ 62,8 dm³ = 62,8 Liter.",
      },
      lab: lab(
        "cylinder-volume",
        "Zylinder schichtweise füllen",
        "Stelle Radius r, Höhe hₖ und Füllstand ein und beobachte das Verhältnis von Grundfläche G zu Volumen V.",
        [
          range("r", "Radius r", 1.5, 5, 3, 0.5, "cm"),
          range("hk", "Höhe hₖ", 2, 8, 5, 1, "cm"),
          range("fill", "Füllstand", 20, 100, 100, 10, "%"),
        ],
        [
          output("G", "Grundfläche G", (v) => PI * v.r * v.r, "cm²", 2),
          output("V", "Gefülltes Volumen", (v) => PI * v.r * v.r * v.hk * (v.fill / 100), "cm³", 2, true),
        ],
        [
          {
            id: "half-full-r2",
            text: "Fülle einen Zylinder mit r = 2 cm und hₖ = 6 cm genau zur Hälfte (50 % → ca. 37,70 cm³).",
            check: (v, r) => v.r === 2 && v.hk === 6 && v.fill === 50 && near(Number(r.V), 12 * PI, 0.05),
          },
          {
            id: "full-r4-h5",
            text: "Fülle bei r = 4 cm und hₖ = 5 cm komplett auf 100 % (ca. 251,33 cm³).",
            check: (v, r) => v.r === 4 && v.hk === 5 && v.fill === 100 && near(Number(r.V), 80 * PI, 0.1),
          },
          {
            id: "max-G",
            text: "Stelle den größten Radius r = 5 cm ein (Grundfläche G ≈ 78,54 cm²).",
            check: (v) => v.r === 5,
          },
        ],
      ),
      exercises: [
        {
          id: "cyl-volume-liters",
          make(rng, level) {
            const d = rng.pick([4, 6, 8, 10]);
            const r = d / 2;
            const hk = rng.pick([5, 6, 8, 10]);
            const V = Number((PI * r * r * hk).toFixed(2));
            return task(
              level,
              `Berechne das Volumen eines Zylinders mit Radius r = ${r} cm und Höhe hₖ = ${hk} cm.`,
              `Ein zylindrischer Regenwasser-Speicher besitzt den Durchmesser d = ${d} dm und die Höhe hₖ = ${hk} dm. Wie viele Liter fasst er maximal?`,
              level === 1
                ? [numberField("Volumen V =", V, "cm³", 2, { tolerance: 0.005 })]
                : [
                    numberField("Fassungsvermögen =", V, "l", 2, {
                      tolerance: 0.005,
                      slips: [
                        {
                          value: Number((PI * d * d * hk).toFixed(2)),
                          hint: "Du hast d statt des Radius r = d : 2 quadriert!",
                        },
                      ],
                    }),
                  ],
              "V = r² · π · h_k (mit 1 dm³ = 1 Liter)",
              [
                `r = ${r} → G = ${r}² · π ≈ ${fmt(PI * r * r, 2)}`,
                `V = ${fmt(PI * r * r, 2)} · ${hk} = <strong>${fmt(V, 2)} ${level === 1 ? "cm³" : "l"}</strong>`,
              ],
              { d, r, hk, V },
            );
          },
        },
        {
          id: "cyl-reverse-height",
          make(rng, level) {
            const r = rng.pick([2, 3, 4, 5]);
            const hk = rng.pick([5, 6, 8, 10, 12]);
            const V = Number((PI * r * r * hk).toFixed(2));
            return task(
              level,
              `Ein Zylinder mit Grundradius r = ${r} cm hat das Volumen V = ${fmt(V, 2)} cm³. Berechne die Höhe hₖ.`,
              `In ein zylindrisches Gefäß (r = ${r} dm) werden genau ${fmt(V, 2)} Liter Saft gefüllt. Wie hoch steht der Saft im Gefäß?`,
              [numberField("Höhe hₖ =", hk, level === 1 ? "cm" : "dm", 1, { absTolerance: 0.08 })],
              "h_k = V : (r² · π)",
              [
                `G = ${r}² · π ≈ ${fmt(PI * r * r, 2)}`,
                `hₖ = ${fmt(V, 2)} : ${fmt(PI * r * r, 2)} ≈ <strong>${hk} ${level === 1 ? "cm" : "dm"}</strong>`,
              ],
              { r, hk, V },
            );
          },
        },
      ],
    }),

    // 5.2 Zusammengesetzte Körper & Berufsaufgaben (R + M)
    makeLesson(5, 2, LB, {
      id: "zy-2-zylinder-zusammengesetzt",
      title: "Zusammengesetzte Körper & Beruf",
      subtitle: "Zylinder mit Quader/Prisma kombinieren und Werkstück-Massen berechnen",
      tracks: BOTH,
      whyItMatters:
        "Im Handwerk bestehen Werkstücke, Bolzen, Türme oder Behälter oft aus mehreren Teilkörpern, deren Materialgewicht du über Volumen × Dichte bestimmst.",
      explanationHtml: `
        <p>Bei <strong>zusammengesetzten Körpern</strong> teilst du das Objekt in bekannte Grundkörper (Quader, Prisma, Zylinder, Halbzylinder) auf und addierst oder subtrahierst deren Volumina.</p>
        <div class="example">
          <strong>Beispiel (Stahlbolzen):</strong> Ein dicker Sockelzylinder (V₁ = 120 cm³) trägt einen dünneren Stiftzylinder (V₂ = 30 cm³).<br>
          Gesamtvolumen V = 120 + 30 = <strong>150 cm³</strong>.<br>
          Bei Stahldichte 7,8 g/cm³ wiegt der Bolzen: 150 · 7,8 = <strong>1 170 g = 1,17 kg</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Masse <strong>m = V · Dichte</strong>. Prüfe immer die Einheiten: Passt cm³ zu g/cm³ und dm³ zu kg/dm³? Ein Halbzylinder hat genau ½ · r² · π · h<sub>k</sub>.
        </div>
      `,
      formulas: [
        {
          name: "Masse aus Volumen und Dichte",
          html: "m = V · ρ (Dichte in g/cm³ oder kg/dm³)",
          quantities: "Volumen und Dichte müssen in passenden Einheiten stehen",
        },
        {
          name: "Halbzylinder-Volumen",
          html: `V<sub>Halb</sub> = ${frac("r² · π · h_k", 2)}`,
          quantities: "Z. B. für ein Tonnendach über einem Quader",
        },
      ],
      quiz: {
        question: "Auf einem Quader (V₁ = 400 m³) sitzt ein halbkreisförmiges Tonnendach (Halbzylinder mit V_Voll = 120 m³). Gesamtvolumen?",
        options: ["460 m³", "520 m³", "260 m³"],
        correctIndex: 0,
        explanation: "Das Dach ist nur ein halber Zylinder (120 : 2 = 60 m³), also 400 + 60 = 460 m³.",
      },
      lab: lab(
        "cylinder-compound",
        "Teilfüllung & Volumenanteil prüfen",
        "Bestimme Volumina für volle und teilweise gefüllte Zylinder als Baustein zusammengesetzter Körper.",
        [
          range("r", "Radius r", 2, 5, 3, 0.5, "dm"),
          range("hk", "Länge / Höhe hₖ", 2, 8, 4, 1, "dm"),
          range("fill", "Anteil (%)", 20, 100, 60, 10, "%"),
        ],
        [
          output("G", "Querschnitt G", (v) => PI * v.r * v.r, "dm²", 2),
          output("V", "Volumenanteil", (v) => PI * v.r * v.r * v.hk * (v.fill / 100), "dm³", 2, true),
        ],
        [
          {
            id: "half-cyl-50",
            text: "Stelle einen Halbzylinder (50 %) mit r = 4 dm und hₖ = 5 dm dar.",
            check: (v, r) => v.r === 4 && v.hk === 5 && v.fill === 50 && near(Number(r.V), 40 * PI, 0.08),
          },
          {
            id: "barrel-200",
            text: "Erreiche bei r = 3 dm und hₖ = 8 dm und 100 % über 220 Liter (dm³).",
            check: (v, r) => v.r === 3 && v.hk === 8 && v.fill === 100 && Number(r.V) > 220,
          },
          {
            id: "small-part",
            text: "Wähle 20 % von r = 2 dm und hₖ = 5 dm.",
            check: (v) => v.r === 2 && v.hk === 5 && v.fill === 20,
          },
        ],
      ),
      exercises: [
        {
          id: "mass-from-cyl-volume",
          make(rng, level) {
            const r = rng.pick([2, 3, 4]);
            const hk = rng.pick([5, 8, 10]);
            const V = PI * r * r * hk;
            const vRounded = Number(V.toFixed(2));
            const rho = rng.pick([2.7, 7.8]);
            const mass = Number((vRounded * rho).toFixed(1));
            return task(
              level,
              `Ein Aluminium- bzw. Metallzylinder (r = ${r} cm, hₖ = ${hk} cm) hat Dichte ${fmt(rho, 1)} g/cm³. Berechne seine Masse in Gramm.`,
              `In der Metallwerkstatt wird ein Vollzylinder aus ${rho < 3 ? "Aluminium (2,7 g/cm³)" : "Stahl (7,8 g/cm³)"} mit r = ${r} cm und Länge ${hk} cm gedreht. Wie schwer ist das Werkstück in Gramm?`,
              [numberField("Masse m =", mass, "g", 1, { tolerance: 0.005 })],
              "Erst V = r² · π · h_k (auf 2 Dezimalen runden), dann m = V · Dichte",
              [
                `V = ${r}² · π · ${hk} ≈ ${fmt(vRounded, 2)} cm³`,
                `m = ${fmt(vRounded, 2)} · ${fmt(rho, 1)} = <strong>${fmt(mass, 1)} g</strong>`,
              ],
              { r, hk, V, rho, mass },
            );
          },
        },
        {
          id: "hall-quader-halfcyl",
          make(rng, level) {
            const l = rng.pick([10, 12, 15]);
            const w = rng.pick([4, 6, 8]);
            const h = rng.pick([3, 4]);
            const vBox = l * w * h;
            const r = w / 2;
            const vRoof = 0.5 * PI * r * r * l;
            const total = Number((vBox + vRoof).toFixed(2));
            return task(
              level,
              `Eine Maschinenhalle besteht unten aus einem Quader (${l} m × ${w} m × ${h} m) und oben aus einem Halbzylinder (d = ${w} m, Länge ${l} m). Berechne das Gesamtvolumen.`,
              `Ein Gewächshaus setzt sich zusammen aus einem quaderförmigen Unterbau (${l} m lang, ${w} m breit, ${h} m hoch) und einem halbzylindrischen Gewölbedach darüber (Länge ${l} m). Wie viel m³ Raumluft fasst das Gewächshaus?`,
              [
                numberField("Gesamtvolumen =", total, "m³", 2, {
                  tolerance: 0.005,
                  slips: [
                    {
                      value: Number((vBox + 2 * vRoof).toFixed(2)),
                      hint: "Das Dach ist nur ein halber Zylinder — teile das Zylindervolumen noch durch 2!",
                    },
                  ],
                }),
              ],
              "V_ges = Quader + ½ · (w : 2)² · π · l",
              [
                `Quader = ${vBox} m³; Halbzylinder = ½ · ${r}² · π · ${l} ≈ ${fmt(vRoof, 2)} m³`,
                `Gesamt: <strong>${fmt(total, 2)} m³</strong>`,
              ],
              { l, w, h, total },
            );
          },
        },
      ],
    }),

    // 5.3 Kreisringzylinder / Hohlzylinder (M-only)
    makeLesson(5, 3, LB, {
      id: "zy-3-kreisringzylinder",
      title: "Kreisringzylinder (Rohre & Hohlkörper)",
      subtitle: "Volumen V = (R² − r²) · π · hₖ bei Rohren und Buchsen berechnen (M8)",
      tracks: ["M"],
      whyItMatters:
        "Wasserrohre, Betonringe oder Metallhülsen sind innen hohl: Ihr Materialvolumen entsteht aus der Kreisringfläche mal Körperlänge.",
      explanationHtml: `
        <p>Ein <strong>Kreisringzylinder</strong> (Hohlzylinder) ist ein Zylinder mit einem inneren zylindrischen Bohrloch. Seine Grundfläche G ist genau ein <strong>Kreisring</strong>!</p>
        <div class="example">
          <strong>Beispiel:</strong> Ein Metallrohr ist h<sub>k</sub> = 20 cm lang, Außenradius R = 5 cm, Innenradius r = 3 cm.<br>
          Ringfläche G = (5² − 3²) · π = 16 · π ≈ 50,27 cm².<br>
          Materialvolumen V = G · 20 = 320 · π ≈ <strong>1 005,31 cm³</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> <strong>V = (R² − r²) · π · h<sub>k</sub></strong> (oder äußerer Vollzylinder minus inneres Bohrloch). Prüfe in Aufgaben, ob Durchmesser D, d oder Wandstärke gegeben sind!
        </div>
      `,
      formulas: [
        {
          name: "Volumen des Kreisringzylinders",
          html: "V = G<sub>Ring</sub> · h<sub>k</sub> = (R² − r²) · π · h<sub>k</sub>",
          quantities: "R Außenradius, r Innenradius, h_k Rohrlänge",
        },
      ],
      quiz: {
        question: "Ein Rohr hat Innendurchmesser d = 6 cm und eine Wandstärke von 1 cm rundherum. Wie groß ist der Außenradius R?",
        options: ["R = 4 cm", "R = 7 cm", "R = 3,5 cm"],
        correctIndex: 0,
        explanation:
          "Innenradius r = 6 : 2 = 3 cm. Dazu kommt einmal die Wandstärke 1 cm → R = 3 + 1 = 4 cm!",
      },
      lab: lab(
        "hollow-cylinder",
        "Hohlzylinder-Rohr berechnen",
        "Verändere Außenradius R, Innenradius r und Rohrlänge hₖ und beobachte Ringfläche G sowie Materialvolumen V.",
        [
          range("R", "Außenradius R", 3.5, 6, 5, 0.5, "cm"),
          range("r", "Innenradius r", 1, 3, 2, 0.5, "cm"),
          range("hk", "Länge hₖ", 3, 8, 6, 1, "cm"),
        ],
        [
          output("G", "Kreisring G", (v) => (v.R * v.R - v.r * v.r) * PI, "cm²", 2),
          output("V", "Materialvolumen V", (v) => (v.R * v.R - v.r * v.r) * PI * v.hk, "cm³", 2, true),
        ],
        [
          {
            id: "pipe-4-2-5",
            text: "Stelle ein Rohr mit R = 4 cm, r = 2 cm und Länge hₖ = 5 cm ein (V = 60·π ≈ 188,50 cm³).",
            check: (v, r) => v.R === 4 && v.r === 2 && v.hk === 5 && near(Number(r.V), 60 * PI, 0.08),
          },
          {
            id: "thin-wall-6-3-4",
            text: "Wähle R = 6 cm, r = 3 cm und Länge hₖ = 4 cm (G = 27·π).",
            check: (v) => v.R === 6 && v.r === 3 && v.hk === 4,
          },
          {
            id: "max-pipe",
            text: "Maximiere Material: R = 6 cm, r = 1 cm, hₖ = 8 cm.",
            check: (v) => v.R === 6 && v.r === 1 && v.hk === 8,
          },
        ],
      ),
      exercises: [
        {
          id: "hollow-cyl-direct",
          make(rng, level) {
            const rIn = rng.int(2, 5);
            const wall = rng.int(1, 3);
            const R = rIn + wall;
            const hk = rng.pick([10, 15, 20, 25]);
            const V = Number(((R * R - rIn * rIn) * PI * hk).toFixed(2));
            return task(
              level,
              `Ein Hohlzylinder hat R = ${R} cm, r = ${rIn} cm und Länge hₖ = ${hk} cm. Berechne sein Materialvolumen V.`,
              `Ein Beton-Brunnenring (Länge hₖ = ${hk} dm) besitzt Innenradius r = ${rIn} dm und Wandstärke ${wall} dm (also Außenradius R = ${R} dm). Wie viel dm³ Beton steckt im Ring?`,
              [
                numberField("Volumen V =", V, level === 1 ? "cm³" : "dm³", 2, {
                  tolerance: 0.005,
                  slips: [
                    {
                      value: Number((wall * wall * PI * hk).toFixed(2)),
                      hint: "Erst R² und r² getrennt bilden und dann subtrahieren: (R² − r²), niemals (R − r)²!",
                    },
                  ],
                }),
              ],
              "V = (R² − r²) · π · h_k",
              [
                `G = (${R}² − ${rIn}²) · π = ${R * R - rIn * rIn} · π ≈ ${fmt((R * R - rIn * rIn) * PI, 2)}`,
                `V = G · ${hk} = <strong>${fmt(V, 2)} ${level === 1 ? "cm³" : "dm³"}</strong>`,
              ],
              { R, rIn, hk, V },
            );
          },
        },
        {
          id: "hollow-pipe-wall",
          make(rng, level) {
            const D = rng.pick([10, 12, 16, 20]);
            const R = D / 2;
            const wall = rng.pick([1, 2]);
            const r = R - wall;
            const hk = rng.pick([20, 30, 50]);
            const V = Number(((R * R - r * r) * PI * hk).toFixed(2));
            return task(
              level,
              `Ein Stahlrohr hat Außendurchmesser D = ${D} cm, Wandstärke ${wall} cm und Länge ${hk} cm. Berechne das Metallvolumen.`,
              `Für einen Metallrahmen wird ein ${hk} cm langes Rohr (Außendurchmesser ${D} cm, Materialstärke ${wall} cm) zugeschnitten. Bestimme das reine Metallvolumen in cm³.`,
              [numberField("Metallvolumen =", V, "cm³", 2, { tolerance: 0.005 })],
              "R = D : 2; r = R − Wandstärke; dann V = (R² − r²) · π · h_k",
              [
                `R = ${R} cm, Innenradius r = ${R} − ${wall} = ${r} cm`,
                `V = (${R * R} − ${r * r}) · π · ${hk} = <strong>${fmt(V, 2)} cm³</strong>`,
              ],
              { D, R, r, hk, V },
            );
          },
        },
      ],
    }),
  ],
);
