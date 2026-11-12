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

const LB = [4, 4] as [number, number];

export const STAGE_FLAECHEN = makeStage(
  4,
  "Flächeninhalt & Oberfläche",
  "Parallelogramme, Dreiecke, (M7: Trapeze, Drachen, Rauten), zusammengesetzte Flächen und Prismenoberfläche",
  "#ea580c",
  "▱",
  LB,
  [
    makeLesson(4, 1, LB, {
      id: "fl-1-parallelogramm",
      title: "Parallelogramm: Zerlegung & Flächeninhalt",
      subtitle: "Aus dem flächengleichen Rechteck die Formel A = g · h herleiten und umkehren",
      tracks: BOTH,
      whyItMatters:
        "Schräge Parkplätze, Treppengeländer-Füllungen und Dachflächen sind oft Parallelogramme — mit Grundseite und Höhe rechnest du sie wie ein Rechteck.",
      explanationHtml: `
        <p>Schneidest du beim Parallelogramm entlang der <strong>Höhe h</strong> ein Dreieck ab und schiebst es auf die andere Seite, entsteht ein <strong>Rechteck mit gleichem Flächeninhalt</strong>!</p>
        <div class="example">
          <strong>Beispiel:</strong> Ein Parallelogramm hat Grundseite g = 6,5 cm und die zugehörige Höhe h = 4 cm (die schräge Seite s = 5 cm wird <em>nicht</em> multipliziert!).<br>
          • Flächeninhalt: A = g · h = 6,5 cm · 4 cm = <strong>26 cm²</strong><br>
          • Umkehrung (h gesucht bei A = 36 cm², g = 9 cm): h = A : g = 36 : 9 = <strong>4 cm</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Immer Grundseite <strong>g</strong> mal zugehörige senkrechte Höhe <strong>h</strong> — niemals mit der schrägen Seitenlänge multiplizieren!
        </div>
      `,
      formulas: [
        {
          name: "Parallelogramm-Fläche",
          html: `A = g · h<sub>g</sub>`,
          quantities: "g Grundseite, h_g senkrechte Höhe dazu",
        },
      ],
      quiz: {
        question:
          "Ein Parallelogramm hat g = 8 cm, schräge Seite b = 5 cm und Höhe h = 4 cm. Wie groß ist der Flächeninhalt?",
        options: ["32 cm²", "40 cm²", "26 cm²"],
        correctIndex: 0,
        explanation:
          "Man multipliziert Grundseite g mit der senkrechten Höhe h: 8 cm · 4 cm = 32 cm². Die schräge Seite 5 cm braucht man dafür nicht.",
      },
      lab: lab(
        "parallelogram-area",
        "Parallelogramm → Rechteck",
        "Ziehe den Schieberegler ‚Dreieck verschieben‘ auf 100 % und beobachte, wie ein Rechteck entsteht.",
        [
          range("g", "Grundseite g", 3, 9, 6, 0.5, "cm"),
          range("h", "Höhe h", 2, 5.5, 4, 0.5, "cm"),
          range("shift", "Neigung", 0.5, 4, 2, 0.5, "cm"),
          range("cut", "Dreieck verschieben", 0, 100, 0, 10, "%"),
        ],
        [
          output("area", "Flächeninhalt A", (v) => v.g * v.h, "cm²", 1, true),
        ],
        [
          {
            id: "slide-100",
            text: "Verwandle das Parallelogramm vollständig ins Rechteck (100 %).",
            check: (v) => v.cut === 100,
          },
          {
            id: "area-30",
            text: "Stelle g = 7,5 cm ein und erreiche genau A = 30 cm².",
            check: (v, r) => v.g === 7.5 && near(Number(r.area), 30, 0.01),
          },
          {
            id: "shear-same",
            text: "Verändere nur die Neigung (z. B. 4 cm) bei g = 6 cm, h = 4 cm — A bleibt 24 cm²!",
            check: (v, r) => v.shift === 4 && v.g === 6 && v.h === 4 && near(Number(r.area), 24, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "para-area-calc",
          make(rng, level) {
            const g = rng.stepped(4, 12, 0.5);
            const h = rng.stepped(3, 8, 0.5);
            const slant = Number((h + rng.stepped(1, 2.5, 0.5)).toFixed(1));
            const area = Number((g * h).toFixed(2));
            return task(
              level,
              `Parallelogramm: g = ${fmt(g, 1)} cm, Höhe h = ${fmt(h, 1)} cm (Seitenlänge b = ${fmt(slant, 1)} cm). Berechne A.`,
              `Ein schräger Parkplatz hat die Breite ${fmt(g, 1)} m, eine senkrechte Tiefe von ${fmt(h, 1)} m und eine seitliche Bordsteinkante von ${fmt(slant, 1)} m. Wie viele Quadratmeter wird gepflastert?`,
              [numberField("A =", area, level === 1 ? "cm²" : "m²", 2, {
                slips: [{ value: Number((g * slant).toFixed(2)), hint: "Nimm nicht die schräge Kante, sondern die senkrechte Höhe h!" }],
              })],
              "Flächeninhalt = Grundseite · senkrechte Höhe (A = g · h).",
              [
                `A = ${fmt(g, 1)} · ${fmt(h, 1)}`,
                `<strong>${fmt(area, 2)}</strong>`,
              ],
              { g, h, slant, area },
            );
          },
        },
        {
          id: "para-reverse-h",
          make(rng, level) {
            const g = rng.stepped(4, 12, 0.5);
            const h = rng.stepped(2.5, 7, 0.5);
            const area = Number((g * h).toFixed(2));
            return task(
              level,
              `Umkehraufgabe: A = ${fmt(area, 2)} cm², g = ${fmt(g, 1)} cm. Berechne die Höhe h.`,
              `Ein Werbe-Banner in Parallelogrammform hat ${fmt(area, 2)} m² Fläche und eine untere Kante von ${fmt(g, 1)} m. Wie hoch ist es senkrecht gemessen?`,
              [numberField("h =", h, level === 1 ? "cm" : "m", 1)],
              "Teile den Flächeninhalt durch die Grundseite: h = A : g.",
              [
                `h = ${fmt(area, 2)} : ${fmt(g, 1)}`,
                `<strong>${fmt(h, 1)}</strong>`,
              ],
              { g, h, area },
            );
          },
        },
      ],
    }),

    makeLesson(4, 2, LB, {
      id: "fl-2-dreieck",
      title: "Dreieck: Flächeninhalt & Umkehraufgaben",
      subtitle: "Dreiecke zum Parallelogramm verdoppeln und Höhe/Grundseite rückwärts bestimmen",
      tracks: BOTH,
      whyItMatters:
        "Hausgiebel, Segel und Flurstücke sind dreieckig. Weil jedes Dreieck ein halbes Parallelogramm ist, gilt A = (g · h) : 2.",
      explanationHtml: `
        <p>Legt man zwei deckungsgleiche Dreiecke an einer Seite zusammen, entsteht genau ein <strong>Parallelogramm</strong> mit demselben g und h. Darum hat ein Dreieck genau den <strong>halben Flächeninhalt</strong>!</p>
        <div class="example">
          <strong>Beispiel:</strong><br>
          • <em>Fläche gesucht:</em> g = 9 cm, h = 6 cm → A = ${frac("9 · 6", 2)} = <strong>27 cm²</strong>.<br>
          • <em>Umkehrung (h gesucht bei A = 20 cm², g = 8 cm):</em> Erst verdoppeln (2 · 20 = 40), dann teilen: h = 40 : 8 = <strong>5 cm</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> A = ${frac("g · h", 2)}. Bei der Umkehrung immer zuerst <strong>A verdoppeln (2 · A)</strong>, bevor du durch g oder h teilst!
        </div>
      `,
      formulas: [
        {
          name: "Dreiecksfläche",
          html: `A = ${frac("g · h", 2)}`,
          quantities: "g Grundseite, h senkrechte Höhe auf g",
        },
        {
          name: "Höhe umkehren",
          html: `h = ${frac("2 · A", "g")}`,
          quantities: "A Flächeninhalt, g Grundseite",
        },
      ],
      quiz: {
        question: "Die Spitze C eines Dreiecks wandert parallel zur Grundseite AB. Was passiert mit dem Flächeninhalt?",
        options: [
          "Er bleibt genau gleich, weil g und h unverändert sind.",
          "Er wird größer, je schräger das Dreieck wird.",
          "Er halbiert sich bei schiefen Dreiecken.",
        ],
        correctIndex: 0,
        explanation:
          "Solange die Höhe h und Grundseite g gleich bleiben, bleibt auch (g · h) : 2 konstant!",
      },
      lab: lab(
        "triangle-area",
        "Dreieck verdoppeln",
        "Verdopple das Dreieck zum Parallelogramm und verschiebe die Spitze C waagrecht.",
        [
          range("g", "Grundseite g", 3, 9, 6, 0.5, "cm"),
          range("h", "Höhe h", 2, 5.5, 4, 0.5, "cm"),
          range("cx", "Spitze C (x)", -2, 6, 2, 0.5),
          range("double", "Verdoppeln", 0, 100, 0, 25, "%"),
        ],
        [
          output("area", "Dreiecksfläche A", (v) => (v.g * v.h) / 2, "cm²", 1, true),
        ],
        [
          {
            id: "dbl-para",
            text: "Verdopple das Dreieck komplett (100 %) zum Parallelogramm.",
            check: (v) => v.double === 100,
          },
          {
            id: "tri-18",
            text: "Erreiche genau A = 18 cm² mit Grundseite g = 8 cm.",
            check: (v, r) => v.g === 8 && near(Number(r.area), 18, 0.01),
          },
          {
            id: "shear-same-tri",
            text: "Verschiebe die Spitze C ganz nach links (x = −2) und halte h = 4 cm, g = 6 cm (A = 12 cm²).",
            check: (v, r) => v.cx === -2 && v.g === 6 && v.h === 4 && near(Number(r.area), 12, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "tri-area-basic",
          make(rng, level) {
            const g = rng.stepped(4, 14, 0.5);
            const h = rng.stepped(3, 10, 0.5);
            const area = Number(((g * h) / 2).toFixed(2));
            return task(
              level,
              `Berechne den Flächeninhalt des Dreiecks mit g = ${fmt(g, 1)} cm und h = ${fmt(h, 1)} cm.`,
              `Ein dreieckiges Sonnensegel hat eine Basis von ${fmt(g, 1)} m und steht ${fmt(h, 1)} m hoch ab. Wie viel Quadratmeter Stoff hat das Segel?`,
              [numberField("A =", area, level === 1 ? "cm²" : "m²", 2, {
                slips: [{ value: Number((g * h).toFixed(2)), hint: "Vergiss nicht, durch 2 zu teilen!" }],
              })],
              "Dreieck = (Grundseite · Höhe) : 2.",
              [
                `A = (${fmt(g, 1)} · ${fmt(h, 1)}) : 2`,
                `<strong>${fmt(area, 2)}</strong>`,
              ],
              { g, h, area },
            );
          },
        },
        {
          id: "tri-reverse-g",
          make(rng, level) {
            const g = rng.int(4, 15);
            const h = rng.int(4, 12);
            const area = (g * h) / 2;
            return task(
              level,
              `Umkehraufgabe: Dreieck mit A = ${fmt(area, 1)} cm² und h = ${h} cm. Wie lang ist die Grundseite g?`,
              `Ein dreieckiger Giebel hat ${fmt(area, 1)} m² Fläche und ist ${h} m hoch. Wie breit ist das Haus unter dem Giebel?`,
              [numberField("g =", g, level === 1 ? "cm" : "m", 1, {
                slips: [{ value: area / h, hint: "Erst 2 · A rechnen, dann durch h teilen!" }],
              })],
              "Erst den Flächeninhalt verdoppeln: g = (2 · A) : h.",
              [
                `g = (2 · ${fmt(area, 1)}) : ${h} = ${fmt(2 * area, 1)} : ${h}`,
                `<strong>${g}</strong>`,
              ],
              { g, h, area },
            );
          },
        },
      ],
    }),

    makeLesson(4, 3, LB, {
      id: "fl-3-zusammengesetzte-flaechen",
      title: "Zusammengesetzte Flächen berechnen",
      subtitle: "Vielecke zerlegen oder ergänzen und Teilflächen geschickt addieren",
      tracks: BOTH,
      whyItMatters:
        "Zimmer, Hauswände und Werkstücke sind selten reine Rechtecke — wer geschickt zerlegt, berechnet auch komplexe Formen exakt.",
      explanationHtml: `
        <p>Bei <strong>zusammengesetzten Figuren</strong> führst du die Form auf bekannte Teilflächen (Rechteck, Dreieck, Parallelogramm) zurück:</p>
        <div class="example">
          <strong>Beispiel (Hauswand):</strong> Unten ein Rechteck (8 m × 3 m = 24 m²), darüber ein dreieckiger Giebel (g = 8 m, h₂ = 2 m → ${frac("8 · 2", 2)} = 8 m²).<br>
          Gesamtfläche: A<sub>ges</sub> = 24 m² + 8 m² = <strong>32 m²</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Zerlege die Figur (Addition der Teilflächen) oder ergänze ein großes Rechteck und ziehe fehlende Ausschnitte ab!
        </div>
      `,
      formulas: [
        {
          name: "Zerlegungsprinzip",
          html: `A<sub>ges</sub> = A₁ + A₂ + …  &nbsp;oder&nbsp;  A<sub>Außen</sub> − A<sub>Lücke</sub>`,
          quantities: "Flächeninhalte in gleicher Einheit",
        },
      ],
      quiz: {
        question: "Eine Figur besteht aus einem 6 cm × 4 cm Rechteck und einem aufgesetzten Dreieck gleicher Breite mit Höhe 3 cm. Wie groß ist die Gesamtfläche?",
        options: ["33 cm²", "42 cm²", "24 cm²"],
        correctIndex: 0,
        explanation:
          "Rechteck: 6 · 4 = 24 cm². Dreieck: (6 · 3) : 2 = 9 cm². Zusammen: 24 + 9 = 33 cm².",
      },
      lab: lab(
        "composite-area",
        "Hauswand-Zerleger",
        "Ziehe an der Dachspitze oder verändere Breite und Wandhöhe.",
        [
          range("w", "Breite g", 4, 10, 8, 1, "m"),
          range("h1", "Wandhöhe h₁", 2, 5, 3, 1, "m"),
          range("h2", "Giebelhöhe h₂", 1, 4, 2, 1, "m"),
        ],
        [
          output("total", "Gesamtfläche", (v) => v.w * v.h1 + (v.w * v.h2) / 2, "m²", 1, true),
        ],
        [
          {
            id: "house-36",
            text: "Stelle w = 8 m, h₁ = 3 m und h₂ = 3 m ein und lies 36 m² ab.",
            check: (v, r) => v.w === 8 && v.h1 === 3 && v.h2 === 3 && near(Number(r.total), 36, 0.01),
          },
          {
            id: "house-equal",
            text: "Mache die Giebel-Dreiecksfläche halb so groß wie die Rechteckfläche (h₂ = h₁).",
            check: (v) => v.h2 === v.h1 && v.w >= 4,
          },
          {
            id: "house-45",
            text: "Erreiche genau 45 m² Gesamtfläche.",
            check: (_v, r) => near(Number(r.total), 45, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "gable-wall",
          make(rng, level) {
            const w = rng.int(5, 12);
            const h1 = rng.int(2, 5);
            const h2 = rng.int(2, 4);
            const total = w * h1 + (w * h2) / 2;
            return task(
              level,
              `Zusammengesetzte Fläche: Rechteck (${w} m × ${h1} m) + Dreieck (g = ${w} m, h = ${h2} m).`,
              `Eine Giebelfassade besteht aus einer ${w} m breiten und ${h1} m hohen Rechteckwand sowie einem ${h2} m hohen dreieckigen Dachgiebel. Wie viele Quadratmeter müssen gestrichen werden?`,
              [numberField("A =", total, "m²", 1)],
              "Berechne Rechteckfläche + Dreiecksfläche getrennt und addiere.",
              [
                `Rechteck: ${w} · ${h1} = ${w * h1} m²`,
                `Dreieck: (${w} · ${h2}) : 2 = ${fmt((w * h2) / 2, 1)} m²`,
                `<strong>${fmt(total, 1)} m²</strong>`,
              ],
              { w, h1, h2, total },
            );
          },
        },
        {
          id: "rect-cutout",
          make(rng, level) {
            const W = rng.int(8, 14);
            const H = rng.int(6, 10);
            const cW = rng.int(2, 4);
            const cH = rng.int(2, 4);
            const area = W * H - cW * cH;
            return task(
              level,
              `Ergänzungsverfahren: Großes Rechteck ${W} m × ${H} m mit einem ausgesparten Rechteck-Eck (${cW} m × ${cH} m).`,
              `Aus einer ${W} m × ${H} m großen Blechplatte wird an einer Ecke ein ${cW} m × ${cH} m großes Stück herausgeschnitten. Wie groß ist die verbleibende Fläche?`,
              [numberField("A =", area, "m²", 0)],
              "Große Fläche minus ausgeschnittene Lücke.",
              [
                `${W} · ${H} − ${cW} · ${cH} = ${W * H} − ${cW * cH}`,
                `<strong>${area} m²</strong>`,
              ],
              { W, H, cW, cH, area },
            );
          },
        },
      ],
    }),

    makeLesson(4, 4, [null, 4], {
      id: "fl-4-trapez-drache-raute",
      title: "Trapez, Drachenviereck & Raute",
      subtitle: "Bestimmungsgrößen erkennen, zeichnen, Fläche herleiten und Umkehraufgaben lösen",
      tracks: ["M"],
      whyItMatters:
        "Trapezförmige Tische, rautenförmige Fliesen oder Drachen gehören zum M-Zug-Stoff und begegnen dir später in Abschlussprüfungen regelmäßig.",
      explanationHtml: `
        <p>Auch spezielle Vierecke lassen sich leicht auf Rechtecke und Dreiecke zurückführen:</p>
        <div class="example">
          <strong>Die Formeln im Überblick:</strong><br>
          • <strong>Trapez</strong> (parallele Seiten a ∥ c, Höhe h): A = ${frac("a + c", 2)} · h<br>
          <em>Beispiel:</em> a = 9 cm, c = 5 cm, h = 4 cm → A = ${frac("9 + 5", 2)} · 4 = 7 · 4 = <strong>28 cm²</strong>.<br>
          • <strong>Drachenviereck &amp; Raute</strong> (senkrechte Diagonalen e ⊥ f): A = ${frac("e · f", 2)}<br>
          <em>Beispiel:</em> e = 8 cm, f = 5 cm → A = ${frac("8 · 5", 2)} = <strong>20 cm²</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Beim Trapez addierst du die beiden parallelen Seiten a und c zuerst! Bei Raute und Drachen stehen die Diagonalen senkrecht aufeinander (e · f : 2).
        </div>
      `,
      formulas: [
        {
          name: "Trapez-Fläche",
          html: `A = ${frac("a + c", 2)} · h`,
          quantities: "a, c parallele Seiten, h Abstand (Höhe)",
        },
        {
          name: "Drachenviereck & Raute",
          html: `A = ${frac("e · f", 2)}`,
          quantities: "e, f senkrecht aufeinander stehende Diagonalen",
        },
      ],
      quiz: {
        question: "Warum darf man beim Trapez nicht einfach nur a · h rechnen?",
        options: [
          "Weil die parallelen Seiten a und c unterschiedlich lang sind — man braucht ihren Mittelwert (a + c) : 2.",
          "Weil Trapeze keine rechten Winkel für die Höhe besitzen.",
          "Weil die schrägen Seiten länger sind.",
        ],
        correctIndex: 0,
        explanation:
          "Zwei umgedrehte Trapeze ergeben ein Parallelogramm der Länge (a + c). Daher ist ein Trapez (a + c) · h : 2.",
      },
      lab: lab(
        "quad-special-area",
        "Trapez, Drache & Raute",
        "Wähle das Viereck und beobachte Parallelen oder Diagonalen sowie den Flächeninhalt.",
        [
          choice("kind", "Viereck", ["Trapez", "Drachenviereck", "Raute"], 0),
          range("a", "Seite a / Diagonale e", 4, 10, 8, 1, "cm"),
          range("c", "Seite c (Trapez) / f (Raute)", 2, 8, 4, 1, "cm"),
          range("h", "Höhe h / Diagonale f", 2, 6, 4, 1, "cm"),
        ],
        [
          output(
            "area",
            "Flächeninhalt A",
            (v) =>
              v.kind === 0
                ? ((v.a + v.c) / 2) * v.h
                : (v.a * (v.kind === 2 ? v.c : v.h)) / 2,
            "cm²",
            1,
            true,
          ),
        ],
        [
          {
            id: "trap-30",
            text: "Berechne im Trapez (a = 9, c = 6, h = 4) genau A = 30 cm².",
            check: (v, r) => v.kind === 0 && v.a === 9 && v.c === 6 && v.h === 4 && near(Number(r.area), 30, 0.01),
          },
          {
            id: "kite-24",
            text: "Stelle beim Drachenviereck Diagonalen mit A = 24 cm² ein.",
            check: (v, r) => v.kind === 1 && near(Number(r.area), 24, 0.01),
          },
          {
            id: "rhombus-16",
            text: "Wähle Raute und stelle e = 8 cm, f = 4 cm (A = 16 cm²) ein.",
            check: (v, r) => v.kind === 2 && v.a === 8 && v.c === 4 && near(Number(r.area), 16, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "trapezoid-calc",
          make(rng, level) {
            const a = rng.int(6, 12);
            const c = rng.int(3, a - 1);
            const h = rng.int(3, 8);
            const area = ((a + c) / 2) * h;
            return task(
              level,
              `Trapez: parallele Seiten a = ${a} cm und c = ${c} cm, Höhe h = ${h} cm. Berechne A.`,
              `Ein trapezförmiges Grundstück ist vorn ${a} m breit, hinten (parallel dazu) ${c} m und ${h} m tief. Wie viele Quadratmeter umfasst es?`,
              [numberField("A =", area, level === 1 ? "cm²" : "m²", 1)],
              "A = ((a + c) : 2) · h.",
              [
                `Mittellinie = (${a} + ${c}) : 2 = ${fmt((a + c) / 2, 1)}`,
                `A = ${fmt((a + c) / 2, 1)} · ${h} = <strong>${fmt(area, 1)}</strong>`,
              ],
              { a, c, h, area },
            );
          },
        },
        {
          id: "kite-reverse",
          make(rng, level) {
            const e = rng.int(4, 12);
            const f = rng.int(4, 10);
            const area = (e * f) / 2;
            return task(
              level,
              `Drachenviereck: A = ${fmt(area, 1)} cm² und eine Diagonale e = ${e} cm. Wie lang ist f?`,
              `Ein Papierdrachen hat ${fmt(area, 1)} dm² Fläche. Die Längsstrebe e misst ${e} dm. Wie lang muss die Querstrebe f sein?`,
              [numberField("f =", f, level === 1 ? "cm" : "dm", 1)],
              "Wie beim Dreieck zuerst verdoppeln: f = (2 · A) : e.",
              [
                `f = (2 · ${fmt(area, 1)}) : ${e} = ${fmt(2 * area, 1)} : ${e}`,
                `<strong>${f}</strong>`,
              ],
              { e, f, area },
            );
          },
        },
      ],
    }),

    makeLesson(4, 5, LB, {
      id: "fl-5-prismen-oberflaeche",
      title: "Oberflächeninhalt gerader Prismen",
      subtitle: "Grundflächen und Mantelrechtecke am Netz addieren (R7: Dreieckprisma; M7: alle Prismen)",
      tracks: BOTH,
      whyItMatters:
        "Wie viel Geschenkpapier, Lack oder Blech brauchst du für einen Körper? Genau so viel wie sein Oberflächeninhalt O.",
      explanationHtml: `
        <p>Der <strong>Oberflächeninhalt O</strong> eines geraden Prismas ist die Summe aller Außenflächen aus dem Netz:</p>
        <ul>
          <li><strong>2 · Grundfläche G</strong> (unten und oben)</li>
          <li><strong>Mantel M</strong> (alle Rechtecks-Seitenflächen zusammen ergeben ein großes Rechteck: <strong>M = u · h<sub>k</sub></strong>)</li>
        </ul>
        <div class="example">
          <strong>Beispiel 1 (Dreiecksprisma):</strong> Rechtwinkliges Dreieck mit Katheten 3 cm und 4 cm, dritte Seite 5 cm, Körperhöhe h<sub>k</sub> = 6 cm:<br>
          • Grundfläche G = ${frac("3 · 4", 2)} = 6 cm² → 2 · G = 12 cm²<br>
          • Grundflächenumfang u = 3 + 4 + 5 = 12 cm → M = 12 cm · 6 cm = 72 cm²<br>
          • Oberfläche O = 12 cm² + 72 cm² = <strong>84 cm²</strong>.
        </div>
        <div class="example">
          <strong>Beispiel 2 (Zusammengesetzter Körper):</strong> Auf einen Quader (O<sub>1</sub> = 52 cm²) wird ein kleinerer Quader (O<sub>2</sub> = 32 cm²) so aufgesetzt, dass sie sich an einer Rechteckfläche A<sub>Kontakt</sub> = 6 cm² berühren:<br>
          • Diese Kontaktfläche verschwindet bei <em>beiden</em> Körpern im Inneren → O<sub>ges</sub> = 52 + 32 − 2 · 6 = <strong>72 cm²</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Beim einzelnen Prisma gilt <strong>O = 2 · G + M</strong> mit <strong>M = u · h<sub>k</sub></strong>. Bei zusammengesetzten Körpern ziehst du verdeckte Klebe-/Kontaktflächen doppelt ab: <strong>O<sub>ges</sub> = O<sub>1</sub> + O<sub>2</sub> − 2 · A<sub>Kontakt</sub></strong>!
        </div>
      `,
      formulas: [
        {
          name: "Oberflächeninhalt Prisma",
          html: `O = 2 · G + M  &nbsp;mit&nbsp;  M = u · h<sub>k</sub>`,
          quantities: "G Grundfläche, u Grundflächenumfang, hₖ Körperhöhe",
        },
        {
          name: "Zusammengesetzte Körper (Oberfläche)",
          html: `O<sub>ges</sub> = O<sub>1</sub> + O<sub>2</sub> − 2 · A<sub>Kontakt</sub>`,
          quantities: "O₁, O₂ Teiloberflächen, A_Kontakt verdeckte Berührungsfläche",
        },
      ],
      quiz: {
        question: "Warum rechnet man beim Oberflächeninhalt O = 2 · G + u · hₖ und nicht G + u · hₖ?",
        options: [
          "Weil jedes geschlossene Prisma sowohl eine Grundfläche unten als auch eine gleich große Deckfläche oben besitzt.",
          "Weil der Mantel immer doppelt gezählt wird.",
          "Weil Grundfläche und Umfang dasselbe sind.",
        ],
        correctIndex: 0,
        explanation:
          "Deckfläche und Grundfläche sind gleich groß (2 · G). Dazu kommt außen herum das Mantelband mit M = u · hₖ.",
      },
      lab: lab(
        "prism-surface",
        "Prisma-Oberfläche am Netz",
        "Klappe das Prisma ins Netz und sieh, wie sich 2·G und der Mantel M = u·hₖ zusammensetzen.",
        [
          choice("shape", "Grundfläche", ["Gleichschenkliges Dreieck", "Rechteck (Quader)"], 0),
          range("g", "Basis g", 4, 8, 6, 1, "cm"),
          range("h", "Grundflächenhöhe h", 3, 6, 4, 1, "cm"),
          range("hk", "Körperhöhe hₖ", 3, 8, 5, 1, "cm"),
          choice("fold", "Ansicht", ["Schrägbild", "Netz"], 0),
        ],
        [
          output("G", "Grundfläche G", (v) => (v.shape === 0 ? (v.g * v.h) / 2 : v.g * v.h), "cm²", 1),
          output(
            "O",
            "Oberfläche O",
            (v) => {
              const G = v.shape === 0 ? (v.g * v.h) / 2 : v.g * v.h;
              const leg = Math.hypot(v.g / 2, v.h);
              const u = v.shape === 0 ? v.g + 2 * leg : 2 * (v.g + v.h);
              return 2 * G + u * v.hk;
            },
            "cm²",
            1,
            true,
          ),
        ],
        [
          {
            id: "net-tri-345",
            text: "Klappe beim Dreiecksprisma das Netz auf und wähle g = 6 cm, h = 4 cm, hₖ = 5 cm (Schenkel = 5 cm → u = 16 cm).",
            check: (v) => v.shape === 0 && v.fold === 1 && v.g === 6 && v.h === 4 && v.hk === 5,
          },
          {
            id: "quad-O",
            text: "Stelle ein Rechteckprisma mit 4 cm × 3 cm Grundfläche und hₖ = 6 cm ein (O = 108 cm²).",
            check: (v, r) => v.shape === 1 && v.g === 4 && v.h === 3 && v.hk === 6 && near(Number(r.O), 108, 0.01),
          },
          {
            id: "double-hk",
            text: "Verdopple hₖ bei festem g und h — vergleiche den Anstieg des Mantels.",
            check: (v) => v.hk === 8 && v.fold === 1,
          },
        ],
      ),
      exercises: [
        {
          id: "tri-prism-surface",
          make(rng, level) {
            const k = rng.pick([1, 2]);
            const a = 3 * k;
            const b = 4 * k;
            const c = 5 * k;
            const hk = rng.int(4, 10);
            const G = (a * b) / 2;
            const u = a + b + c;
            const M = u * hk;
            const O = 2 * G + M;
            return task(
              level,
              `Gerades Dreiecksprisma (rechtwinklige Grundfläche mit Katheten ${a} cm, ${b} cm, Hypotenuse ${c} cm), hₖ = ${hk} cm. Berechne die Oberfläche O.`,
              `Ein Zelt hat einen dreieckigen Eingang (Seiten ${a} m, ${b} m, ${c} m; rechter Winkel zwischen ${a} m und ${b} m) und ist ${hk} m lang (inkl. Boden plane rundum geschlossen). Wie viele Quadratmeter Zeltplane sind insgesamt nötig?`,
              [numberField("O =", O, level === 1 ? "cm²" : "m²", 1, {
                slips: [{ value: G + M, hint: "Vorne und hinten sind ZWEI Dreiecksflächen (2 · G)!" }],
              })],
              "Rechne O = 2 · G + u · hₖ.",
              [
                `G = (${a} · ${b}) : 2 = ${fmt(G, 1)} → 2 · G = ${fmt(2 * G, 1)}`,
                `M = (${a} + ${b} + ${c}) · ${hk} = ${u} · ${hk} = ${M}`,
                `O = ${fmt(2 * G, 1)} + ${M} = <strong>${fmt(O, 1)}</strong>`,
              ],
              { G, u, M, O },
            );
          },
        },
        {
          id: "rect-prism-surface",
          make(rng, level) {
            const a = rng.int(3, 8);
            const b = rng.int(2, 6);
            const hk = rng.int(4, 9);
            const G = a * b;
            const u = 2 * (a + b);
            const O = 2 * G + u * hk;
            return task(
              level,
              `Gerades Prisma mit rechteckiger Grundfläche (${a} cm × ${b} cm) und Körperhöhe hₖ = ${hk} cm. Berechne O.`,
              `Eine Geschenkbox (Quader) misst ${a} dm × ${b} dm und ist ${hk} dm hoch. Wie groß ist ihre gesamte Außenoberfläche?`,
              [numberField("O =", O, level === 1 ? "cm²" : "dm²", 0)],
              "G = a · b und u = 2 · (a + b), dann O = 2 · G + u · hₖ.",
              [
                `2 · G = 2 · (${a} · ${b}) = ${2 * G}`,
                `M = 2 · (${a} + ${b}) · ${hk} = ${u * hk}`,
                `O = ${2 * G} + ${u * hk} = <strong>${O}</strong>`,
              ],
              { G, u, O },
            );
          },
        },
        {
          id: "composite-prism-surface",
          make(rng, level) {
            if (level === 1) {
              const a1 = rng.int(5, 8);
              const b = rng.int(3, 5);
              const h1 = rng.int(3, 5);
              const a2 = rng.int(2, a1 - 1);
              const h2 = rng.int(2, 4);
              const O1 = 2 * (a1 * b + a1 * h1 + b * h1);
              const O2 = 2 * (a2 * b + a2 * h2 + b * h2);
              const aKontakt = a2 * b;
              const Oges = O1 + O2 - 2 * aKontakt;
              return task(
                level,
                `Zwei Quader stehen passgenau aufeinander: Unten ${a1} cm × ${b} cm × ${h1} cm, oben darauf mittig ${a2} cm × ${b} cm × ${h2} cm (Kontaktfläche A = ${a2} cm · ${b} cm). Berechne O_ges.`,
                "",
                [
                  numberField("O_ges =", Oges, "cm²", 0, {
                    slips: [
                      {
                        value: O1 + O2,
                        hint: "Die verdeckte Kontaktfläche A zwischen beiden Quadern gehört nicht nach außen — ziehe 2 · A ab!",
                      },
                      {
                        value: O1 + O2 - aKontakt,
                        hint: "Die Kontaktfläche fehlt bei BEIDEN Teilkörpern — du musst 2 · A_Kontakt abziehen!",
                      },
                    ],
                  }),
                ],
                "Rechne O_ges = O₁ + O₂ − 2 · A_Kontakt.",
                [
                  `O₁ = 2 · (${a1}·${b} + ${a1}·${h1} + ${b}·${h1}) = ${O1} cm²`,
                  `O₂ = 2 · (${a2}·${b} + ${a2}·${h2} + ${b}·${h2}) = ${O2} cm²`,
                  `A_Kontakt = ${a2} · ${b} = ${aKontakt} cm² → O_ges = ${O1} + ${O2} − 2 · ${aKontakt} = <strong>${Oges} cm²</strong>`,
                ],
                { O1, O2, aKontakt, Oges },
              );
            }
            const use6 = rng.next() < 0.5;
            const a = use6 ? 6 : 8;
            const hD = use6 ? 4 : 3;
            const leg = 5;
            const b = rng.int(5, 10);
            const h1 = rng.int(3, 6);
            const O1 = 2 * (a * b + a * h1 + b * h1);
            const gRoof = (a * hD) / 2;
            const O2 = 2 * gRoof + (a + 2 * leg) * b;
            const aKontakt = a * b;
            const Oges = O1 + O2 - 2 * aKontakt;
            return task(
              level,
              "",
              `Ein Spielhaus besteht aus einem Quader-Unterbau (${a} dm breit, ${b} dm tief, ${h1} dm hoch) und einem aufgesetzten Satteldach-Dreiecksprisma (Giebelbreite ${a} dm, Giebelhöhe ${hD} dm, Dachschräge je ${leg} dm, Tiefe ${b} dm). Wie viel dm² Außenfläche (inkl. Boden) müssen gestrichen werden?`,
              [
                numberField("O_ges =", Oges, "dm²", 0, {
                  slips: [
                    {
                      value: O1 + O2,
                      hint: "Zwischen Quader und Dach liegt die verdeckte Kontaktfläche A = a · b — ziehe 2 · A_Kontakt ab!",
                    },
                    {
                      value: O1 + O2 - aKontakt,
                      hint: "Du hast die verdeckte Decken-/Dachbodenfläche nur einmal abgezogen. Ziehe 2 · A_Kontakt ab!",
                    },
                  ],
                }),
              ],
              "Berechne die Teiloberflächen O₁ (Quader) und O₂ (Dreiecksprisma) und ziehe 2 · A_Kontakt ab.",
              [
                `Quader O₁ = 2 · (${a}·${b} + ${a}·${h1} + ${b}·${h1}) = ${O1} dm²`,
                `Dach O₂ = 2 · (${a}·${hD} : 2) + (${a} + ${leg} + ${leg}) · ${b} = ${O2} dm²`,
                `Kontaktfläche A = ${a} · ${b} = ${aKontakt} dm² → O_ges = ${O1} + ${O2} − 2 · ${aKontakt} = <strong>${Oges} dm²</strong>`,
              ],
              { O1, O2, aKontakt, Oges },
            );
          },
        },
      ],
    }),
  ],
);
