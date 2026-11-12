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
import { fmt, frac, sqrtHtml } from "../exercises/format";

const LB: [number | null, number] = [4, 4];
const PI = 3.141592653589793;

export const STAGE_KREISFLAECHE = makeStage(
  4,
  "Kreisfläche & Zylinderoberfläche",
  "Kreisflächen herleiten, Umkehrung mit Quadratwurzeln anwenden, Kreisring & Kreissektor (M8), zusammengesetzte Flächen und Zylinderoberflächen berechnen",
  "#059669",
  "🎯",
  LB,
  [
    // 4.1 Kreisfläche herleiten (R + M)
    makeLesson(4, 1, LB, {
      id: "kf-1-kreisflaeche-herleitung",
      title: "Flächeninhalt des Kreises herleiten",
      subtitle: "Eingrenzen über Innen-/Außenquadrat sowie Zerlegen in Torten-Sektoren",
      tracks: BOTH,
      whyItMatters:
        "Damit du verstehst, warum A = r² · π gilt und nicht einfach nur auswendig lernst, zerschneiden wir den Kreis im Labor wie eine Pizza.",
      explanationHtml: `
        <p>Man kann den Flächeninhalt eines Kreises doppelt eingrenzen oder anschaulich umlegen:</p>
        <div class="example">
          <strong>Beispiel:</strong><br>
          1) <em>Schranken-Idee:</em> Das große Umquadrat besitzt die Fläche (2r)² = <strong>4 · r²</strong>; das Innenquadrat <strong>2 · r²</strong>. Also liegt die Kreisfläche dazwischen — bei etwa <strong>3,14 · r²</strong>.<br>
          2) <em>Sektoren-Idee:</em> Zerschneidet man den Kreis in viele dünne Tortenstücke und legt sie abwechselnd nebeneinander, entsteht ein Rechteck der Breite <strong>½ · u = π · r</strong> und Höhe <strong>r</strong> → A = (π · r) · r = <strong>r² · π</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Flächenformel: <strong>A = r² · π</strong> (mit r² = r · r, nicht 2 · r!). Verdoppelt man den Radius r, <em>vervierfacht</em> sich der Flächeninhalt!
        </div>
      `,
      formulas: [
        {
          name: "Flächeninhalt des Kreises",
          html: `A = r² · π = (${frac("d", 2)})² · π`,
          quantities: "r Radius (unbedingt r quadrieren, nicht d!)",
        },
        {
          name: "Geometrische Schranke",
          html: "2 · r² &lt; A<sub>Kreis</sub> &lt; 4 · r²",
          quantities: "Fläche zwischen Innenquadrat und Umquadrat",
        },
      ],
      quiz: {
        question: "Du verdoppelst den Radius r einer Pizza. Wie stark wächst ihre Fläche?",
        options: ["Sie vervierfacht sich (4-fach)", "Sie verdoppelt sich (2-fach)", "Sie verdreifacht sich (3-fach)"],
        correctIndex: 0,
        explanation: "Weil der Radius quadriert wird: (2r)² · π = 4 · r² · π — viermal so viel Teig!",
      },
      lab: lab(
        "circle-area-sectors",
        "Pizza-Zerlegung & Schranken 2r² < A < 4r²",
        "Erhöhe die Anzahl der Sektoren und sieh, wie aus den Tortenstücken ein Rechteck (π · r) × r entsteht.",
        [
          range("r", "Radius r", 1.5, 5, 3, 0.5, "cm"),
          range("parts", "Sektoren n", 4, 24, 6, 2),
        ],
        [
          output("A", "Kreisfläche A", (v) => PI * v.r * v.r, "cm²", 2, true),
          output("outerSq", "Umquadrat 4r²", (v) => 4 * v.r * v.r, "cm²", 1),
        ],
        [
          {
            id: "fine-24",
            text: "Teile den Kreis in maximale 24 feine Sektoren bei r = 3 cm.",
            check: (v) => v.parts === 24 && v.r === 3,
          },
          {
            id: "double-from-2-to-4",
            text: "Setze r = 4 cm und prüfe die Schranke (A ≈ 50,27 cm² < 4r² = 64 cm²).",
            check: (v, r) => v.r === 4 && near(Number(r.outerSq), 64, 0.01),
          },
          {
            id: "r5-area",
            text: "Vergrößere auf r = 5 cm (Umquadrat 100 cm², Kreis ≈ 78,54 cm²).",
            check: (v, r) => v.r === 5 && near(Number(r.outerSq), 100, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "circle-area-from-r",
          make(rng, level) {
            const r = rng.stepped(2, 11, 0.5);
            const A = Number((PI * r * r).toFixed(2));
            return task(
              level,
              `Berechne den Flächeninhalt eines Kreises mit dem Radius r = ${fmt(r, 1)} cm.`,
              `Ein runder Spiegel hat einen Radius von r = ${fmt(r, 1)} dm. Wie groß ist die Spiegelfläche in dm²?`,
              [
                numberField("Fläche A =", A, level === 1 ? "cm²" : "dm²", 2, {
                  tolerance: 0.004,
                  slips: [
                    {
                      value: Number((2 * PI * r).toFixed(2)),
                      hint: "2 · π · r ist der Umfang! Für die Fläche rechnet man r² · π (= r · r · π).",
                    },
                  ],
                }),
              ],
              "A = r² · π",
              [
                `r² = ${fmt(r, 1)} · ${fmt(r, 1)} = ${fmt(r * r, 2)}`,
                `A = ${fmt(r * r, 2)} · π = <strong>${fmt(A, 2)} ${level === 1 ? "cm²" : "dm²"}</strong>`,
              ],
              { r, A },
            );
          },
        },
        {
          id: "circle-area-from-d",
          make(rng, level) {
            const d = rng.pick([6, 8, 10, 12, 14, 18, 20]);
            const r = d / 2;
            const A = Number((PI * r * r).toFixed(2));
            return task(
              level,
              `Berechne die Kreisfläche bei gegebenem Durchmesser d = ${d} cm.`,
              `Eine runde Backform misst im Durchmesser d = ${d} cm. Wie groß ist die Bodenfläche, die mit Backpapier ausgelegt wird?`,
              [
                numberField("Fläche A =", A, "cm²", 2, {
                  tolerance: 0.004,
                  slips: [
                    {
                      value: Number((PI * d * d).toFixed(2)),
                      hint: "Du hast den Durchmesser d quadriert! Zuerst immer halbieren zu r = d : 2!",
                    },
                  ],
                }),
              ],
              "Erst r = d : 2, dann A = r² · π.",
              [
                `r = ${d} : 2 = ${r} cm`,
                `A = ${r}² · π = ${r * r} · π = <strong>${fmt(A, 2)} cm²</strong>`,
              ],
              { d, r, A },
            );
          },
        },
      ],
    }),

    // 4.2 Umkehraufgaben zur Kreisfläche (mit √) (R + M)
    makeLesson(4, 2, LB, {
      id: "kf-2-kreisflaeche-umkehrung",
      title: "Kreisfläche & Umkehrung mit der Wurzel",
      subtitle: "Radius r und Durchmesser d aus gegebenem Flächeninhalt A bestimmen",
      tracks: BOTH,
      whyItMatters:
        "Wenn vorgeschrieben ist, wie viel Quadratmeter ein kreisförmiger Platz umfassen soll, brauchst du die Wurzel, um den Radius zum Abstecken zu finden.",
      explanationHtml: `
        <p>Hier verbindet sich Etappe 2 (Quadratwurzel) mit dem Kreis! Um von A nach r zurückzurechnen, teilst du zuerst durch π und ziehst danach die Quadratwurzel:</p>
        <div class="example">
          <strong>Beispiel:</strong> Ein Kreis hat die Fläche A = 78,54 cm².<br>
          1. Durch π teilen: r² = 78,54 : π ≈ 25,00<br>
          2. Wurzel ziehen: r = ${sqrtHtml("25,00")} = <strong>5,0 cm</strong> (Durchmesser d = 10 cm).
        </div>
        <div class="merke">
          <strong>Merke:</strong> <strong>r = ${sqrtHtml("A : π")}</strong>. Niemals direkt √A : π tippen — immer erst A durch π teilen, erst dann die Wurzel ziehen!
        </div>
      `,
      formulas: [
        {
          name: "Radius aus Kreisfläche",
          html: `r = ${sqrtHtml("A : π")}`,
          quantities: "Zuerst A : π, danach die Quadratwurzel ziehen",
        },
      ],
      quiz: {
        question: "In welcher Reihenfolge berechnest du r aus gegebener Kreisfläche A?",
        options: [
          "Erst A durch π teilen, dann aus diesem Wert die Wurzel ziehen",
          "Erst die Wurzel aus A ziehen, dann durch π teilen",
          "A einfach durch 2 · π teilen",
        ],
        correctIndex: 0,
        explanation:
          "Aus A = r² · π folgt durch Teilen durch π erst r² = A : π, und erst am Schluss r = √(A : π).",
      },
      lab: lab(
        "circle-area-sectors",
        "Umkehrung A → r erproben",
        "Suche eine Ziel-Kreisfläche durch Verstellen von r — prüfe anschließend die Probe r = √(A : π).",
        [
          range("r", "Radius r", 1.5, 5, 2.5, 0.5, "cm"),
          range("parts", "Sektoren", 6, 20, 12, 2),
        ],
        [
          output("A", "Fläche A", (v) => PI * v.r * v.r, "cm²", 2, true),
          output("outerSq", "Umquadrat 4r²", (v) => 4 * v.r * v.r, "cm²", 1),
        ],
        [
          {
            id: "find-78-5",
            text: "Triff die Fläche A ≈ 78,54 cm² und prüfe r = 5 cm.",
            check: (v, r) => v.r === 5 && near(Number(r.A), 25 * PI, 0.05),
          },
          {
            id: "find-28-3",
            text: "Erreiche A ≈ 28,27 cm² (welcher Radius gehört dazu?).",
            check: (v, r) => v.r === 3 && near(Number(r.A), 9 * PI, 0.05),
          },
          {
            id: "sectors-16",
            text: "Stelle 16 Sektoren und r = 4 cm ein.",
            check: (v) => v.parts === 16 && v.r === 4,
          },
        ],
      ),
      exercises: [
        {
          id: "find-r-from-area",
          make(rng, level) {
            const r = rng.pick([3, 4, 5, 6, 7, 8, 9, 10]);
            const A = Number((PI * r * r).toFixed(2));
            return task(
              level,
              `Ein Kreis besitzt den Flächeninhalt A = ${fmt(A, 2)} cm². Berechne seinen Radius r.`,
              `Ein Rasensprenger benetzt kreisförmig genau ${fmt(A, 2)} m² Fläche. Wie weit sprüht er vom Mittelpunkt bis zum Rand (Radius r)?`,
              level === 1
                ? [numberField("Radius r =", r, "cm", 1, { absTolerance: 0.08 })]
                : [
                    numberField("Radius r =", r, "m", 1, { absTolerance: 0.08 }),
                    numberField("Durchmesser d =", 2 * r, "m", 1, { absTolerance: 0.15 }),
                  ],
              "r = √(A : π)",
              [
                `r² = ${fmt(A, 2)} : π ≈ ${r * r}`,
                level === 1 ? `r ≈ <strong>${r} cm</strong>` : `r ≈ ${r} m → d ≈ <strong>${2 * r} m</strong>`,
              ],
              { r, A },
            );
          },
        },
        {
          id: "paint-cans-area",
          make(rng, level) {
            const d = rng.pick([4, 6, 8]);
            const r = d / 2;
            const area = Number((PI * r * r).toFixed(2));
            const liters = Number((area * 0.25).toFixed(2));
            return task(
              level,
              `Eine kreisförmige Plattform hat Durchmesser d = ${d} m. Wie viel Farbe (0,25 Liter pro m²) braucht ein Anstrich?`,
              `Eine runde Bühne (d = ${d} m) erhält einen neuen Bodenanstrich. Ein Eimer reicht für genau 4 m² (Verbrauch 0,25 l/m²). Wie viel Liter Farbe werden rechnerisch benötigt?`,
              [numberField("Farbmenge =", liters, "l", 2, { tolerance: 0.01 })],
              "Fläche A = (d : 2)² · π, danach mit 0,25 l/m² malnehmen.",
              [
                `r = ${r} m → A = ${r}² · π ≈ ${fmt(area, 2)} m²`,
                `${fmt(area, 2)} · 0,25 = <strong>${fmt(liters, 2)} l</strong>`,
              ],
              { d, area, liters },
            );
          },
        },
      ],
    }),

    // 4.3 Kreisring & Kreissektor (M-only)
    makeLesson(4, 3, LB, {
      id: "kf-3-kreisring-sektor",
      title: "Kreisring & Kreissektor berechnen",
      subtitle: "Ringe zwischen zwei konzentrischen Kreisen, Sektoren und Umkehraufgaben (M8)",
      tracks: ["M"],
      whyItMatters:
        "Unterlegscheiben, Gehwege um runde Plätze oder Kuchenstücke sind Kreisringe bzw. Kreissektoren — im M-Zug rechnest du sicher in beide Richtungen.",
      explanationHtml: `
        <p>Ein <strong>Kreisring</strong> entsteht, wenn man aus einem großen Kreis (Radius R) einen kleineren inneren Kreis (Radius r) ausschneidet. Ein <strong>Kreissektor</strong> ist ein Kreisausschnitt mit Mittelpunktswinkel μ.</p>
        <div class="example">
          <strong>Beispiel (Kreisring):</strong> R = 5 cm, r = 3 cm:<br>
          A<sub>Ring</sub> = (5² − 3²) · π = (25 − 9) · π = 16 · π ≈ <strong>50,27 cm²</strong>.<br>
          <em>Achtung:</em> Niemals einfach (5 − 3)² · π rechnen!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Kreisring: <strong>A<sub>Ring</sub> = (R² − r²) · π</strong> (erst beide Radien einzeln quadrieren, danach abziehen!). Kreissektor: <strong>A<sub>Sektor</sub> = r² · π · ${frac("μ", "360°")}</strong>.
        </div>
      `,
      formulas: [
        {
          name: "Flächeninhalt eines Kreisrings",
          html: "A<sub>Ring</sub> = R² · π − r² · π = (R² − r²) · π",
          quantities: "R Außenradius, r Innenradius",
        },
        {
          name: "Flächeninhalt eines Kreissektors",
          html: `A<sub>Sektor</sub> = r² · π · ${frac("μ", "360°")}`,
          quantities: "r Radius, μ Mittelpunktswinkel",
        },
      ],
      quiz: {
        question: "Warum darf man beim Kreisring NICHT einfach (R − r)² · π rechnen?",
        options: [
          "Weil (R − r)² etwas ganz anderes ist als R² − r²",
          "Weil man immer r² + R² addieren muss",
          "Weil ein Kreisring kein Pi benötigt",
        ],
        correctIndex: 0,
        explanation:
          "Probe für R = 5, r = 3: R² − r² = 25 − 9 = 16, während (5 − 3)² = 4 wäre — viermal zu klein!",
      },
      lab: lab(
        "annulus-sector",
        "Kreisring & Sektor einstellen",
        "Ziehe den Außenradius R oder begrenze den Sektorwinkel μ unter 360°.",
        [
          range("R", "Außenradius R", 3, 6, 5, 0.5, "cm"),
          range("r", "Innenradius r", 1, 4, 2.5, 0.5, "cm"),
          range("mu", "Sektorwinkel μ", 60, 360, 360, 30, "°"),
        ],
        [
          output(
            "area",
            "Fläche A",
            (v) => {
              const rIn = Math.min(v.r, v.R - 0.5);
              return (v.R * v.R - rIn * rIn) * PI * (v.mu / 360);
            },
            "cm²",
            2,
            true,
          ),
        ],
        [
          {
            id: "ring-5-3",
            text: "Stelle den Vollring R = 5 cm und r = 3 cm ein (A ≈ 50,27 cm²).",
            check: (v, r) => v.R === 5 && v.r === 3 && v.mu === 360 && near(Number(r.area), 16 * PI, 0.05),
          },
          {
            id: "half-ring",
            text: "Halbiere einen Ring (μ = 180°) mit R = 4 cm und r = 2 cm.",
            check: (v) => v.R === 4 && v.r === 2 && v.mu === 180,
          },
          {
            id: "ring-R6-r4",
            text: "Bilde den Vollring R = 6 cm, r = 4 cm (Differenz der Quadrate = 20).",
            check: (v) => v.R === 6 && v.r === 4 && v.mu === 360,
          },
        ],
      ),
      exercises: [
        {
          id: "annulus-area",
          make(rng, level) {
            const rIn = rng.int(2, 6);
            const width = rng.int(2, 4);
            const R = rIn + width;
            const A = Number(((R * R - rIn * rIn) * PI).toFixed(2));
            return task(
              level,
              `Ein Kreisring hat den Außenradius R = ${R} cm und den Innenradius r = ${rIn} cm. Berechne seinen Flächeninhalt.`,
              `Um ein kreisrundes Beet (Radius r = ${rIn} m) wird ein ${width} m breiter Kiesweg (Außenradius R = ${R} m) angelegt. Wie viel m² Kiesfläche entstehen?`,
              [
                numberField("Ringfläche A =", A, level === 1 ? "cm²" : "m²", 2, {
                  tolerance: 0.005,
                  slips: [
                    {
                      value: Number((width * width * PI).toFixed(2)),
                      hint: "Erst jedes Maß für sich quadrieren: (R² − r²) · π, nicht (R − r)² · π!",
                    },
                  ],
                }),
              ],
              "A_Ring = (R² − r²) · π",
              [
                `R² − r² = ${R * R} − ${rIn * rIn} = ${R * R - rIn * rIn}`,
                `A = ${R * R - rIn * rIn} · π = <strong>${fmt(A, 2)} ${level === 1 ? "cm²" : "m²"}</strong>`,
              ],
              { R, rIn, A },
            );
          },
        },
        {
          id: "sector-area-reverse",
          make(rng, level) {
            const r = rng.pick([4, 6, 8, 10]);
            const mu = rng.pick([45, 60, 90, 120, 150]);
            const A = Number((PI * r * r * (mu / 360)).toFixed(2));
            return task(
              level,
              level === 1
                ? `Berechne die Fläche eines Kreissektors mit r = ${r} cm und μ = ${mu}°.`
                : `Ein Kreissektor mit Radius r = ${r} cm hat eine Fläche von A = ${fmt(A, 2)} cm². Wie groß ist sein Mittelpunktswinkel μ?`,
              level === 1
                ? `Ein Rasensprenger bestreicht eine Sektorfläche mit Radius ${r} cm im Winkel ${mu}°. Berechne die überstrichene Sektorfläche.`
                : `Aus einem runden Blech (r = ${r} cm) wird ein Sektor mit Flächeninhalt ${fmt(A, 2)} cm² geschnitten. Wie viel Grad misst sein Mittelpunktswinkel?`,
              level === 1
                ? [numberField("Sektorfläche =", A, "cm²", 2, { tolerance: 0.005 })]
                : [numberField("Winkel μ =", mu, "°", 0, { absTolerance: 0.6 })],
              level === 1 ? "A_Sektor = r² · π · (μ / 360°)" : "μ = (A_Sektor · 360°) : (r² · π)",
              level === 1
                ? [`A = ${r}² · π · ${frac(mu, 360)}`, `<strong>${fmt(A, 2)} cm²</strong>`]
                : [`μ = (${fmt(A, 2)} · 360°) : (${r}² · π)`, `<strong>${mu}°</strong>`],
              { r, mu, A },
            );
          },
        },
      ],
    }),

    // 4.4 Zusammengesetzte Kreisflächen (R + M)
    makeLesson(4, 4, LB, {
      id: "kf-4-zusammengesetzte-kreisflaechen",
      title: "Zusammengesetzte Kreisflächen",
      subtitle: "Zerlegen (Addition) und Ausschneiden (Subtraktion) in Praxisaufgaben",
      tracks: BOTH,
      whyItMatters:
        "Architektur, Gartenbau und Metalltechnik kombinieren ständig Quadrate/Rechtecke mit Halb- oder Viertelkreisen.",
      explanationHtml: `
        <p>Bei zusammengesetzten Flächen entscheidest du zuerst: Werden Kreisteile <strong>hinzugefügt</strong> (Zerlegen &amp; Addieren) oder <strong>ausgestanzt</strong> (Ergänzen &amp; Subtrahieren)?</p>
        <div class="example">
          <strong>Beispiel (Ausschnitt):</strong> Aus einem Quadrat mit Seite a = 10 cm werden an allen 4 Ecken Viertelkreise mit Radius r = 5 cm herausgeschnitten.<br>
          4 Viertelkreise = 1 Vollkreis! Restfläche: 10² − 5² · π = 100 − 78,54 = <strong>21,46 cm²</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Zwei gleiche Halbkreise ergeben einen Vollkreis (A = r² · π), vier gleiche Viertelkreise ebenfalls! Halbiere unbedingt den passenden Durchmesser, um r zu erhalten.
        </div>
      `,
      formulas: [
        {
          name: "Halbkreisfläche",
          html: `A<sub>Halb</sub> = ${frac("r² · π", 2)}`,
          quantities: "Mit r = halber Breite",
        },
      ],
      quiz: {
        question: "Aus einem Quadrat (a = 8 cm) wird mittig der größtmögliche Kreis ausgeschnitten. Welchen Radius hat der Kreis?",
        options: ["r = 4 cm", "r = 8 cm", "r = 2 cm"],
        correctIndex: 0,
        explanation:
          "Der Kreis passt genau in das Quadrat, sein Durchmesser entspricht der Seitenlänge a = 8 cm, also r = 4 cm.",
      },
      lab: lab(
        "composite-circle-area",
        "Quadrat & Kreisteile kombinieren",
        "Wähle zwischen Hinzufügen (Quadrat + Halbkreis) und Ausschneiden (Quadrat minus 4 Viertelkreise).",
        [
          choice("mode", "Bauart", ["Quadrat + Halbkreis", "Quadrat − 4 Viertelkreise"], 0),
          range("a", "Quadratseite a", 4, 8, 6, 1, "cm"),
        ],
        [
          output(
            "area",
            "Rest-/Gesamtfläche",
            (v) => {
              const r = v.a / 2;
              return v.mode === 0 ? v.a * v.a + 0.5 * PI * r * r : v.a * v.a - PI * r * r;
            },
            "cm²",
            2,
            true,
          ),
        ],
        [
          {
            id: "add-semi-a8",
            text: "Quadrat (a = 8 cm) mit angesetztem Halbkreis (A ≈ 89,13 cm²).",
            check: (v, r) => v.mode === 0 && v.a === 8 && near(Number(r.area), 64 + 8 * PI, 0.05),
          },
          {
            id: "cutout-a6",
            text: "Quadrat minus 4 Viertelkreise bei a = 6 cm → Rest ca. 7,73 cm².",
            check: (v, r) => v.mode === 1 && v.a === 6 && near(Number(r.area), 36 - 9 * PI, 0.05),
          },
          {
            id: "cutout-a4",
            text: "Zeige die kleinste Aussparung (a = 4 cm, Modus Ausschneiden).",
            check: (v) => v.mode === 1 && v.a === 4,
          },
        ],
      ),
      exercises: [
        {
          id: "rect-plus-semicircles",
          make(rng, level) {
            const len = rng.pick([6, 8, 10, 12]);
            const d = rng.pick([4, 6, 8]);
            const r = d / 2;
            const total = Number((len * d + PI * r * r).toFixed(2));
            return task(
              level,
              `Ein Rechteck (${len} m × ${d} m) erhält links und rechts je einen Halbkreis (d = ${d} m). Berechne den gesamten Flächeninhalt.`,
              `Eine Eisbahn besteht aus einem Rechteck (${len} m lang, ${d} m breit) und zwei angesetzten Halbkreisen an den Stirnseiten. Wie viel m² Eisfläche müssen gekühlt werden?`,
              [numberField("Gesamtfläche =", total, "m²", 2, { tolerance: 0.005 })],
              "Rechteck l · d + 1 Vollkreis (d : 2)² · π",
              [
                `Rechteck = ${len} · ${d} = ${len * d} m²; Kreis (r = ${r} m) = ${r * r}·π ≈ ${fmt(PI * r * r, 2)} m²`,
                `Gesamt: <strong>${fmt(total, 2)} m²</strong>`,
              ],
              { len, d, total },
            );
          },
        },
        {
          id: "square-minus-circle",
          make(rng, level) {
            const a = rng.pick([6, 8, 10, 12, 14]);
            const r = a / 2;
            const rest = Number((a * a - PI * r * r).toFixed(2));
            return task(
              level,
              `Aus einem quadratischen Blech (a = ${a} cm) wird ein größtmöglicher Kreis (d = ${a} cm) gestanzt. Wie viel Abfallfläche bleibt übrig?`,
              `Aus einer quadratischen Holzplatte (Seitenlänge ${a} cm) sägt ein Schreiner genau einen Viertelkreis an jeder der 4 Ecken weg (Radius jeweils ${r} cm). Welche Holzfläche bleibt in der Mitte stehen?`,
              [numberField("Restfläche =", rest, "cm²", 2, { tolerance: 0.005 })],
              "Quadratfläche a² minus ein ganzer Kreis (a : 2)² · π",
              [
                `Quadrat = ${a * a} cm², Kreis (r = ${r} cm) ≈ ${fmt(PI * r * r, 2)} cm²`,
                `Rest = ${a * a} − ${fmt(PI * r * r, 2)} = <strong>${fmt(rest, 2)} cm²</strong>`,
              ],
              { a, r, rest },
            );
          },
        },
      ],
    }),

    // 4.5 Oberflächeninhalt des Zylinders (R + M)
    makeLesson(4, 5, LB, {
      id: "kf-5-zylinder-oberflaeche",
      title: "Oberflächeninhalt von Zylindern",
      subtitle: "Zwei Kreisflächen plus rechteckige Mantelfläche — auch ohne Deckel",
      tracks: BOTH,
      whyItMatters:
        "Ob Konservendose aus Weißblech oder oben offener Wassertank: Der Materialverbrauch entspricht genau der Oberfläche.",
      explanationHtml: `
        <p>Das aufgeklappte Zylindernetz zeigt alle Außenflächen auf einen Blick: zweimal die kreisförmige Grundfläche G plus einmal das Mantelrechteck M = u · h<sub>k</sub>.</p>
        <div class="example">
          <strong>Beispiel:</strong> r = 4 cm, h<sub>k</sub> = 5 cm:<br>
          G = 4² · π ≈ 50,27 cm² (zweimal: 100,53 cm²)<br>
          M = 2 · π · 4 · 5 = 40 · π ≈ 125,66 cm²<br>
          O = 100,53 + 125,66 = <strong>226,19 cm²</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Geschlossener Zylinder: <strong>O = 2 · G + M = 2 · r² · π + 2 · π · r · h<sub>k</sub></strong>. Fehlt ein Deckel (Becher, Regentonne), rechnet man nur <strong>1 · G + M</strong>!
        </div>
      `,
      formulas: [
        {
          name: "Oberfläche geschlossener Zylinder",
          html: "O = 2 · r² · π + 2 · π · r · h<sub>k</sub>",
          quantities: "2 · G (Boden + Deckel) + M (Mantelfläche)",
        },
        {
          name: "Oben offener Zylinder",
          html: "O<sub>offen</sub> = r² · π + 2 · π · r · h<sub>k</sub>",
          quantities: "Nur eine Grundfläche plus Mantel",
        },
      ],
      quiz: {
        question: "Du willst eine Litfaßsäule nur außen rundherum bekleben (ohne Boden und Dach). Was berechnest du?",
        options: ["Nur die Mantelfläche M = u · hₖ", "Die gesamte Oberfläche 2 · G + M", "Das Volumen V = G · hₖ"],
        correctIndex: 0,
        explanation:
          "Werbefläche ist ausschließlich das gebogene Mantelrechteck M = 2 · π · r · h_k.",
      },
      lab: lab(
        "cylinder-net",
        "Mantel M und Oberfläche O im Netz",
        "Verändere Radius r und Körperhöhe hₖ und sieh dir Boden, Deckel und Mantel im Netz an.",
        [
          choice("fold", "Ansicht", ["Schrägbild", "Netz"], 1),
          range("r", "Radius r", 1.5, 4.5, 2.5, 0.5, "cm"),
          range("hk", "Höhe hₖ", 2, 7, 4, 1, "cm"),
        ],
        [
          output("u", "Umfang u", (v) => 2 * PI * v.r, "cm", 2),
          output("G", "Kreisfläche G", (v) => PI * v.r * v.r, "cm²", 2),
          output("M", "Mantel M", (v) => 2 * PI * v.r * v.hk, "cm²", 2),
          output("O", "Oberfläche O", (v) => 2 * PI * v.r * v.r + 2 * PI * v.r * v.hk, "cm²", 2, true),
        ],
        [
          {
            id: "can-4-5",
            text: "Stelle r = 4 cm und hₖ = 5 cm ein (O ≈ 226,19 cm²).",
            check: (v, r) => v.r === 4 && v.hk === 5 && near(Number(r.O), 72 * PI, 0.08),
          },
          {
            id: "double-h-check",
            text: "Wähle r = 2 cm und hₖ = 6 cm (Verdoppeln von hₖ verdoppelt nur M, nicht 2·G!).",
            check: (v, r) => v.r === 2 && v.hk === 6 && near(Number(r.M), 24 * PI, 0.08),
          },
          {
            id: "3d-view",
            text: "Betrachte deinen Zylinder als 3D-Schrägbild bei r = 3 cm und hₖ = 7 cm.",
            check: (v) => v.fold === 0 && v.r === 3 && v.hk === 7,
          },
        ],
      ),
      exercises: [
        {
          id: "cyl-surface-closed",
          make(rng, level) {
            const r = rng.pick([2, 3, 4, 5]);
            const hk = rng.pick([4, 6, 8, 10]);
            const G = PI * r * r;
            const M = 2 * PI * r * hk;
            const O = Number((2 * G + M).toFixed(2));
            return task(
              level,
              `Berechne die gesamte Oberfläche O eines geschlossenen Zylinders (r = ${r} cm, hₖ = ${hk} cm).`,
              `Eine geschlossene Blechdose hat Radius r = ${r} cm und Höhe ${hk} cm. Wie viel cm² Weißblech sind ohne Falzzugabe mindestens nötig?`,
              [numberField("Oberfläche O =", O, "cm²", 2, { tolerance: 0.005 })],
              "O = 2 · r² · π + 2 · π · r · h_k",
              [
                `2·G ≈ ${fmt(2 * G, 2)} cm², Mantel M ≈ ${fmt(M, 2)} cm²`,
                `O = <strong>${fmt(O, 2)} cm²</strong>`,
              ],
              { r, hk, O },
            );
          },
        },
        {
          id: "cyl-open-bucket",
          make(rng, level) {
            const d = rng.pick([20, 30, 40]);
            const r = d / 2;
            const hk = rng.pick([30, 40, 50]);
            const G = PI * r * r;
            const M = PI * d * hk;
            const Oopen = Number((G + M).toFixed(2));
            return task(
              level,
              `Ein oben offener zylindrischer Eimer hat Durchmesser d = ${d} cm und Höhe ${hk} cm. Berechne die Außenfläche (ohne Deckel).`,
              `Eine zylindrische Regentonne ohne Deckel (d = ${d} cm, hₖ = ${hk} cm) wird außen inklusive Boden neu beschichtet. Wie groß ist die gestrichene Fläche in cm²?`,
              [
                numberField("Fläche O_offen =", Oopen, "cm²", 2, {
                  tolerance: 0.005,
                  slips: [
                    {
                      value: Number((2 * G + M).toFixed(2)),
                      hint: "Der Behälter ist oben offen — die Kreisfläche G zählt nur einmal als Boden!",
                    },
                  ],
                }),
              ],
              "O_offen = r² · π + π · d · h_k",
              [
                `Boden G = ${r}² · π ≈ ${fmt(G, 2)} cm²; Mantel M = π · ${d} · ${hk} ≈ ${fmt(M, 2)} cm²`,
                `Gesamt: <strong>${fmt(Oopen, 2)} cm²</strong>`,
              ],
              { d, r, hk, Oopen },
            );
          },
        },
      ],
    }),
  ],
);
