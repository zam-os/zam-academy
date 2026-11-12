import { choiceField, near, numberField } from "./helpers";
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
import { fmt, frac } from "../exercises/format";

const LB: [number | null, number] = [3, 3];
const PI = 3.141592653589793;

export const STAGE_KREIS = makeStage(
  3,
  "Kreis, Kreisbogen & Zylinder",
  "Kreislinien und Kreiszahl π entdecken, Umfänge berechnen und Zylindernetze sowie Schrägbilder sicher lesen",
  "#0891b2",
  "⭕",
  LB,
  [
    // 3.1 Kreisbegriffe & Kreiszahl π (R + M)
    makeLesson(3, 1, LB, {
      id: "kz-1-kreis-zirkel-pi",
      title: "Kreise, Durchmesser & Kreiszahl π",
      subtitle: "Radius, Durchmesser und das konstante Verhältnis u : d ≈ 3,14",
      tracks: BOTH,
      whyItMatters:
        "Egal ob winzige Münze oder riesiges Riesenrad: Teilt man den Kreisumfang durch seinen Durchmesser, kommt immer dieselbe Zahl π ≈ 3,14 heraus.",
      explanationHtml: `
        <p>Jeder Punkt der <strong>Kreislinie</strong> hat vom Mittelpunkt M denselben Abstand, den <strong>Radius r</strong>. Die längste Sehne durch M heißt <strong>Durchmesser d = 2 · r</strong>. Die gesamte Länge der Kreislinie ist der <strong>Kreisumfang u</strong>.</p>
        <div class="example">
          <strong>Beispiel:</strong> Misst man bei einer Dose d = 10 cm, ist der abgerollte Umfang u ≈ 31,4 cm.<br>
          Quotient: u : d = 31,4 : 10 = <strong>3,14 ≈ π</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> <strong>d = 2 · r</strong>. Bei jedem Kreis gilt u : d = π ≈ 3,14 (Kreiszahl Pi). Zum Zeichnen stichst du den Zirkel fest im Mittelpunkt M ein und stellst die Spanne genau auf r ein!
        </div>
      `,
      formulas: [
        {
          name: "Durchmesser & Radius",
          html: `d = 2 · r &nbsp;·&nbsp; r = ${frac("d", 2)}`,
          quantities: "r Radius, d Durchmesser",
        },
        {
          name: "Kreiszahl π",
          html: `π = ${frac("u", "d")} ≈ 3,14`,
          quantities: "u Kreisumfang, d Durchmesser",
        },
      ],
      quiz: {
        question: "Du verdoppelst den Radius eines Kreises. Was passiert mit dem Quotienten u : d?",
        options: [
          "Er bleibt unverändert bei π ≈ 3,14",
          "Er verdoppelt sich auf etwa 6,28",
          "Er halbiert sich auf 1,57",
        ],
        correctIndex: 0,
        explanation:
          "Wenn sich d verdoppelt, verdoppelt sich auch der Umfang u — ihr Quotient u : d bleibt stets π ≈ 3,14!",
      },
      lab: lab(
        "circle-pi-parts",
        "Umfang abrollen & π entdecken",
        "Ziehe den Radius oder rolle die Kreislinie ab und vergleiche Umfang u mit Durchmesser d.",
        [
          range("r", "Radius r", 1.5, 6, 3, 0.5, "cm"),
          range("roll", "Abrollen", 0, 100, 50, 10, "%"),
        ],
        [
          output("d", "Durchmesser d", (v) => 2 * v.r, "cm", 1),
          output("u", "Umfang u", (v) => 2 * PI * v.r, "cm", 2, true),
        ],
        [
          {
            id: "full-roll-r4",
            text: "Rolle den Kreis zu 100 % ab und stelle r = 4 cm ein (d = 8 cm).",
            check: (v) => v.r === 4 && v.roll === 100,
          },
          {
            id: "diam-10",
            text: "Bringe den Durchmesser auf genau 10 cm (Umfang ca. 31,42 cm).",
            check: (_v, r) => near(Number(r.d), 10, 0.01),
          },
          {
            id: "diam-3",
            text: "Stelle den kleinsten Durchmesser d = 3 cm ein (Umfang ca. 9,42 cm).",
            check: (_v, r) => near(Number(r.d), 3, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "radius-diameter",
          make(rng, level) {
            const r = rng.stepped(2.5, 14.5, 0.5);
            const d = 2 * r;
            return task(
              level,
              level === 1
                ? `Ein Kreis hat den Durchmesser d = ${fmt(d, 1)} cm. Berechne den Radius r für den Zirkel.`
                : `Du sollst ein kreisrundes Logo mit Gesamtdurchmesser d = ${fmt(d, 1)} cm konstruieren. Welche Zirkelspanne musst du am Lineal abnehmen?`,
              `Für ein Ornament mit Durchmesser d = ${fmt(d, 1)} cm stellt man den Zirkel ein. Wie groß ist r?`,
              [
                numberField("Radius r =", r, "cm", 1, {
                  slips: [{ value: d, hint: "Der Zirkel wird immer auf den halben Durchmesser (= Radius r) eingestellt!" }],
                }),
              ],
              "r = d : 2",
              [
                `r = ${fmt(d, 1)} : 2`,
                `<strong>${fmt(r, 1)} cm</strong>`,
              ],
              { r, d },
            );
          },
        },
        {
          id: "pi-quotient-test",
          make(rng, level) {
            const d = rng.pick([4, 5, 6, 8, 10]);
            const u = Number((3.14 * d).toFixed(2));
            return task(
              level,
              `Berechne aus dem Durchmesser d = ${d} cm den Umfang (näherungsweise mit π ≈ 3,14).`,
              `Eine Tischplatte besitzt den Durchmesser d = ${d} dm. Wie viel Dezimeter Umleimerband benötigt man für den äußeren Rand (rechne mit π ≈ 3,14)?`,
              [numberField("Umfang u =", u, level === 1 ? "cm" : "dm", 2)],
              "u = d · π (mit π ≈ 3,14)",
              [
                `u ≈ ${d} · 3,14`,
                `<strong>${fmt(u, 2)} ${level === 1 ? "cm" : "dm"}</strong>`,
              ],
              { d, u },
            );
          },
        },
      ],
    }),

    // 3.2 Kreisumfang & Umkehraufgaben (R + M)
    makeLesson(3, 2, LB, {
      id: "kz-2-kreisumfang-umkehrung",
      title: "Kreisumfang & Umkehraufgaben",
      subtitle: "Umfang mit u = 2·π·r berechnen sowie r und d aus u zurückrechnen",
      tracks: BOTH,
      whyItMatters:
        "Fahrradtachos rechnen über den Radumfang deine Geschwindigkeit aus; Gärtner berechnen Zaunlängen um runde Teiche.",
      explanationHtml: `
        <p>Aus der Definition π = u : d entstehen direkt die zwei Umfänge-Formeln — und durch Umstellen die Umkehrung:</p>
        <div class="example">
          <strong>Beispiel:</strong> Ein runder Baumstamm hat einen Umfang von u = 188,4 cm.<br>
          Durchmesser d = u : π ≈ 188,4 : 3,14 = <strong>60 cm</strong>.<br>
          Radius r = d : 2 = <strong>30 cm</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Vorwärts: <strong>u = π · d = 2 · π · r</strong>. Rückwärts: <strong>d = u : π</strong> und <strong>r = u : (2 · π)</strong>. Bei Sachaufgaben entscheidet sich durch Abwickeln oft auch die Umdrehungszahl!
        </div>
      `,
      formulas: [
        {
          name: "Kreisumfang",
          html: "u = π · d = 2 · π · r",
          quantities: "u Umfang, d Durchmesser, r Radius",
        },
        {
          name: "Umkehrformeln",
          html: `d = ${frac("u", "π")} &nbsp;·&nbsp; r = ${frac("u", "2 · π")}`,
          quantities: "Längen bei gegebenem Umfang u",
        },
      ],
      quiz: {
        question: "Wie erhältst du aus einem gemessenen Kreisumfang u den Radius r?",
        options: ["Durch (2 · π) teilen", "Mit (2 · π) multiplizieren", "Durch 4 teilen"],
        correctIndex: 0,
        explanation: "Aus u = 2 · π · r folgt durch Division: r = u : (2 · π).",
      },
      lab: lab(
        "circle-pi-parts",
        "Umfang und Durchmesser im Vergleich",
        "Verstelle den Radius r (oder ziehe am Kreisrand) und prüfe die Veränderung des Umfangs.",
        [
          range("r", "Radius r", 1.5, 6, 2.5, 0.5, "cm"),
          range("roll", "Abroll-Fortschritt", 0, 100, 100, 10, "%"),
        ],
        [
          output("d", "Durchmesser d", (v) => 2 * v.r, "cm", 1),
          output("u", "Umfang u", (v) => 2 * PI * v.r, "cm", 2, true),
        ],
        [
          {
            id: "double-r",
            text: "Starte bei r = 2,5 cm und verdopple auf r = 5 cm (Umfang verdoppelt sich auf ca. 31,42 cm!).",
            check: (v, r) => v.r === 5 && near(Number(r.u), 10 * PI, 0.05),
          },
          {
            id: "r-6",
            text: "Stelle den maximalen Radius r = 6 cm ein (Umfang ca. 37,70 cm).",
            check: (v) => v.r === 6,
          },
          {
            id: "d-4",
            text: "Wähle d = 4 cm (Radius 2 cm, Umfang ca. 12,57 cm).",
            check: (_v, r) => near(Number(r.d), 4, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "circumference-calc",
          make(rng, level) {
            const r = rng.stepped(2, 12, 0.5);
            const u = Number((2 * PI * r).toFixed(2));
            return task(
              level,
              `Berechne den Umfang u eines Kreises mit dem Radius r = ${fmt(r, 1)} cm (mit π aus dem TR).`,
              `Ein runder Gartenteich hat einen Radius von r = ${fmt(r, 1)} m. Wie viel Meter Zierzaun benötigt man genau um den gesamten Teich?`,
              [numberField("Umfang u =", u, level === 1 ? "cm" : "m", 2, { tolerance: 0.004 })],
              "u = 2 · π · r",
              [
                `u = 2 · π · ${fmt(r, 1)}`,
                `<strong>${fmt(u, 2)} ${level === 1 ? "cm" : "m"}</strong>`,
              ],
              { r, u },
            );
          },
        },
        {
          id: "reverse-radius-from-u",
          make(rng, level) {
            const d = rng.pick([8, 10, 12, 16, 20, 24]);
            const u = Number((PI * d).toFixed(2));
            const r = d / 2;
            return task(
              level,
              `Ein Kreis hat den Umfang u = ${fmt(u, 2)} cm. Berechne seinen Radius r.`,
              `Ein Werkstück-Rohr hat außen gemessen einen Umfang von ${fmt(u, 2)} mm. Welcher Außenradius r ergibt sich (auf 1 Dezimalstelle)?`,
              [numberField("Radius r =", r, level === 1 ? "cm" : "mm", 1, { absTolerance: 0.06 })],
              "Erst d = u : π, dann r = d : 2 (oder sofort u : (2 · π)).",
              [
                `d ≈ ${fmt(u, 2)} : π ≈ ${fmt(d, 1)}`,
                `r = d : 2 ≈ <strong>${fmt(r, 1)} ${level === 1 ? "cm" : "mm"}</strong>`,
              ],
              { d, u, r },
            );
          },
        },
      ],
    }),

    // 3.3 Kreisbogen (M-only)
    makeLesson(3, 3, LB, {
      id: "kz-3-kreisbogen-sektor",
      title: "Mittelpunktswinkel & Kreisbogen",
      subtitle: "Teile des Kreisumfangs mit μ/360° exakt berechnen und umkehren (M8)",
      tracks: ["M"],
      whyItMatters:
        "Straßenkurven, Uhrzeiger-Wege oder gewölbte Bauteile sind keine ganzen Kreise, sondern Kreisbögen mit einem bestimmten Mittelpunktswinkel μ.",
      explanationHtml: `
        <p>Ein <strong>Kreisbogen b</strong> ist ein Teil der Kreislinie zum Mittelpunktswinkel μ (gesprochen: mü). Weil der Vollkreis 360° besitzt, bildet der Bogen genau den Bruchteil ${frac("μ", "360°")} des ganzen Umfangs.</p>
        <div class="example">
          <strong>Beispiel:</strong> r = 6 cm und μ = 60° (genau ein Sechstel des Kreises):<br>
          b = 2 · π · 6 · ${frac(60, 360)} = 2 · π · 6 : 6 = 2 · π ≈ <strong>6,28 cm</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> <strong>b = 2 · π · r · ${frac("μ", "360°")}</strong>. Bei Umkehraufgaben stellst du nach μ um: <strong>μ = (b · 360°) : (2 · π · r)</strong>.
        </div>
      `,
      formulas: [
        {
          name: "Länge des Kreisbogens b",
          html: `b = 2 · π · r · ${frac("μ", "360°")}`,
          quantities: "r Radius, μ Mittelpunktswinkel in Grad",
        },
        {
          name: "Winkel aus Bogenlänge",
          html: `μ = ${frac("b · 360°", "2 · π · r")}`,
          quantities: "Umkehrformel für den Mittelpunktswinkel",
        },
      ],
      quiz: {
        question: "Welchen Bruchteil des vollen Kreisumfangs bildet ein Kreisbogen mit μ = 90°?",
        options: ["Genau ein Viertel (¼ · u)", "Genau ein Drittel (⅓ · u)", "Genau ein Achtel (⅛ · u)"],
        correctIndex: 0,
        explanation: "90° : 360° = 1/4, also ein Viertelkreis!",
      },
      lab: lab(
        "circle-arc",
        "Kreisbogen b nach Winkel μ einstellen",
        "Ziehe am Winkelpunkt oder nutze den Regler μ und beobachte Bogenlänge b und Sektorfläche.",
        [
          range("r", "Radius r", 2, 6, 4, 0.5, "cm"),
          range("mu", "Winkel μ", 30, 330, 90, 15, "°"),
        ],
        [
          output("b", "Kreisbogen b", (v) => 2 * PI * v.r * (v.mu / 360), "cm", 2, true),
          output("aSek", "Sektorfläche", (v) => PI * v.r * v.r * (v.mu / 360), "cm²", 2),
        ],
        [
          {
            id: "half-circle",
            text: "Stelle einen Halbkreis ein (μ = 180° bei r = 4 cm).",
            check: (v) => v.mu === 180 && v.r === 4,
          },
          {
            id: "quarter-r6",
            text: "Erreiche mit Viertelkreis (μ = 90°) und r = 6 cm einen Bogen b ≈ 9,42 cm.",
            check: (v, r) => v.mu === 90 && v.r === 6 && near(Number(r.b), 3 * PI, 0.05),
          },
          {
            id: "mu-120",
            text: "Stelle genau ein Drittelkreis ein (μ = 120°).",
            check: (v) => v.mu === 120,
          },
        ],
      ),
      exercises: [
        {
          id: "arc-length",
          make(rng, level) {
            const r = rng.pick([4, 6, 8, 9, 10, 12]);
            const mu = rng.pick([45, 60, 72, 90, 120, 135, 150]);
            const b = Number((2 * PI * r * (mu / 360)).toFixed(2));
            return task(
              level,
              `Berechne die Bogenlänge b bei r = ${r} cm und einem Mittelpunktswinkel μ = ${mu}°.`,
              `Der große Zeiger einer Bahnhofsuhr ist ${r} dm lang. Wie viel Dezimeter legt seine Spitze bei einer Drehung um ${mu}° zurück?`,
              [numberField("Bogenlänge b =", b, level === 1 ? "cm" : "dm", 2, { tolerance: 0.005 })],
              "b = 2 · π · r · (μ / 360°)",
              [
                `b = 2 · π · ${r} · ${frac(mu, 360)}`,
                `<strong>${fmt(b, 2)} ${level === 1 ? "cm" : "dm"}</strong>`,
              ],
              { r, mu, b },
            );
          },
        },
        {
          id: "arc-reverse-angle",
          make(rng, level) {
            const r = rng.pick([6, 8, 9, 12]);
            const mu = rng.pick([45, 60, 90, 120, 150, 180]);
            const b = Number((2 * PI * r * (mu / 360)).toFixed(2));
            return task(
              level,
              `Ein Kreisbogen bei Radius r = ${r} cm misst b = ${fmt(b, 2)} cm. Wie groß ist der Mittelpunktswinkel μ?`,
              `Ein geschwungener Torbogen mit Radius r = ${r} m hat eine Bogenlänge von ${fmt(b, 2)} m. Welcher Mittelpunktswinkel μ gehört dazu (ganze Grad)?`,
              [numberField("Winkel μ =", mu, "°", 0, { absTolerance: 0.6 })],
              "μ = (b · 360°) : (2 · π · r)",
              [
                `μ = (${fmt(b, 2)} · 360°) : (2 · π · ${r})`,
                `<strong>${mu}°</strong>`,
              ],
              { r, mu, b },
            );
          },
        },
      ],
    }),

    // 3.4 Zusammengesetzte Umfänge (R + M)
    makeLesson(3, 4, LB, {
      id: "kz-4-zusammengesetzte-umfaenge",
      title: "Zusammengesetzte Umfänge mit Kreisteilen",
      subtitle: "Halbkreise, Viertelkreise und gerade Außenkanten richtig addieren",
      tracks: BOTH,
      whyItMatters:
        "Laufbahnen im Stadion, Torbögen oder abgerundete Tischplatten kombinieren gerade Kanten mit Halb- oder Viertelkreisen.",
      explanationHtml: `
        <p>Der <strong>Umfang u</strong> ist immer nur die äußerste „Zaunlinie“ rund um die fertige Figur — innere Trennlinien zwischen Rechteck und Halbkreis gehören <em>nicht</em> zum Umfang!</p>
        <div class="example">
          <strong>Beispiel (Sportplatz-Stadion):</strong> Zwei gerade Bahnen je 8 m lang plus zwei Halbkreise (b = 4 m breit → d = 4 m):<br>
          Zwei gleiche Halbkreise bilden zusammen einen vollen Kreis: u<sub>Kreis</sub> = π · 4 ≈ 12,57 m.<br>
          Gesamtumfang: 2 · 8 m + 12,57 m = <strong>28,57 m</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Immer nur außen entlangfahren! <strong>2 Halbkreise = 1 Vollkreis</strong>, <strong>1 Halbkreis = ½ · π · d</strong>, <strong>1 Viertelkreis = ¼ · 2 · π · r</strong>. Innen liegende gestrichelte Linien niemals mitzählen!
        </div>
      `,
      formulas: [
        {
          name: "Halbkreisbogen (ohne Durchmesser!)",
          html: `b<sub>Halb</sub> = ${frac("π · d", 2)} = π · r`,
          quantities: "Reine Bogenlänge ohne die gerade Grundlinie",
        },
        {
          name: "Viertelkreisbogen",
          html: `b<sub>Viertel</sub> = ${frac("π · r", 2)}`,
          quantities: "Viertel eines Vollkreises",
        },
      ],
      quiz: {
        question: "Zwei gegenüberliegende Seiten eines Rechtecks werden durch Halbkreise ersetzt (Stadionbahn). Wie rechnest du den Umfang?",
        options: [
          "2 · gerade Länge + 1 voller Kreisumfang (π · d)",
          "Rechteckumfang komplett + 1 voller Kreisumfang",
          "2 · gerade Länge + 2 · Durchmesser",
        ],
        correctIndex: 0,
        explanation:
          "Die beiden inneren Breiten (Durchmesser) liegen im Inneren der Figur und fallen beim Außenumfang weg!",
      },
      lab: lab(
        "composite-perimeter",
        "Stadionbahn & Bogenfenster umlaufen",
        "Verändere Länge und Breite und schalte zwischen Stadion (2 Halbkreise) und Torbogen (1 Halbkreis) um.",
        [
          choice("mode", "Figur", ["Stadion (2 Halbkreise)", "Torbogen (1 Halbkreis)"], 0),
          range("a", "Gerade Länge l", 3, 9, 6, 1, "cm"),
          range("b", "Breite / Durchm. d", 2, 6, 4, 1, "cm"),
        ],
        [
          output(
            "u",
            "Gesamtumfang u",
            (v) => (v.mode === 0 ? 2 * v.a + PI * v.b : 2 * v.a + v.b + 0.5 * PI * v.b),
            "cm",
            2,
            true,
          ),
          output(
            "area",
            "Fläche (Ausblick)",
            (v) => {
              const r = v.b / 2;
              return v.mode === 0 ? v.a * v.b + PI * r * r : v.a * v.b + 0.5 * PI * r * r;
            },
            "cm²",
            2,
          ),
        ],
        [
          {
            id: "stadium-l8-d4",
            text: "Stelle ein Stadion mit l = 8 cm und d = 4 cm ein (u ≈ 28,57 cm).",
            check: (v, r) => v.mode === 0 && v.a === 8 && v.b === 4 && near(Number(r.u), 16 + 4 * PI, 0.05),
          },
          {
            id: "arch-l5-d4",
            text: "Wechsle zum Torbogen (1 Halbkreis) mit l = 5 cm und d = 4 cm.",
            check: (v) => v.mode === 1 && v.a === 5 && v.b === 4,
          },
          {
            id: "d6-circle",
            text: "Wähle beim Stadion d = 6 cm und l = 4 cm.",
            check: (v) => v.mode === 0 && v.a === 4 && v.b === 6,
          },
        ],
      ),
      exercises: [
        {
          id: "stadium-perimeter",
          make(rng, level) {
            const len = rng.int(40, 90);
            const d = rng.pick([20, 30, 40, 50]);
            const u = Number((2 * len + PI * d).toFixed(2));
            return task(
              level,
              `Ein Stadionfeld besteht aus zwei ${len} m langen Geraden und zwei Halbkreisen mit Durchmesser d = ${d} m. Berechne die Rundenlänge.`,
              `Die Laufbahn um einen Schul-Sportplatz besteht aus zwei Geraden à ${len} m und zwei angesetzten Halbkreisen (Breite d = ${d} m). Wie viel Meter misst eine volle Runde?`,
              [
                numberField("Umfang u =", u, "m", 2, {
                  tolerance: 0.005,
                  slips: [
                    {
                      value: Number((2 * len + 2 * d + PI * d).toFixed(2)),
                      hint: "Die beiden Durchmesser liegen im Inneren des Feldes — beim Umfang darf man sie nicht mitaddieren!",
                    },
                  ],
                }),
              ],
              "u = 2 · Gerade + π · d (2 Halbkreise = 1 Vollkreis)",
              [
                `Geraden: 2 · ${len} = ${2 * len} m; Vollkreis: π · ${d} ≈ ${fmt(PI * d, 2)} m`,
                `Gesamtumfang: <strong>${fmt(u, 2)} m</strong>`,
              ],
              { len, d, u },
            );
          },
        },
        {
          id: "quarter-corner-perimeter",
          make(rng, level) {
            const r = rng.pick([4, 6, 8, 10]);
            // Viertelkreis (90°-Sektor): Umfang = 2·r + (π·r)/2
            const arc = (PI * r) / 2;
            const u = Number((2 * r + arc).toFixed(2));
            return task(
              level,
              `Ein Viertelkreis-Tortenstück hat den Radius r = ${r} cm. Berechne seinen gesamten Außenumfang (zwei Radien plus Viertelbogen).`,
              `Eine viertelkreisförmige Eckterrasse mit Radius r = ${r} m soll ringsum (beide geraden Hausseiten plus runde Außenkante) mit Randsteinen eingefasst werden. Gesamtlänge?`,
              [
                numberField("Umfang u =", u, level === 1 ? "cm" : "m", 2, {
                  tolerance: 0.005,
                  slips: [
                    {
                      value: Number(arc.toFixed(2)),
                      hint: "Vergiss neben dem Viertelbogen nicht die beiden geraden Radien links und unten (+ 2·r)!",
                    },
                  ],
                }),
              ],
              "u_Viertel = 2 · r + ¼ · 2 · π · r",
              [
                `Viertelbogen = ½ · π · ${r} ≈ ${fmt(arc, 2)}; gerade Seiten = 2 · ${r} = ${2 * r}`,
                `Summe: <strong>${fmt(u, 2)} ${level === 1 ? "cm" : "m"}</strong>`,
              ],
              { r, u },
            );
          },
        },
      ],
    }),

    // 3.5 Zylinder: Eigenschaften, Netze & Schrägbilder (R + M)
    makeLesson(3, 5, LB, {
      id: "kz-5-zylinder-netze-schraegbild",
      title: "Zylinder: Eigenschaften, Netz & Schrägbild",
      subtitle: "Grundfläche, Mantelrechteck und fehlende Stücke im Netz prüfen",
      tracks: BOTH,
      whyItMatters:
        "Konservendosen, Rohre, Litfaßsäulen und Rundtanks sind Zylinder — beim Herstellen aus Blech oder Karton braucht man das flache Netz.",
      explanationHtml: `
        <p>Ein <strong>gerader Kreiszylinder</strong> besitzt zwei deckungsgleiche, parallele Kreise als Grund- und Deckfläche sowie eine gekrümmte Mantelfläche. Klappt man den Mantel flach auseinander, entsteht ein <strong>Rechteck</strong>!</p>
        <div class="example">
          <strong>Beispiel:</strong> Eine Dose hat Radius r = 3 cm und Höhe h<sub>k</sub> = 8 cm.<br>
          Die Breite des Mantelrechtecks muss exakt so lang sein wie der Umfang des Kreises:<br>
          u = 2 · π · 3 cm ≈ <strong>18,85 cm</strong> (Höhe = 8 cm).
        </div>
        <div class="merke">
          <strong>Merke:</strong> Ein Zylindernetz ist nur fehlerfrei, wenn die beiden Kreise auf entgegengesetzten Seiten des Mantelrechtecks liegen <em>und</em> die Rechtecksbreite exakt gleich <strong>u = 2 · π · r</strong> ist!
        </div>
      `,
      formulas: [
        {
          name: "Abmessungen des Mantelrechtecks",
          html: "Länge b = u = 2 · π · r &nbsp;·&nbsp; Breite = h<sub>k</sub>",
          quantities: "Nur dann rollt sich der Mantel nahtlos um den Kreis",
        },
      ],
      quiz: {
        question: "Welche Breite muss das Mantelrechteck im Netz eines Zylinders mit d = 10 cm besitzen?",
        options: ["u = π · 10 ≈ 31,42 cm", "Genau d = 10 cm", "Genau r = 5 cm"],
        correctIndex: 0,
        explanation:
          "Der Mantel legt sich genau einmal um die komplette Kreislinie herum — also muss seine Länge dem Kreisumfang u = π · d entsprechen!",
      },
      lab: lab(
        "cylinder-net",
        "Schrägbild & Zylindernetz aufklappen",
        "Schalte zwischen Schrägbild und aufgeklapptem Netz um und prüfe die Abmessungen des Mantels.",
        [
          choice("fold", "Ansicht", ["Schrägbild", "Netz"], 0),
          range("r", "Radius r", 1.5, 4.5, 3, 0.5, "cm"),
          range("hk", "Körperhöhe hₖ", 2, 7, 4, 1, "cm"),
        ],
        [
          output("u", "Mantelbreite u", (v) => 2 * PI * v.r, "cm", 2, true),
          output("G", "Grundfläche G", (v) => PI * v.r * v.r, "cm²", 2),
          output("M", "Mantelfläche M", (v) => 2 * PI * v.r * v.hk, "cm²", 2),
          output("O", "Oberfläche O", (v) => 2 * PI * v.r * v.r + 2 * PI * v.r * v.hk, "cm²", 2),
        ],
        [
          {
            id: "unfold-net",
            text: "Klappe das Zylindernetz bei r = 3 cm und hₖ = 5 cm auf.",
            check: (v) => v.fold === 1 && v.r === 3 && v.hk === 5,
          },
          {
            id: "match-width-25",
            text: "Finde r = 4 cm im Netz (Mantelbreite u ≈ 25,13 cm).",
            check: (v, r) => v.fold === 1 && v.r === 4 && near(Number(r.u), 8 * PI, 0.05),
          },
          {
            id: "tall-cyl",
            text: "Zeige im Schrägbild einen hohen Zylinder mit hₖ = 7 cm und r = 2 cm.",
            check: (v) => v.fold === 0 && v.r === 2 && v.hk === 7,
          },
        ],
      ),
      exercises: [
        {
          id: "net-rect-width",
          make(rng, level) {
            const d = rng.pick([6, 8, 10, 12, 14]);
            const u = Number((PI * d).toFixed(2));
            return task(
              level,
              `Für ein Zylindernetz (Durchmesser d = ${d} cm) wird ein Mantelrechteck benötigt. Wie lang muss das Rechteck sein?`,
              `Eine Klebedose hat Durchmesser d = ${d} cm und wird außen mit einem Papierstreifen genau einmal umwickelt. Wie lang muss der Papierstreifen geschnitten werden?`,
              [numberField("Mantelbreite =", u, "cm", 2, { tolerance: 0.005 })],
              "Breite des Mantels = Kreisumfang u = π · d",
              [
                `u = π · ${d}`,
                `<strong>${fmt(u, 2)} cm</strong>`,
              ],
              { d, u },
            );
          },
        },
        {
          id: "spot-net-error",
          make(rng, level) {
            const r = rng.pick([3, 4, 5]);
            const u = Number((2 * PI * r).toFixed(1));
            const wrong = Number((2 * r).toFixed(1));
            const scenarios = [
              {
                text: `Ein Netz besitzt r = ${r} cm, aber ein Mantelrechteck der Breite ${fmt(wrong, 1)} cm (statt ${fmt(u, 1)} cm). Warum passt es nicht?`,
                correct: 0,
              },
              {
                text: `Im Zylindernetz liegen beide Grundkreise auf derselben Längsseite des Mantelrechtecks direkt nebeneinander. Warum geht das schief?`,
                correct: 1,
              },
            ];
            const s = rng.pick(scenarios);
            return task(
              level,
              s.text,
              `Beim Kontrollieren eines Werkstück-Netzes (r = ${r} cm) fällt dir ein Konstruktionsfehler auf: ${s.text}`,
              [
                choiceField(
                  "Begründung",
                  [
                    `Der Mantel ist viel zu schmal (${fmt(wrong, 1)} cm statt u ≈ ${fmt(u, 1)} cm) und lässt einen Spalt`,
                    "Die beiden Kreise liegen auf derselben Seite und würden beim Falten übereinanderklappen",
                    "Ein Zylindernetz braucht statt Kreisen immer zwei Sechsecke",
                  ],
                  s.correct,
                ),
              ],
              "Prüfe Lage der Kreise (gegenüber!) und Breite des Mantels (= u).",
              [
                s.correct === 0
                  ? `Der Umfang u ≈ ${fmt(u, 1)} cm passt nicht zur Rechteckbreite ${fmt(wrong, 1)} cm.`
                  : "Grund- und Deckfläche müssen sich gegenüberliegen.",
                `<strong>Fehler sauber erkannt.</strong>`,
              ],
              { r, u, s: s.correct },
            );
          },
        },
      ],
    }),
  ],
);
