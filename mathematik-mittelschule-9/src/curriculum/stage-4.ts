import { fmt, fmtUnit, round } from "../exercises/format";
import { compositeArea, regularPolygon } from "../models";
import { BOTH, choice, lab, M_ONLY, makeLesson, makeStage, output as o, range as r, task } from "./builders";
import { numberField as num } from "./helpers";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(4, content);
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (near(value, round(value, digits)) ? "=" : "≈");
const NAMES_N: Record<number, string> = { 5: "Fünfeck", 6: "Sechseck", 8: "Achteck", 10: "Zehneck", 12: "Zwölfeck" };

// 4.1 Flächeninhalt regelmäßiger Vielecke ──────────────────────────────────

const vieleckFlaeche = L({
  id: "fl-1-vielecke-flaeche",
  title: "Flächeninhalt regelmäßiger Vielecke",
  subtitle: "n gleiche Dreiecke: A = n · s · h : 2",
  tracks: BOTH,
  whyItMatters:
    "Sechseckige Pflastersteine, ein achteckiger Pavillon, eine Tischplatte als Zwölfeck: Ihre Fläche bestimmst du, indem du das Vieleck in gleiche Dreiecke zerlegst. Dafür brauchst du nur die Dreiecksformel.",
  explanationHtml: `
    <p>Ein regelmäßiges n-Eck lässt sich vom Mittelpunkt M aus in n deckungsgleiche, gleichschenklige <strong>Bestimmungsdreiecke</strong> zerlegen. Jedes hat die Grundseite s und die Höhe h vom Mittelpunkt bis zur Mitte der Seite.</p>
    <p>Ein Dreieck hat den Flächeninhalt s · h : 2. Das ganze Vieleck hat also:</p>
    <p class="formula-line">A = n · s · h : 2</p>
    <p>Legt man die n Dreiecke abwechselnd nach oben und unten nebeneinander, entsteht fast ein Parallelogramm mit der Länge n · s : 2 = u : 2 und der Höhe h. So sieht man: A = u · h : 2.</p>
    <p>Ist statt h der Abstand r vom Mittelpunkt zu einer Ecke bekannt, hilft Pythagoras: Im halben Bestimmungsdreieck gilt h = √(r² − (s : 2)²).</p>
    <div class="example"><strong>Beispiel:</strong> Regelmäßiges Sechseck mit s = 4 cm und h ≈ 3,46 cm: A = 6 · 4 · 3,46 : 2 ≈ 41,52 cm².<br>
    Achteck mit s = 5 cm und r = 6,53 cm: h = √(6,53² − 2,5²) = √(42,64 − 6,25) ≈ 6,03 cm, A = 8 · 5 · 6,03 : 2 ≈ 120,6 cm².</div>
    <div class="merke"><strong>Merke:</strong> Regelmäßiges n-Eck: A = n · s · h : 2 = u · h : 2. Fehlt h, berechne es mit Pythagoras aus r und s : 2.</div>
  `,
  formulas: [
    { name: "Regelmäßiges n-Eck", html: "A = n · s · h : 2 = u · h : 2", quantities: "s Seite, h Höhe des Bestimmungsdreiecks, u Umfang" },
    { name: "Höhe aus dem Umkreisradius", html: "h = √(r² − (s : 2)²)", quantities: "r Abstand vom Mittelpunkt zu einer Ecke" },
  ],
  quiz: {
    question: "Ein regelmäßiges Fünfeck hat s = 6 cm und h = 4,1 cm. Wie groß ist sein Flächeninhalt?",
    options: ["61,5 cm²", "123 cm²", "12,3 cm²", "24,6 cm²"],
    correctIndex: 0,
    explanation: "Ein Bestimmungsdreieck: 6 · 4,1 : 2 = 12,3 cm². Fünf davon: 5 · 12,3 cm² = 61,5 cm². 123 cm² wären es ohne das Teilen durch 2.",
  },
  lab: lab(
    "polygon-area",
    "Vom Vieleck zum Band",
    "Links ist das Vieleck in Bestimmungsdreiecke zerlegt, rechts liegen dieselben Dreiecke in einer Reihe. Sie bilden fast ein Parallelogramm aus halbem Umfang und Höhe h.",
    [r("n", "Anzahl der Ecken n", 3, 12, 5, 1), r("s", "Seitenlänge s", 1, 6, 2, 0.5, "cm")],
    [
      o("h", "Höhe h eines Dreiecks", (v) => regularPolygon(v.n, v.s).apothem, "cm", 2),
      o("dreieck", "ein Dreieck s · h : 2", (v) => (v.s * regularPolygon(v.n, v.s).apothem) / 2, "cm²", 2),
      o("A", "Flächeninhalt A", (v) => (v.n * v.s * regularPolygon(v.n, v.s).apothem) / 2, "cm²", 2, true),
    ],
    [
      { id: "wabe", text: "Stelle eine Bienenwabe ein: ein Sechseck mit s = 4 cm.", check: (v) => v.n === 6 && v.s === 4 },
      { id: "hundert", text: "Erzeuge ein Vieleck mit einem Flächeninhalt zwischen 100 cm² und 110 cm².", check: (v) => { const A = (v.n * v.s * regularPolygon(v.n, v.s).apothem) / 2; return A >= 100 && A <= 110; } },
      { id: "quadrat", text: "Prüfe am Quadrat mit s = 3 cm: Die vier Dreiecke ergeben zusammen genau a² = 9 cm².", check: (v) => v.n === 4 && v.s === 3 },
    ],
  ),
  exercises: [
    {
      id: "flaeche",
      make: (rng, level) => {
        const n = rng.pick([5, 6, 8, 10, 12]);
        const s = rng.int(4, 20) / 2;
        const p = regularPolygon(n, s);
        if (level === 1) {
          const h = round(p.apothem, 2);
          const tri = (s * h) / 2;
          return task(
            level,
            `Ein regelmäßiges ${NAMES_N[n]} hat die Seitenlänge s = ${fmtUnit(s, "cm")}. Die Höhe eines Bestimmungsdreiecks ist h = ${fmtUnit(h, "cm")}. Berechne den Flächeninhalt eines Bestimmungsdreiecks und des ganzen ${NAMES_N[n]}s.`,
            [num("Dreieck:", tri, "cm²", 2, { slips: [{ value: s * h, hint: "Ein Dreieck ist die Hälfte des Rechtecks s · h." }] }), num("A =", n * tri, "cm²", 2, { slips: [{ value: n * s * h, hint: "Vergiss das Teilen durch 2 nicht: A = n · s · h : 2." }, { value: tri, hint: "Das ist nur ein Dreieck. Das Vieleck hat n davon." }] })],
            "Ein Dreieck: s · h : 2. Das Vieleck: n Dreiecke.",
            [`ein Dreieck: ${fmt(s)} · ${fmt(h)} : 2 ${eq(tri)} ${fmt(tri, 2)} cm²`, `${n} Dreiecke: ${n} · ${fmt(tri, 2)} cm²`],
            `A ${eq(n * tri)} ${fmtUnit(n * tri, "cm²")}`,
            { n, s },
            [`n = ${n}`, `s = ${fmtUnit(s, "cm")}`, `h = ${fmtUnit(h, "cm")}`],
          );
        }
        const rr = round(p.radius, 2);
        const h = Math.sqrt(rr * rr - (s / 2) ** 2);
        const A = (n * s * h) / 2;
        return task(
          level,
          `Eine Terrassenplatte hat die Form eines regelmäßigen ${NAMES_N[n]}s mit der Seitenlänge ${fmtUnit(s, "dm")}. Von der Mitte bis zu jeder Ecke sind es ${fmtUnit(rr, "dm")}. Wie groß ist die Höhe eines Bestimmungsdreiecks, und wie groß ist die Platte?`,
          [num("h =", h, "dm", 2, { slips: [{ value: Math.hypot(rr, s / 2), hint: "r ist die längste Seite im halben Bestimmungsdreieck: h = √(r² − (s : 2)²)." }] }), num("A =", A, "dm²", 2, { absTolerance: ((n * s) / 2) * 0.006, slips: [{ value: n * s * rr / 2, hint: "Rechne mit der Höhe h, nicht mit dem Abstand zur Ecke." }] })],
          "Halbes Bestimmungsdreieck: Hypotenuse r, Katheten h und s : 2. Dann A = n · s · h : 2.",
          [`h = √(${fmt(rr)}² − ${fmt(s / 2)}²) ${eq(h)} ${fmtUnit(h, "dm")}`, `A = ${n} · ${fmt(s)} · ${fmt(h, 2)} : 2`],
          `h ${eq(h)} ${fmtUnit(h, "dm")}, A ${eq(A)} ${fmtUnit(A, "dm²")}`,
          { n, s },
        );
      },
    },
    {
      id: "fliesen",
      make: (rng, level) => {
        const s = rng.pick([10, 12, 15, 20]);
        const h = round(regularPolygon(6, s).apothem, 1);
        const tile = (6 * s * h) / 2;
        if (level === 1) {
          const count = rng.int(10, 40);
          return task(
            level,
            `Eine sechseckige Fliese hat s = ${s} cm und h = ${fmtUnit(h, "cm")}. Berechne den Flächeninhalt einer Fliese und von ${count} Fliesen.`,
            [num("eine Fliese:", tile, "cm²", 2), num(`${count} Fliesen:`, count * tile, "cm²", 2)],
            "A = 6 · s · h : 2 für eine Fliese, dann mal die Anzahl.",
            [`6 · ${s} · ${fmt(h)} : 2 = ${fmt(tile, 2)} cm²`, `${count} · ${fmt(tile, 2)} cm²`],
            `${fmtUnit(tile, "cm²")} und ${fmtUnit(count * tile, "cm²")}`,
            { s, count },
            [`s = ${s} cm`, `h = ${fmtUnit(h, "cm")}`],
          );
        }
        const area = rng.pick([2, 3, 4, 5, 6]);
        const needed = Math.ceil((area * 10000) / tile);
        return task(
          level,
          `Ein Fliesenleger verlegt sechseckige Fliesen mit s = ${s} cm und h = ${fmtUnit(h, "cm")} auf ${area} m². Wie groß ist eine Fliese? Wie viele Fliesen braucht er mindestens (ohne Verschnitt)?`,
          [num("eine Fliese:", tile, "cm²", 2), num("Anzahl:", needed, "", 0, { slips: [{ value: Math.floor((area * 10000) / tile), hint: "Abgerundet reicht es nicht ganz: Runde auf die nächste ganze Fliese auf." }, { value: Math.ceil((area * 100) / tile), hint: "1 m² sind 10.000 cm², nicht 100 cm²." }] })],
          "Fläche einer Fliese mit A = 6 · s · h : 2. Dann m² in cm² umrechnen (1 m² = 10.000 cm²), teilen und aufrunden.",
          [`eine Fliese: 6 · ${s} · ${fmt(h)} : 2 = ${fmt(tile, 2)} cm²`, `${area} m² = ${fmt(area * 10000)} cm²`, `${fmt(area * 10000)} : ${fmt(tile, 2)} ≈ ${fmt((area * 10000) / tile, 2)}, aufgerundet`],
          `${fmtUnit(tile, "cm²")}; mindestens ${needed} Fliesen`,
          { s, area },
        );
      },
    },
  ],
});

// 4.2 Zusammengesetzte Figuren ─────────────────────────────────────────────

const zusammengesetzt = L({
  id: "fl-2-zusammengesetzte-figuren",
  title: "Zusammengesetzte Figuren",
  subtitle: "Zerlegen oder ergänzen",
  tracks: BOTH,
  whyItMatters:
    "Maler, Fliesenleger und Gärtner berechnen selten ein einfaches Rechteck. Eine Giebelwand mit Fenster oder ein L-förmiger Raum wird in bekannte Teilfiguren zerlegt oder zu einer großen Figur ergänzt.",
  explanationHtml: `
    <p>Für komplexe Figuren gibt es zwei Wege:</p>
    <ul>
      <li><strong>Zerlegen:</strong> Teile die Figur in Rechtecke, Dreiecke, Trapeze oder Parallelogramme, berechne jede Teilfläche und addiere.</li>
      <li><strong>Ergänzen:</strong> Ergänze die Figur zu einer großen, einfachen Figur und ziehe die ergänzten Stücke wieder ab.</li>
    </ul>
    <p>Beide Wege ergeben denselben Flächeninhalt. Wähle den, der weniger Rechnung braucht, und mache eine beschriftete Skizze. Löcher wie Fenster und Türen werden abgezogen.</p>
    <div class="example"><strong>Beispiel:</strong> Ein L-förmiger Raum ist 8 m lang und 6 m breit; an einer Ecke fehlt ein Stück von 3 m × 2 m.<br>
    Zerlegen: 8 · 4 = 32 m² und 5 · 2 = 10 m², zusammen 42 m².<br>
    Ergänzen: 8 · 6 = 48 m², minus 3 · 2 = 6 m², also 42 m².<br>
    Giebelwand: Rechteck 6 m × 3 m = 18 m², Dreieck 6 · 2 : 2 = 6 m², minus Fenster 1,5 m × 1,5 m = 2,25 m². Zu streichen: 21,75 m².</div>
    <div class="merke"><strong>Merke:</strong> Zerlegen heißt Teilflächen addieren, Ergänzen heißt die große Fläche nehmen und die zu viel gezählten Stücke abziehen. Fenster und Aussparungen werden immer abgezogen.</div>
  `,
  formulas: [
    { name: "Rechteck, Dreieck, Trapez", html: "a · b; g · h : 2; (a + c) · h : 2", quantities: "die Teilfiguren, die du schon kennst" },
    { name: "Zerlegen und Ergänzen", html: "A = A₁ + A₂ + …; A = A<sub>groß</sub> − A<sub>fehlt</sub>", quantities: "beide Wege geben dasselbe Ergebnis" },
  ],
  quiz: {
    question: "Ein Bilderrahmen ist außen 50 cm × 40 cm, innen 40 cm × 30 cm. Wie groß ist die Rahmenfläche?",
    options: ["800 cm²", "1.200 cm²", "2.000 cm²", "100 cm²"],
    correctIndex: 0,
    explanation: "Ergänzen: 50 · 40 = 2.000 cm² außen, minus 40 · 30 = 1.200 cm² innen, bleiben 800 cm².",
  },
  lab: lab(
    "composite",
    "Zerlegen oder ergänzen",
    "Wähle eine Figur und einen Weg. Die farbigen Teilflächen zeigen, was addiert und was abgezogen wird. Beide Wege führen zum selben Ergebnis.",
    [
      choice("shape", "Figur", ["L-Form", "Giebelwand mit Fenster", "Rahmen"], 0),
      choice("method", "Weg", ["Zerlegen", "Ergänzen"], 0),
      r("w", "Breite", 4, 12, 8, 1, "m"),
      r("h", "Höhe", 3, 10, 6, 1, "m"),
      r("x", "Ecke, Fenster oder Rahmen: Breite", 1, 4, 2, 0.5, "m"),
      r("y", "Ecke: Höhe; Giebel: Dreieckshöhe", 1, 6, 2, 0.5, "m"),
    ],
    [o("A", "Flächeninhalt", (v) => compositeArea(v.shape, v.w, v.h, v.x, v.y).area, "m²", 2, true)],
    [
      { id: "gleich", text: "L-Form 8 m × 6 m ohne eine Ecke von 3 m × 2 m: Rechne mit dem Weg Ergänzen.", check: (v) => v.shape === 0 && v.method === 1 && v.w === 8 && v.h === 6 && v.x === 3 && v.y === 2 },
      { id: "dreissig", text: "Stelle eine L-Form mit genau 30 m² ein.", check: (v) => v.shape === 0 && near(compositeArea(0, v.w, v.h, v.x, v.y).area, 30) },
      { id: "giebel", text: "Giebelwand: Das Dreieck oben soll genau halb so groß sein wie das Rechteck darunter.", check: (v) => v.shape === 1 && near(v.y, v.h) },
    ],
  ),
  exercises: [
    {
      id: "l-form",
      make: (rng, level) => {
        const w = rng.int(6, 14);
        const h = rng.int(4, 10);
        const x = rng.int(1, w - 3);
        const y = rng.int(1, h - 2);
        const A = w * h - x * y;
        if (level === 1)
          return task(
            level,
            `Ein L-förmiger Raum: Das umschließende Rechteck ist ${w} m × ${h} m, an einer Ecke fehlt ein Stück von ${x} m × ${y} m. Berechne den Flächeninhalt.`,
            [num("A =", A, "m²", 0, { slips: [{ value: w * h, hint: "Ziehe das fehlende Eckstück noch ab." }, { value: w * h + x * y, hint: "Das Eckstück fehlt: abziehen, nicht addieren." }] })],
            "Ergänzen: großes Rechteck minus Eckstück. Oder zerlegen in zwei Rechtecke.",
            [`Ergänzen: ${w} · ${h} = ${w * h}, minus ${x} · ${y} = ${x * y}`, `Zerlegen: ${w} · ${h - y} + ${w - x} · ${y} = ${w * (h - y)} + ${(w - x) * y}`],
            `A = ${A} m²`,
            { w, h, x, y },
            [`${w} m × ${h} m`, `Eckstück: ${x} m × ${y} m`],
          );
        const price = rng.pick([25, 30, 35, 40, 45]);
        return task(
          level,
          `Eine Fliesenlegerin soll den Boden eines L-förmigen Raums fliesen: insgesamt ${w} m lang und ${h} m breit, an einer Ecke ist eine ${x} m × ${y} m große Nische abgetrennt, die nicht gefliest wird. Die Fliesen kosten ${price} € pro m². Wie groß ist die Fläche, und was kosten die Fliesen?`,
          [num("Fläche:", A, "m²", 0, { slips: [{ value: w * h, hint: "Die Nische wird nicht gefliest: abziehen." }] }), num("Kosten:", A * price, "€", 2)],
          "Fläche durch Ergänzen oder Zerlegen, dann mal Preis pro m².",
          [`${w} · ${h} − ${x} · ${y} = ${A} m²`, `${A} · ${price} €`],
          `${A} m², ${fmtUnit(A * price, "€")}`,
          { w, h, x, y, price },
        );
      },
    },
    {
      id: "giebel-rahmen",
      make: (rng, level) => {
        if (level === 1) {
          const outerW = 10 * rng.int(3, 8);
          const outerH = 10 * rng.int(3, 7);
          const t = rng.pick([3, 4, 5, 6, 8]);
          const inner = (outerW - 2 * t) * (outerH - 2 * t);
          return task(
            level,
            `Ein Bilderrahmen ist außen ${outerW} cm × ${outerH} cm groß und überall ${t} cm breit. Berechne die Fläche des Rahmens.`,
            [num("A =", outerW * outerH - inner, "cm²", 0, { slips: [{ value: outerW * outerH - (outerW - t) * (outerH - t), hint: "Der Rahmen ist auf beiden Seiten t breit: innen fehlen 2 · t." }] })],
            "Ergänzen: außen minus innen. Innen ist jede Seite um 2 · Rahmenbreite kürzer.",
            [`außen: ${outerW} · ${outerH} = ${outerW * outerH}`, `innen: ${outerW - 2 * t} · ${outerH - 2 * t} = ${inner}`],
            `A = ${outerW * outerH - inner} cm²`,
            { outerW, outerH, t },
            [`außen ${outerW} cm × ${outerH} cm`, `Breite ${t} cm`],
          );
        }
        const w = rng.pick([6, 7, 8, 9, 10]);
        const h = rng.pick([2.5, 3, 3.5]);
        const gable = rng.pick([1.5, 2, 2.5, 3]);
        const win = rng.pick([1, 1.2, 1.5]);
        const A = w * h + (w * gable) / 2 - win * win;
        const cover = rng.pick([5, 6, 8]);
        return task(
          level,
          `Ein Maler streicht eine Giebelwand: unten ein Rechteck ${w} m breit und ${fmtUnit(h, "m")} hoch, darauf ein gleichschenkliges Dreieck mit ${fmtUnit(gable, "m")} Höhe. Ein quadratisches Fenster mit ${fmtUnit(win, "m")} Seitenlänge wird nicht gestrichen. Wie groß ist die Fläche? Ein Liter Farbe reicht für ${cover} m². Wie viele Liter braucht er für einen Anstrich?`,
          [num("Fläche:", A, "m²", 2, { slips: [{ value: A + win * win, hint: "Das Fenster wird nicht gestrichen: abziehen." }, { value: w * h + w * gable - win * win, hint: "Das Dreieck ist nur halb so groß wie das Rechteck w · Höhe." }] }), num("Farbe:", A / cover, "l", 2)],
          "Rechteck + Dreieck (g · h : 2) − Fenster. Dann Fläche : Ergiebigkeit.",
          [`${w} · ${fmt(h)} + ${w} · ${fmt(gable)} : 2 − ${fmt(win)} · ${fmt(win)} = ${fmt(w * h)} + ${fmt((w * gable) / 2)} − ${fmt(win * win)}`, `${fmt(A, 2)} : ${cover}`],
          `${fmtUnit(A, "m²")}; ${eq(A / cover)} ${fmtUnit(A / cover, "l")} Farbe`,
          { w, h, gable, win },
        );
      },
    },
  ],
});

// 4.3 Oberfläche von Pyramide und Kegel (M9) ───────────────────────────────

const oberflaeche = L({
  id: "fl-3-oberflaeche-pyramide-kegel",
  title: "Oberfläche von Pyramide und Kegel",
  subtitle: "Grundfläche plus Mantel, am Netz begründet",
  tracks: M_ONLY,
  whyItMatters:
    "Wie viel Blech braucht ein Turmdach, wie viel Stoff ein Zelt, wie viel Karton eine Schultüte? Das Netz eines Körpers zeigt alle Flächen, die du dafür addieren musst.",
  explanationHtml: `
    <p>Die <strong>Oberfläche O</strong> eines Körpers ist die Summe aller Flächen seines Netzes: Grundfläche G plus Mantel M.</p>
    <p><strong>Quadratische Pyramide:</strong> Das Netz besteht aus dem Quadrat a² und vier gleichen Dreiecken mit der Grundseite a und der Höhe hₛ (Seitenhöhe). Also M = 4 · a · hₛ : 2 = 2 · a · hₛ und O = a² + 2 · a · hₛ. Ist nur die Körperhöhe h bekannt, berechnest du zuerst hₛ = √(h² + (a : 2)²).</p>
    <p><strong>Kegel:</strong> Der Mantel ist abgewickelt ein Kreisausschnitt mit dem Radius s (Mantellinie). Sein Bogen ist so lang wie der Umfang des Grundkreises, 2 · π · r. Der Ausschnitt ist also der Anteil r : s eines ganzen Kreises mit dem Radius s: M = π · s² · r : s = π · r · s.</p>
    <div class="example"><strong>Beispiel:</strong> Pyramide mit a = 6 cm, h = 4 cm: hₛ = √(16 + 9) = 5 cm, M = 2 · 6 · 5 = 60 cm², O = 36 + 60 = 96 cm².<br>
    Kegel mit r = 3 cm, h = 4 cm: s = 5 cm, M = π · 3 · 5 ≈ 47,12 cm², G = π · 9 ≈ 28,27 cm², O ≈ 75,40 cm².</div>
    <div class="merke"><strong>Merke:</strong> O = G + M. Quadratische Pyramide: M = 2 · a · hₛ. Kegel: M = π · r · s, G = π · r². Seitenhöhe und Mantellinie findest du mit Pythagoras.</div>
  `,
  formulas: [
    { name: "Quadratische Pyramide", html: "O = a² + 2 · a · hₛ", quantities: "a Grundkante, hₛ Seitenhöhe" },
    { name: "Kegel", html: "O = π · r² + π · r · s", quantities: "r Radius, s Mantellinie" },
  ],
  quiz: {
    question: "Ein Kegel hat r = 2 cm und s = 6 cm. Wie groß ist sein Mantel?",
    options: ["12π cm² ≈ 37,7 cm²", "4π cm² ≈ 12,6 cm²", "24π cm² ≈ 75,4 cm²", "36π cm² ≈ 113,1 cm²"],
    correctIndex: 0,
    explanation: "M = π · r · s = π · 2 · 6 = 12π ≈ 37,7 cm². 4π wäre die Grundfläche, 36π ein ganzer Kreis mit dem Radius s.",
  },
  lab: lab(
    "surface-net",
    "Das Netz",
    "Wähle Pyramide oder Kegel und verändere Grundkante (beim Kegel den Durchmesser) und Höhe. Das Netz zeigt Grundfläche und Mantel.",
    [choice("body", "Körper", ["quadratische Pyramide", "Kegel"], 0), r("a", "Grundkante a (Kegel: Durchmesser)", 2, 10, 4, 1, "cm"), r("h", "Höhe h", 2, 10, 3, 1, "cm")],
    [
      o("G", "Grundfläche G", (v) => (v.body === 0 ? v.a * v.a : Math.PI * (v.a / 2) ** 2), "cm²", 2),
      o("M", "Mantel M", (v) => (v.body === 0 ? 2 * v.a * Math.hypot(v.h, v.a / 2) : Math.PI * (v.a / 2) * Math.hypot(v.a / 2, v.h)), "cm²", 2, true),
      o("O", "Oberfläche O", (v) => (v.body === 0 ? v.a * v.a + 2 * v.a * Math.hypot(v.h, v.a / 2) : Math.PI * (v.a / 2) * ((v.a / 2) + Math.hypot(v.a / 2, v.h))), "cm²", 2),
    ],
    [
      { id: "sechsundneunzig", text: "Stelle eine quadratische Pyramide mit der Oberfläche 96 cm² ein.", check: (v) => v.body === 0 && near(v.a * v.a + 2 * v.a * Math.hypot(v.h, v.a / 2), 96) },
      { id: "kegel", text: "Stelle einen Kegel mit dem Radius 3 cm und der Mantellinie 5 cm ein.", check: (v) => v.body === 1 && v.a === 6 && v.h === 4 },
      { id: "mantel", text: "Finde eine Pyramide, deren Mantel mehr als dreimal so groß ist wie ihre Grundfläche.", check: (v) => v.body === 0 && 2 * v.a * Math.hypot(v.h, v.a / 2) > 3 * v.a * v.a },
    ],
  ),
  exercises: [
    {
      id: "pyramide",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.int(3, 12);
          const hs = rng.int(a, 15);
          const M = 2 * a * hs;
          return task(
            level,
            `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Seitenhöhe hₛ = ${hs} cm. Berechne Mantel und Oberfläche.`,
            [num("M =", M, "cm²", 2, { slips: [{ value: 4 * a * hs, hint: "Jede Seitenfläche ist ein Dreieck: a · hₛ : 2." }] }), num("O =", a * a + M, "cm²", 2, { slips: [{ value: M, hint: "Zur Oberfläche gehört auch die Grundfläche a²." }] })],
            "M = 4 · a · hₛ : 2 = 2 · a · hₛ; O = a² + M",
            [`M = 4 · ${a} · ${hs} : 2 = ${M} cm²`, `O = ${a}² + ${M} = ${a * a + M} cm²`],
            `M = ${M} cm², O = ${a * a + M} cm²`,
            { a, hs },
            [`a = ${a} cm`, `hₛ = ${hs} cm`],
          );
        }
        const a = rng.pick([4, 5, 6, 8]);
        const h = rng.pick([3, 4, 5, 6, 8, 10]);
        const hs = Math.hypot(h, a / 2);
        const M = 2 * a * hs;
        const price = rng.pick([80, 95, 120, 150]);
        return task(
          level,
          `Das Dach eines Kirchturms ist eine quadratische Pyramide mit a = ${a} m und der Höhe h = ${h} m. Es soll mit Kupferblech neu gedeckt werden (nur die Dachflächen). Wie groß ist die Seitenhöhe, wie viel Blech wird gebraucht, und was kostet es bei ${price} € pro m²?`,
          [num("hₛ =", hs, "m", 2, { slips: [{ value: Math.hypot(h, a), hint: "Im Dreieck aus h und hₛ liegt die halbe Grundkante." }] }), num("Blech:", M, "m²", 2, { absTolerance: 0.02 * a, slips: [{ value: a * a + M, hint: "Der Boden des Turmdachs wird nicht gedeckt: nur der Mantel." }] }), num("Kosten:", M * price, "€", 0, { absTolerance: 0.02 * a * price })],
          "hₛ = √(h² + (a : 2)²); Mantel M = 2 · a · hₛ; Kosten = M · Preis.",
          [`hₛ = √(${h}² + ${fmt(a / 2)}²) ${eq(hs)} ${fmtUnit(hs, "m")}`, `M = 2 · ${a} · ${fmt(hs, 2)} ${eq(M)} ${fmtUnit(M, "m²")}`, `${fmt(M, 2)} · ${price} €`],
          `hₛ ${eq(hs)} ${fmtUnit(hs, "m")}, ${fmtUnit(M, "m²")} Blech, etwa ${fmtUnit(M * price, "€", 0)}`,
          { a, h },
        );
      },
    },
    {
      id: "kegel",
      make: (rng, level) => {
        if (level === 1) {
          const rr = rng.int(2, 9);
          const s = rng.int(rr + 1, 20);
          const M = Math.PI * rr * s;
          const G = Math.PI * rr * rr;
          return task(
            level,
            `Ein Kegel hat den Radius r = ${rr} cm und die Mantellinie s = ${s} cm. Berechne Mantel und Oberfläche.`,
            [num("M =", M, "cm²", 2, { slips: [{ value: Math.PI * s * s, hint: "Der Mantel ist nur ein Ausschnitt des Kreises mit Radius s: M = π · r · s." }, { value: 2 * Math.PI * rr * s, hint: "Ohne den Faktor 2: M = π · r · s." }] }), num("O =", G + M, "cm²", 2, { slips: [{ value: M, hint: "Zur Oberfläche gehört auch der Grundkreis π · r²." }] })],
            "M = π · r · s; G = π · r²; O = G + M",
            [`M = π · ${rr} · ${s} ≈ ${fmt(M, 2)} cm²`, `G = π · ${rr}² ≈ ${fmt(G, 2)} cm²`],
            `M ≈ ${fmtUnit(M, "cm²")}, O ≈ ${fmtUnit(G + M, "cm²")}`,
            { rr, s },
            [`r = ${rr} cm`, `s = ${s} cm`],
          );
        }
        const d = rng.pick([14, 16, 18, 20]);
        const h = rng.pick([50, 60, 70, 80]);
        const s = Math.hypot(d / 2, h);
        const M = Math.PI * (d / 2) * s;
        return task(
          level,
          `Eine Schultüte ist ein Kegel mit ${d} cm Durchmesser und ${h} cm Höhe. Wie lang ist die Mantellinie, und wie viel Karton braucht man mindestens für den Mantel (ohne Klebestreifen)?`,
          [num("s =", s, "cm", 2, { slips: [{ value: Math.hypot(d, h), hint: "Im rechtwinkligen Dreieck steht der Radius, also der halbe Durchmesser." }] }), num("Karton:", M, "cm²", 0, { absTolerance: 1, slips: [{ value: M + Math.PI * (d / 2) ** 2, hint: "Die Schultüte ist oben offen: nur der Mantel." }] })],
          "s = √(r² + h²), dann M = π · r · s.",
          [`r = ${d / 2} cm; s = √(${d / 2}² + ${h}²) ${eq(s)} ${fmtUnit(s, "cm")}`, `M = π · ${d / 2} · ${fmt(s, 2)}`],
          `s ${eq(s)} ${fmtUnit(s, "cm")}, etwa ${fmtUnit(M, "cm²", 0)} Karton`,
          { d, h },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  4,
  "Regelmäßige Vielecke, zusammengesetzte Figuren und Oberflächen",
  "#ea580c",
  "⬡",
  [vieleckFlaeche, zusammengesetzt, oberflaeche],
);
