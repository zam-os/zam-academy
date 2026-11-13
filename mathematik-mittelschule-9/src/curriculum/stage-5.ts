import { fmt, fmtUnit, round } from "../exercises/format";
import { compositeSolid, COMPOSITE_SOLIDS, regularPolygon } from "../models";
import { BOTH, choice, lab, makeLesson, makeStage, output as o, range as r, task } from "./builders";
import { numberField as num } from "./helpers";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(5, content);
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (near(value, round(value, digits)) ? "=" : "≈");
const N_NAMES: Record<number, string> = { 5: "fünfeckig", 6: "sechseckig", 8: "achteckig" };

/** G of a regular n-gon from s and the rounded height of a determining triangle. */
function baseArea(n: number, s: number) {
  const h = round(regularPolygon(n, s).apothem, 2);
  return { h, G: (n * s * h) / 2 };
}

// 5.1 Prismen mit regelmäßiger Grundfläche ─────────────────────────────────

const prisma = L({
  id: "ri-1-prisma",
  title: "Prismen mit regelmäßiger Grundfläche",
  subtitle: "V = G · hₖ, auch für Sechseck und Achteck",
  tracks: BOTH,
  whyItMatters:
    "Ein sechseckiger Bleistift, eine achteckige Vase, ein Becken mit regelmäßiger Grundfläche: Ihr Volumen berechnest du genauso wie beim Quader, nur die Grundfläche ist jetzt ein regelmäßiges Vieleck.",
  explanationHtml: `
    <p>Ein <strong>gerades Prisma</strong> hat zwei deckungsgleiche, parallele Grundflächen; die Seitenflächen sind Rechtecke. Beim Quader kennst du schon: Volumen = Grundfläche · Höhe. Das gilt für jedes gerade Prisma, denn man kann es in Schichten der Dicke 1 zerlegen, die alle das Volumen G · 1 haben:</p>
    <p class="formula-line">V = G · hₖ</p>
    <p>Dabei ist hₖ die <strong>Körperhöhe</strong>, der Abstand der beiden Grundflächen. Ist die Grundfläche ein regelmäßiges n-Eck, berechnest du G wie in Lernbereich 4: G = n · s · h : 2, wobei h die Höhe eines Bestimmungsdreiecks ist.</p>
    <div class="example"><strong>Beispiel:</strong> Ein sechseckiges Prisma hat s = 4 cm, h = 3,46 cm (Bestimmungsdreieck) und hₖ = 10 cm. G = 6 · 4 · 3,46 : 2 = 41,52 cm². V = 41,52 cm² · 10 cm = 415,2 cm³ ≈ 0,42 l.<br>
    Umkehraufgabe: Ein Gefäß mit G = 80 cm² soll 2 l = 2.000 cm³ fassen: hₖ = 2.000 : 80 = 25 cm.</div>
    <div class="merke"><strong>Merke:</strong> Gerades Prisma: V = G · hₖ. Bei regelmäßiger Grundfläche ist G = n · s · h : 2. Rückwärts: hₖ = V : G. 1 dm³ = 1 l, 1 cm³ = 1 ml.</div>
  `,
  formulas: [
    { name: "Prisma", html: "V = G · hₖ", quantities: "G Grundfläche, hₖ Körperhöhe" },
    { name: "Regelmäßige Grundfläche", html: "G = n · s · h : 2", quantities: "n Ecken, s Seite, h Höhe eines Bestimmungsdreiecks" },
    { name: "Raumeinheiten", html: "1 dm³ = 1 l; 1 cm³ = 1 ml; 1 m³ = 1.000 l", quantities: "Umrechnungszahl 1.000" },
  ],
  quiz: {
    question: "Ein Prisma hat die Grundfläche 25 cm² und die Körperhöhe 8 cm. Wie groß ist sein Volumen?",
    options: ["200 cm³", "100 cm³", "66,7 cm³", "33 cm³"],
    correctIndex: 0,
    explanation: "V = G · hₖ = 25 cm² · 8 cm = 200 cm³. Ein Drittel davon (66,7 cm³) hätte eine Pyramide mit gleicher Grundfläche und Höhe.",
  },
  lab: lab(
    "prism-volume",
    "Schicht für Schicht",
    "Ein Prisma besteht aus gleichen Schichten. Verändere die Ecken, die Seitenlänge und die Zahl der Schichten (die Körperhöhe in cm).",
    [r("n", "Ecken der Grundfläche n", 3, 8, 5, 1), r("s", "Seitenlänge s", 1, 10, 3, 1, "cm"), r("hk", "Körperhöhe hₖ", 1, 20, 4, 1, "cm")],
    [
      o("G", "Grundfläche G", (v) => (v.n * v.s * regularPolygon(v.n, v.s).apothem) / 2, "cm²", 2),
      o("V", "Volumen V", (v) => ((v.n * v.s * regularPolygon(v.n, v.s).apothem) / 2) * v.hk, "cm³", 2, true),
      o("l", "in Litern", (v) => ((v.n * v.s * regularPolygon(v.n, v.s).apothem) / 2) * v.hk / 1000, "l", 3),
    ],
    [
      { id: "liter", text: "Ein sechseckiges Prisma soll etwa 1 Liter fassen: zwischen 950 cm³ und 1.050 cm³.", check: (v) => { const V = ((v.n * v.s * regularPolygon(v.n, v.s).apothem) / 2) * v.hk; return v.n === 6 && V >= 950 && V <= 1050; } },
      { id: "verdoppeln", text: "Verdopple das Volumen des Fünfecksprismas vom Start (s = 3 cm, hₖ = 4 cm), indem du nur die Höhe änderst.", check: (v) => v.n === 5 && v.s === 3 && v.hk === 8 },
      { id: "wuerfel", text: "Stelle mit vier Ecken einen Würfel mit 64 cm³ ein.", check: (v) => v.n === 4 && v.s === 4 && v.hk === 4 },
    ],
  ),
  exercises: [
    {
      id: "volumen",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.pick([5, 6, 8]);
          const s = rng.int(2, 12);
          const hk = rng.int(5, 30);
          const { h, G } = baseArea(n, s);
          return task(
            level,
            `Ein ${N_NAMES[n]}es Prisma mit regelmäßiger Grundfläche hat s = ${s} cm, die Höhe eines Bestimmungsdreiecks h = ${fmtUnit(h, "cm")} und die Körperhöhe hₖ = ${hk} cm. Berechne G und V.`,
            [num("G =", G, "cm²", 2, { slips: [{ value: n * s * h, hint: "Ein Bestimmungsdreieck ist s · h : 2: Teile noch durch 2." }] }), num("V =", G * hk, "cm³", 2, { slips: [{ value: (G * hk) / 3, hint: "Ein Prisma ist nicht spitz: V = G · hₖ ohne ⅓." }] })],
            "G = n · s · h : 2; V = G · hₖ",
            [`G = ${n} · ${s} · ${fmt(h)} : 2 ${eq(G)} ${fmt(G, 2)} cm²`, `V = ${fmt(G, 2)} · ${hk}`],
            `G ${eq(G)} ${fmtUnit(G, "cm²")}, V ${eq(G * hk)} ${fmtUnit(G * hk, "cm³")}`,
            { n, s, hk },
            [`n = ${n}`, `s = ${s} cm`, `h = ${fmtUnit(h, "cm")}`, `hₖ = ${hk} cm`],
          );
        }
        const n = 8;
        const s = rng.pick([1, 1.2, 1.5, 2]);
        const depth = rng.pick([0.8, 1, 1.2, 1.5]);
        const h = round(regularPolygon(n, s).apothem, 2);
        const G = (n * s * h) / 2;
        const V = G * depth;
        return task(
          level,
          `Ein Gartenteich hat die Form eines achteckigen Prismas mit regelmäßiger Grundfläche: Seitenlänge ${fmtUnit(s, "m")}, Höhe eines Bestimmungsdreiecks ${fmtUnit(h, "m")}, Tiefe ${fmtUnit(depth, "m")}. Wie viele Liter Wasser fasst er?`,
          [num("Volumen:", V, "m³", 2), num("Liter:", V * 1000, "l", 0, { absTolerance: 5, slips: [{ value: V * 100, hint: "1 m³ = 1.000 l." }] })],
          "G = 8 · s · h : 2, V = G · Tiefe, dann m³ in Liter: mal 1.000.",
          [`G = 8 · ${fmt(s)} · ${fmt(h)} : 2 ${eq(G)} ${fmt(G, 2)} m²`, `V = ${fmt(G, 2)} · ${fmt(depth)} ${eq(V)} ${fmt(V, 3)} m³`],
          `${fmtUnit(V, "m³")} ≈ ${fmtUnit(V * 1000, "l", 0)}`,
          { s, depth },
        );
      },
    },
    {
      id: "umkehrung",
      make: (rng, level) => {
        if (level === 1) {
          const G = rng.int(12, 90);
          const hk = rng.int(4, 25);
          return task(
            level,
            `Ein Prisma hat die Grundfläche G = ${G} cm² und das Volumen V = ${G * hk} cm³. Wie groß ist die Körperhöhe?`,
            [num("hₖ =", hk, "cm", 2, { slips: [{ value: G * G * hk, hint: "Rückwärts heißt teilen: hₖ = V : G." }] })],
            "hₖ = V : G",
            [`hₖ = ${G * hk} : ${G}`],
            `hₖ = ${hk} cm`,
            { G, hk },
            [`G = ${G} cm²`, `V = ${G * hk} cm³`],
          );
        }
        const n = 6;
        const s = rng.pick([12, 15, 18, 20]);
        const { h, G } = baseArea(n, s);
        const liters = rng.pick([10, 15, 20, 25, 30]);
        const hk = (liters * 1000) / G;
        return task(
          level,
          `Ein sechseckiger Blumenkübel hat innen eine regelmäßige Grundfläche mit s = ${s} cm und h = ${fmtUnit(h, "cm")}. Er soll ${liters} l Erde fassen. Wie hoch muss die Erde mindestens eingefüllt werden?`,
          [num("Grundfläche:", G, "cm²", 2), num("Höhe:", hk, "cm", 1, { slips: [{ value: liters / G, hint: "Rechne Liter in cm³ um: 1 l = 1.000 cm³." }] })],
          "G = 6 · s · h : 2, Liter in cm³ umrechnen, dann hₖ = V : G.",
          [`G = 6 · ${s} · ${fmt(h)} : 2 ${eq(G)} ${fmt(G, 2)} cm²`, `${liters} l = ${fmt(liters * 1000)} cm³`, `hₖ = ${fmt(liters * 1000)} : ${fmt(G, 2)}`],
          `etwa ${fmtUnit(hk, "cm", 1)} hoch`,
          { s, liters },
        );
      },
    },
  ],
});

// 5.2 Pyramide und Kegel: ein Drittel ─────────────────────────────────────

const spitz = L({
  id: "ri-2-pyramide-kegel-volumen",
  title: "Volumen von Pyramide und Kegel",
  subtitle: "Ein Drittel des Prismas mit gleicher Grundfläche und Höhe",
  tracks: BOTH,
  whyItMatters:
    "Wie viel Sand liegt in einem Schüttkegel auf der Baustelle? Wie viel Luft ist unter einem Pyramidendach? Für spitze Körper gibt es eine einfache Regel: ein Drittel des passenden Prismas.",
  explanationHtml: `
    <p>Füllst du eine hohle Pyramide mit Wasser und schüttest es in ein Prisma mit <strong>gleicher Grundfläche und gleicher Höhe</strong>, so ist das Prisma nach dreimaligem Umschütten genau voll. Dasselbe gilt für Kegel und Zylinder. Spitze Körper haben also ein Drittel des Volumens:</p>
    <p class="formula-line">V = ⅓ · G · h</p>
    <ul>
      <li>Quadratische Pyramide: V = ⅓ · a² · h</li>
      <li>Pyramide mit regelmäßigem n-Eck: G = n · s · h<sub>Δ</sub> : 2, dann V = ⅓ · G · h</li>
      <li>Kegel: V = ⅓ · π · r² · h</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Pyramide mit a = 6 cm und h = 4 cm: V = ⅓ · 36 · 4 = 48 cm³. Ein Quader mit gleicher Grundfläche und Höhe hätte 144 cm³.<br>
    Ein Sandhaufen ist ein Kegel mit 4 m Durchmesser und 1,5 m Höhe: V = ⅓ · π · 2² · 1,5 ≈ 6,28 m³.</div>
    <div class="merke"><strong>Merke:</strong> Spitzer Körper: V = ⅓ · G · h. Die Höhe h ist immer senkrecht gemessen, nicht entlang der Seitenkante oder Mantellinie.</div>
  `,
  formulas: [
    { name: "Pyramide", html: "V = ⅓ · G · h", quantities: "G Grundfläche, h Höhe" },
    { name: "Kegel", html: "V = ⅓ · π · r² · h", quantities: "r Radius, h Höhe" },
  ],
  quiz: {
    question: "Ein Kegel und ein Zylinder haben dieselbe Grundfläche und dieselbe Höhe. Der Zylinder fasst 1,2 l. Wie viel fasst der Kegel?",
    options: ["0,4 l", "0,6 l", "3,6 l", "1,2 l"],
    correctIndex: 0,
    explanation: "Ein spitzer Körper hat ein Drittel des Volumens: 1,2 l : 3 = 0,4 l.",
  },
  lab: lab(
    "pour",
    "Umschütten",
    "Fülle den spitzen Körper und schütte ihn in den Körper mit gleicher Grundfläche und gleicher Höhe. Wie oft musst du schütten, bis er voll ist?",
    [choice("body", "Körperpaar", ["Pyramide und Prisma", "Kegel und Zylinder"], 0), r("a", "Grundkante (Kegel: Durchmesser)", 2, 10, 4, 1, "cm"), r("h", "Höhe h", 2, 12, 6, 1, "cm"), r("pours", "Füllungen umgeschüttet", 0, 3, 0, 1)],
    [
      o("G", "Grundfläche G", (v) => (v.body === 1 ? Math.PI * (v.a / 2) ** 2 : v.a * v.a), "cm²", 2),
      o("V", "Volumen des spitzen Körpers", (v) => ((v.body === 1 ? Math.PI * (v.a / 2) ** 2 : v.a * v.a) * v.h) / 3, "cm³", 2, true),
    ],
    [
      { id: "drei", text: "Schütte so oft um, bis der rechte Körper voll ist.", check: (v) => v.pours === 3 },
      { id: "kegel", text: "Stelle einen Kegel mit einem Volumen zwischen 300 cm³ und 320 cm³ ein.", check: (v) => { const V = (Math.PI * (v.a / 2) ** 2 * v.h) / 3; return v.body === 1 && V >= 300 && V <= 320; } },
      { id: "pyramide", text: "Stelle eine quadratische Pyramide mit genau 48 cm³ ein.", check: (v) => v.body === 0 && near((v.a * v.a * v.h) / 3, 48) },
    ],
  ),
  exercises: [
    {
      id: "pyramide",
      make: (rng, level) => {
        if (level === 1) {
          if (rng.next() < 0.5) {
            const a = rng.int(3, 15);
            const h = rng.int(3, 20);
            const V = (a * a * h) / 3;
            return task(
              level,
              `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Höhe h = ${h} cm. Berechne ihr Volumen.`,
              [num("V =", V, "cm³", 2, { slips: [{ value: a * a * h, hint: "Das ist das Prisma. Eine Pyramide hat nur ein Drittel davon." }, { value: (a * h) / 3, hint: "Die Grundfläche ist a², nicht a." }] })],
              "V = ⅓ · a² · h",
              [`G = ${a}² = ${a * a} cm²`, `V = ⅓ · ${a * a} · ${h}`],
              `V ${eq(V)} ${fmtUnit(V, "cm³")}`,
              { a, h },
              [`a = ${a} cm`, `h = ${h} cm`],
            );
          }
          const n = rng.pick([5, 6, 8]);
          const s = rng.int(2, 10);
          const hk = rng.int(5, 20);
          const { h, G } = baseArea(n, s);
          return task(
            level,
            `Eine Pyramide hat ein regelmäßiges ${n}-Eck als Grundfläche: s = ${s} cm, Höhe eines Bestimmungsdreiecks ${fmtUnit(h, "cm")}. Die Pyramide ist ${hk} cm hoch. Berechne G und V.`,
            [num("G =", G, "cm²", 2), num("V =", (G * hk) / 3, "cm³", 2, { slips: [{ value: G * hk, hint: "Spitzer Körper: noch durch 3 teilen." }] })],
            "G = n · s · h : 2; V = ⅓ · G · h",
            [`G = ${n} · ${s} · ${fmt(h)} : 2 ${eq(G)} ${fmt(G, 2)} cm²`, `V = ⅓ · ${fmt(G, 2)} · ${hk}`],
            `G ${eq(G)} ${fmtUnit(G, "cm²")}, V ${eq((G * hk) / 3)} ${fmtUnit((G * hk) / 3, "cm³")}`,
            { n, s, hk },
            [`n = ${n}`, `s = ${s} cm`, `h = ${fmtUnit(h, "cm")}`, `Höhe ${hk} cm`],
          );
        }
        const a = rng.pick([6, 8, 10, 12]);
        const h = rng.pick([4, 5, 6, 7, 8]);
        const V = (a * a * h) / 3;
        return task(
          level,
          `Der Eingang eines Museums ist eine gläserne Pyramide mit quadratischer Grundfläche: a = ${a} m, Höhe ${h} m. Wie viele m³ Luft sind unter dem Glasdach? Wie viel weniger ist das als in einem Quader mit gleicher Grundfläche und Höhe?`,
          [num("Pyramide:", V, "m³", 2, { slips: [{ value: a * a * h, hint: "Das ist der Quader. Die Pyramide hat ein Drittel davon." }] }), num("weniger:", (2 * a * a * h) / 3, "m³", 2)],
          "V = ⅓ · a² · h. Der Quader hat a² · h, also drei Drittel.",
          [`V = ⅓ · ${a}² · ${h} ${eq(V)} ${fmt(V, 2)} m³`, `Quader: ${a * a * h} m³; Unterschied: zwei Drittel davon`],
          `${fmtUnit(V, "m³")}; ${fmtUnit((2 * a * a * h) / 3, "m³")} weniger`,
          { a, h },
        );
      },
    },
    {
      id: "kegel",
      make: (rng, level) => {
        if (level === 1) {
          const rr = rng.int(2, 12);
          const h = rng.int(3, 20);
          const V = (Math.PI * rr * rr * h) / 3;
          return task(
            level,
            `Ein Kegel hat den Radius r = ${rr} cm und die Höhe h = ${h} cm. Berechne sein Volumen.`,
            [num("V =", V, "cm³", 2, { slips: [{ value: Math.PI * rr * rr * h, hint: "Das ist der Zylinder. Der Kegel hat ein Drittel." }, { value: (Math.PI * 2 * rr * h) / 3, hint: "Die Grundfläche ist π · r², nicht der Umfang 2 · π · r." }] })],
            "V = ⅓ · π · r² · h",
            [`G = π · ${rr}² ≈ ${fmt(Math.PI * rr * rr, 2)} cm²`, `V = ⅓ · π · ${rr * rr} · ${h}`],
            `V ≈ ${fmtUnit(V, "cm³")}`,
            { rr, h },
            [`r = ${rr} cm`, `h = ${h} cm`],
          );
        }
        const d = rng.pick([3, 4, 5, 6]);
        const h = rng.pick([1, 1.2, 1.5, 2]);
        const V = (Math.PI * (d / 2) ** 2 * h) / 3;
        const density = 1.6;
        return task(
          level,
          `Auf einer Baustelle liegt ein Sandhaufen in Form eines Kegels: Durchmesser ${d} m, Höhe ${fmtUnit(h, "m")}. Wie viele m³ Sand sind das? Rechne mit 1,6 t pro m³: Wie schwer ist der Sand?`,
          [num("Volumen:", V, "m³", 2, { slips: [{ value: (Math.PI * d * d * h) / 3, hint: "Im Volumen steht der Radius, also der halbe Durchmesser." }] }), num("Masse:", V * density, "t", 2, { absTolerance: 0.01 })],
          "r = d : 2, V = ⅓ · π · r² · h, Masse = V · 1,6 t.",
          [`r = ${fmt(d / 2)} m`, `V = ⅓ · π · ${fmt((d / 2) ** 2)} · ${fmt(h)} ≈ ${fmt(V, 2)} m³`, `${fmt(V, 2)} · 1,6`],
          `V ≈ ${fmtUnit(V, "m³")}, etwa ${fmtUnit(V * density, "t")}`,
          { d, h },
        );
      },
    },
  ],
});

// 5.3 Zusammengesetzte Körper und Umkehraufgaben ───────────────────────────

const zusammen = L({
  id: "ri-3-zusammengesetzte-koerper",
  title: "Zusammengesetzte Körper und Umkehraufgaben",
  subtitle: "Haus, Turm und Silo; die Höhe rückwärts berechnen",
  tracks: BOTH,
  whyItMatters:
    "Ein Silo, ein Haus mit Dach, ein Trichter: In Landwirtschaft, Bau und Handwerk sind Körper meist zusammengesetzt. Wer sie zerlegt, die Teilvolumen addiert und Formeln auch rückwärts nutzt, plant Material und Kosten.",
  explanationHtml: `
    <p>Zusammengesetzte Körper <strong>zerlegst</strong> du in bekannte Körper: Quader, Prisma, Zylinder (aus Klasse 8: V = π · r² · h), Pyramide, Kegel. Die Teilvolumen werden addiert. Ist ein Körper ausgehöhlt, ziehst du den Hohlraum ab.</p>
    <p>Bei <strong>Umkehraufgaben</strong> ist das Volumen bekannt und eine Länge gesucht. Stelle die Formel um: Aus V = ⅓ · G · h wird h = 3 · V : G. Aus V = ⅓ · π · r² · h wird r = √(3 · V : (π · h)).</p>
    <div class="example"><strong>Beispiel:</strong> Ein Silo besteht aus einem Zylinder (d = 4 m, h = 8 m) und einem Kegeldach (h = 1,5 m). Zylinder: π · 2² · 8 ≈ 100,53 m³. Kegel: ⅓ · π · 2² · 1,5 ≈ 6,28 m³. Zusammen etwa 106,81 m³.<br>
    Umkehraufgabe: Eine quadratische Pyramide mit a = 6 cm soll 120 cm³ haben. h = 3 · 120 : 36 = 10 cm.</div>
    <div class="merke"><strong>Merke:</strong> Skizze machen, in bekannte Körper zerlegen, Teilvolumen addieren oder abziehen. Bei Umkehraufgaben die Formel nach der gesuchten Größe umstellen und das Ergebnis durch Einsetzen prüfen.</div>
  `,
  formulas: [
    { name: "Zylinder (aus Klasse 8)", html: "V = π · r² · h", quantities: "r Radius, h Höhe" },
    { name: "Höhe rückwärts", html: "h = 3 · V : G (spitze Körper); h = V : G (Prismen)", quantities: "G Grundfläche" },
  ],
  quiz: {
    question: "Eine quadratische Pyramide mit a = 3 cm hat das Volumen 30 cm³. Wie hoch ist sie?",
    options: ["10 cm", "3,3 cm", "30 cm", "1,1 cm"],
    correctIndex: 0,
    explanation: "h = 3 · V : G = 3 · 30 : 9 = 10 cm. Ohne das Mal 3 käme man auf 3,3 cm, das wäre die Höhe eines Quaders.",
  },
  lab: lab(
    "composite-solid",
    "Haus, Turm und Silo",
    "Wähle einen Körper und verändere die Maße (in m). Unten blau der untere Körper, oben orange der aufgesetzte. Die Volumen werden addiert.",
    [
      choice("shape", "Körper", [...COMPOSITE_SOLIDS], 0),
      r("a", "Breite a (Silo: Durchmesser)", 2, 10, 6, 1, "m"),
      r("b", "Länge b (nur Haus)", 2, 12, 8, 1, "m"),
      r("h1", "Höhe unten h₁", 2, 12, 4, 1, "m"),
      r("h2", "Höhe Dach h₂", 1, 8, 3, 1, "m"),
    ],
    [
      o("unten", "unterer Körper", (v) => compositeSolid(v.shape, v.a, v.b, v.h1, v.h2).lower, "m³", 2),
      o("oben", "Dach", (v) => compositeSolid(v.shape, v.a, v.b, v.h1, v.h2).upper, "m³", 2),
      o("V", "Volumen zusammen", (v) => compositeSolid(v.shape, v.a, v.b, v.h1, v.h2).total, "m³", 2, true),
    ],
    [
      { id: "dach-viertel", text: "Haus: Stelle die Höhen so ein, dass das Dach genau ein Viertel des ganzen Volumens hat.", check: (v) => { const c = compositeSolid(v.shape, v.a, v.b, v.h1, v.h2); return v.shape === 0 && near(4 * c.upper, c.total); } },
      { id: "turm-hundert", text: "Turm: Stelle einen Turm mit genau 100 m³ ein.", check: (v) => v.shape === 1 && near(compositeSolid(1, v.a, v.b, v.h1, v.h2).total, 100) },
      { id: "silo-kegel", text: "Silo: Das Kegeldach soll genau so viel fassen wie 1 m des Zylinders.", check: (v) => v.shape === 2 && v.h2 === 3 },
    ],
  ),
  exercises: [
    {
      id: "zusammengesetzt",
      make: (rng, level) => {
        if (level === 1) {
          const shape = rng.int(0, 2);
          const a = rng.int(3, 10);
          const b = rng.int(4, 12);
          const h1 = rng.int(3, 10);
          const h2 = rng.int(2, 6);
          const c = compositeSolid(shape, a, b, h1, h2);
          const what = shape === 0 ? `ein Haus: Quader ${a} m × ${b} m × ${h1} m mit einem Satteldach (Dreiecksprisma) der Höhe ${h2} m` : shape === 1 ? `ein Turm: Quader mit quadratischer Grundfläche a = ${a} m und ${h1} m Höhe, darauf eine Pyramide mit ${h2} m Höhe` : `ein Silo: Zylinder mit ${a} m Durchmesser und ${h1} m Höhe, darauf ein Kegel mit ${h2} m Höhe`;
          return task(
            level,
            `Berechne das Volumen der beiden Teile und des ganzen Körpers. Der Körper ist ${what}.`,
            [num("unten:", c.lower, "m³", 2), num("Dach:", c.upper, "m³", 2, { slips: [{ value: shape === 0 ? a * h2 * b : 3 * c.upper, hint: shape === 0 ? "Die Dachgrundfläche ist ein Dreieck: a · h₂ : 2." : "Das Dach ist spitz: ⅓ · G · h₂." }] }), num("gesamt:", c.total, "m³", 2)],
            "Zerlegen, jedes Teilvolumen mit seiner Formel, dann addieren.",
            [`unten: ${c.lowerFormula} ${eq(c.lower)} ${fmt(c.lower, 2)} m³`, `Dach: ${c.upperFormula} ${eq(c.upper)} ${fmt(c.upper, 2)} m³`],
            `zusammen ${eq(c.total)} ${fmtUnit(c.total, "m³")}`,
            { shape, a, b, h1, h2 },
          );
        }
        const d = rng.pick([3, 4, 5, 6]);
        const h = rng.pick([6, 8, 10, 12]);
        const funnel = rng.pick([1.5, 2, 2.5, 3]);
        const G = Math.PI * (d / 2) ** 2;
        const V = G * h + (G * funnel) / 3;
        const density = 0.75;
        return task(
          level,
          `Ein Getreidesilo besteht aus einem Zylinder (Durchmesser ${d} m, Höhe ${h} m) und darunter einem kegelförmigen Auslauftrichter mit ${fmtUnit(funnel, "m")} Höhe. Wie viele m³ fasst das Silo? Weizen wiegt etwa 0,75 t pro m³. Wie viele Tonnen passen hinein?`,
          [num("Volumen:", V, "m³", 1, { slips: [{ value: G * (h + funnel), hint: "Der Trichter ist ein Kegel: nur ⅓ · G · h." }] }), num("Weizen:", V * density, "t", 1, { absTolerance: 0.1 })],
          "Zylinder π · r² · h plus Kegel ⅓ · π · r² · h, dann mal 0,75 t.",
          [`G = π · ${fmt(d / 2)}² ≈ ${fmt(G, 2)} m²`, `Zylinder ≈ ${fmt(G * h, 2)} m³, Trichter ≈ ${fmt((G * funnel) / 3, 2)} m³`],
          `etwa ${fmtUnit(V, "m³", 1)}, das sind etwa ${fmtUnit(V * density, "t", 1)} Weizen`,
          { d, h },
        );
      },
    },
    {
      id: "umkehrung",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.int(2, 10);
          const h = rng.int(3, 20);
          const V = (a * a * h) / 3;
          return task(
            level,
            `Eine quadratische Pyramide mit a = ${a} cm hat das Volumen V = ${fmtUnit(V, "cm³")}. Wie hoch ist sie?`,
            [num("h =", h, "cm", 2, { slips: [{ value: V / (a * a), hint: "Spitzer Körper: h = 3 · V : G." }] })],
            "h = 3 · V : G mit G = a²",
            [`G = ${a}² = ${a * a} cm²`, `h = 3 · ${fmt(V, 2)} : ${a * a}`],
            `h = ${h} cm`,
            { a, h },
            [`a = ${a} cm`, `V = ${fmtUnit(V, "cm³")}`],
          );
        }
        const rr = rng.pick([2.5, 3, 3.5, 4]);
        const ml = rng.pick([80, 100, 120, 150]);
        const h = (3 * ml) / (Math.PI * rr * rr);
        return task(
          level,
          `Ein kegelförmiges Glas hat oben einen Radius von ${fmtUnit(rr, "cm")}. Es soll bis zum Rand genau ${ml} ml fassen. Wie hoch muss das Glas innen sein?`,
          [num("Höhe:", h, "cm", 2, { slips: [{ value: ml / (Math.PI * rr * rr), hint: "Das wäre ein Zylinder. Beim Kegel: h = 3 · V : (π · r²)." }] })],
          "1 ml = 1 cm³. Aus V = ⅓ · π · r² · h folgt h = 3 · V : (π · r²).",
          [`${ml} ml = ${ml} cm³`, `h = 3 · ${ml} : (π · ${fmt(rr)}²) = ${3 * ml} : ${fmt(Math.PI * rr * rr, 2)}`],
          `h ≈ ${fmtUnit(h, "cm")}`,
          { rr, ml },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  5,
  "Prismen, Pyramiden, Kegel und zusammengesetzte Körper",
  "#16a34a",
  "🧊",
  [prisma, spitz, zusammen],
);
