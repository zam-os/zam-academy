import { fmt } from "../exercises/format";
import { BODIES, compositeVolumes, spilled } from "../lab/views-kugel";
import { numberField as num } from "./helpers";
import { choice, lab, makeLesson, makeStage, output as o, range as r, task } from "./builders";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(5, content);
const PI = Math.PI;
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const ballV = (r0: number) => (4 / 3) * PI * r0 ** 3;
const ballO = (r0: number) => 4 * PI * r0 * r0;

// 5.1 Kugel ────────────────────────────────────────────────────────────────

const kugel = L({
  id: "ku-1-kugel",
  title: "Oberfläche und Volumen der Kugel",
  subtitle: "O = 4πr² und V = 4/3 · πr³, auch rückwärts",
  whyItMatters:
    "Fußbälle, Kugellager, Gastanks und Seifenblasen sind Kugeln. Wie viel Leder ein Ball braucht und wie viel Luft hineinpasst, berechnest du mit zwei Formeln. Rückwärts findest du den Radius aus Volumen oder Oberfläche.",
  explanationHtml: `
    <p><strong>Oberfläche:</strong> Schält man eine Orange, bedeckt die Schale genau vier Kreise mit dem Radius der Orange. Also ist O = 4 · πr².</p>
    <p><strong>Volumen:</strong> Ein randvoller Zylinder hat denselben Radius r wie die Kugel und die Höhe 2r. Versenkt man die Kugel ganz, läuft genau ⅔ des Wassers über. Also ist V = ⅔ · πr² · 2r = 4/3 · πr³.</p>
    <p><strong>Umkehraufgaben:</strong> Aus O = 4πr² folgt r = √(O : (4π)). Aus V = 4/3 · πr³ folgt r = ³√(3V : (4π)).</p>
    <div class="example"><strong>Beispiel:</strong> r = 6 cm. O = 4 · π · 6² = 144π ≈ 452,39 cm², V = 4/3 · π · 6³ = 288π ≈ 904,78 cm³.<br>
    Eine Kugel soll 1 Liter = 1.000 cm³ fassen: r = ³√(3.000 : (4π)) = ³√238,73… ≈ 6,20 cm.</div>
    <div class="merke"><strong>Merke:</strong> O = 4πr², V = 4/3 · πr³. Ist der Durchmesser d gegeben, zuerst r = d : 2. Verdoppelt sich r, wird O viermal und V achtmal so groß.</div>
  `,
  formulas: [
    { name: "Oberfläche der Kugel", html: "O = 4 · π · r²", quantities: "r Radius" },
    { name: "Volumen der Kugel", html: "V = 4/3 · π · r³", quantities: "r Radius" },
    { name: "Radius rückwärts", html: "r = ³√(3V : (4π)), r = √(O : (4π))", quantities: "Umkehraufgaben" },
  ],
  quiz: {
    question: "Der Radius einer Kugel wird verdoppelt. Wie verändert sich ihr Volumen?",
    options: ["Es wird 8-mal so groß.", "Es wird doppelt so groß.", "Es wird 4-mal so groß.", "Es wird 6-mal so groß."],
    correctIndex: 0,
    explanation: "Im Volumen steht r³: 2³ = 8. Die Oberfläche (mit r²) wird 4-mal so groß.",
  },
  lab: lab(
    "sphere",
    "Kugel im Zylinder",
    "Ziehe die Kugel in den randvollen Zylinder (gleicher Radius, Höhe 2r). Das Becherglas fängt das Wasser auf. Die zweite Ansicht zeigt die Oberfläche als Orangenschale.",
    [
      r("r", "Radius r", 1, 8, 3, 0.1, "cm"),
      { ...r("sink", "Eintauchen", 0, 100, 0, 1, "%"), showIf: (v) => v.view === 0 },
      choice("view", "Ansicht", ["Kugel im Zylinder", "Orangenschale (Oberfläche)"], 0),
    ],
    [
      o("V", "Volumen der Kugel", (v) => ballV(v.r), "cm³", 1, true),
      o("O", "Oberfläche der Kugel", (v) => ballO(v.r), "cm²", 1),
      o("spill", "übergelaufen", (v) => spilled(v.r, v.sink), "cm³", 1),
    ],
    [
      { id: "zwei-drittel", text: "Versenke die Kugel ganz: Welcher Anteil des Zylinderwassers läuft über?", check: (v) => v.view === 0 && v.sink === 100 },
      { id: "achtfach", text: "Mache das Volumen genau achtmal so groß wie das der Vergleichskugel mit r = 2 cm.", check: (v) => same(v.r, 4) },
      { id: "liter", text: "Stelle eine Kugel mit etwa 1 Liter Volumen ein (auf 3 % genau).", check: (v) => Math.abs(ballV(v.r) - 1000) <= 30 },
    ],
  ),
  exercises: [
    {
      id: "berechnen",
      make: (rng, level) => {
        if (level === 1) {
          const r0 = rng.pick([2, 2.5, 3, 4, 5, 6, 7.5, 10]);
          const byDiameter = rng.next() < 0.4;
          return task(
            level,
            `Eine Kugel hat ${byDiameter ? `den Durchmesser d = ${fmt(2 * r0)} cm` : `den Radius r = ${fmt(r0)} cm`}. Berechne ihre Oberfläche und ihr Volumen.`,
            [
              num("O =", ballO(r0), "cm²", 2, { slips: [{ value: ballO(2 * r0), hint: "Mit dem Radius rechnen, nicht mit dem Durchmesser: r = d : 2." }, { value: PI * r0 * r0, hint: "Die Oberfläche sind vier Kreisflächen: 4 · πr²." }] }),
              num("V =", ballV(r0), "cm³", 2, { slips: [{ value: ballV(2 * r0), hint: "Mit dem Radius rechnen, nicht mit dem Durchmesser." }, { value: (4 / 3) * PI * r0 * r0, hint: "Im Volumen steht r³, nicht r²." }] }),
            ],
            "O = 4πr², V = 4/3 · πr³; beim Durchmesser zuerst r = d : 2",
            [...(byDiameter ? [`r = ${fmt(2 * r0)} cm : 2 = ${fmt(r0)} cm`] : []), `O = 4 · π · ${fmt(r0)}²`, `V = 4/3 · π · ${fmt(r0)}³`],
            `O ≈ ${fmt(ballO(r0), 2)} cm², V ≈ ${fmt(ballV(r0), 2)} cm³`,
            { r0, byDiameter: byDiameter ? 1 : 0 },
          );
        }
        const u = rng.pick([64, 66, 68, 69, 70, 75]);
        const r0 = u / (2 * PI);
        return task(
          level,
          `Ein Ball hat einen Umfang von ${u} cm (gemessen am dicksten Kreis). Wie viel Quadratzentimeter Material bilden seine Oberfläche? Wie viele Liter Luft sind in ihm?`,
          [num("Oberfläche:", ballO(r0), "cm²", 1), num("Volumen:", ballV(r0) / 1000, "L", 2, { slips: [{ value: ballV(r0), hint: "Das sind cm³. 1 Liter = 1.000 cm³." }] })],
          "Zuerst den Radius aus dem Umfang: r = U : (2π).",
          [`r = ${u} cm : (2π) ≈ ${fmt(r0, 3)} cm`, `O = 4π · r² ≈ ${fmt(ballO(r0), 1)} cm²`, `V = 4/3 · π · r³ ≈ ${fmt(ballV(r0), 0)} cm³`],
          `O ≈ ${fmt(ballO(r0), 1)} cm², V ≈ ${fmt(ballV(r0) / 1000, 2)} L`,
          { u },
        );
      },
    },
    {
      id: "umkehr",
      make: (rng, level) => {
        if (level === 1) {
          const volume = rng.pick([100, 250, 500, 1000, 2000, 5000]);
          const r0 = Math.cbrt((3 * volume) / (4 * PI));
          return task(
            level,
            `Eine Kugel hat ein Volumen von ${fmt(volume)} cm³. Berechne ihren Radius und ihre Oberfläche.`,
            [num("r =", r0, "cm", 2, { slips: [{ value: Math.sqrt((3 * volume) / (4 * PI)), hint: "r³ = 3V : (4π): dritte Wurzel, nicht Quadratwurzel." }] }), num("O =", ballO(r0), "cm²", 1)],
            "r = ³√(3V : (4π)), dann O = 4πr².",
            [`3V : (4π) = ${fmt((3 * volume) / (4 * PI), 2)}`, `r = ³√${fmt((3 * volume) / (4 * PI), 2)} ≈ ${fmt(r0, 2)} cm`, `O = 4π · r²`],
            `r ≈ ${fmt(r0, 2)} cm, O ≈ ${fmt(ballO(r0), 1)} cm²`,
            { volume },
            [`V = ${fmt(volume)} cm³`],
          );
        }
        const mass = rng.pick([0.5, 1, 2, 4, 7.26]);
        const density = 7.85;
        const volume = (mass * 1000) / density;
        const r0 = Math.cbrt((3 * volume) / (4 * PI));
        return task(
          level,
          `Eine Kugel aus Stahl wiegt ${fmt(mass, 2)} kg. Stahl hat die Dichte 7,85 g/cm³. Berechne ihr Volumen und ihren Durchmesser.`,
          [num("V =", volume, "cm³", 1, { slips: [{ value: mass * density, hint: "Volumen = Masse : Dichte (Masse in Gramm)." }] }), num("d =", 2 * r0, "cm", 2, { slips: [{ value: r0, hint: "Gefragt ist der Durchmesser: d = 2r." }] })],
          "V = Masse : Dichte (1 kg = 1.000 g). Dann r = ³√(3V : (4π)) und d = 2r.",
          [`V = ${fmt(mass * 1000)} g : 7,85 g/cm³ ≈ ${fmt(volume, 1)} cm³`, `r = ³√(3V : (4π)) ≈ ${fmt(r0, 2)} cm`, `d = 2r`],
          `V ≈ ${fmt(volume, 1)} cm³, d ≈ ${fmt(2 * r0, 2)} cm`,
          { mass },
        );
      },
    },
  ],
});

// 5.2 Zusammengesetzte Körper ──────────────────────────────────────────────

const zusammengesetzt = L({
  id: "ku-2-zusammengesetzt",
  title: "Zusammengesetzte Körper mit Kugeln",
  subtitle: "Zerlegen, ergänzen, Teilkörper berechnen",
  whyItMatters:
    "Ein Getreidesilo, eine Eistüte, ein Werkstück mit eingefräster Mulde: Viele Körper bestehen aus Zylindern, Kegeln und Halbkugeln. Wer sie zerlegt, kann Volumen und Materialbedarf auch für Berufe wie Metallbau oder Landwirtschaft berechnen.",
  explanationHtml: `
    <p>So gehst du bei zusammengesetzten Körpern vor:</p>
    <ol>
      <li><strong>Skizze</strong> anfertigen und in bekannte Teilkörper <strong>zerlegen</strong> (Zylinder, Kegel, Prisma, Würfel, Halbkugel) oder zu einem bekannten Körper <strong>ergänzen</strong> und das Fehlende abziehen.</li>
      <li>Gegebene Maße eintragen, fehlende Maße bestimmen (z. B. Radius aus dem Durchmesser, Mantellinie mit Pythagoras).</li>
      <li><strong>Volumen:</strong> Teilvolumen addieren oder abziehen.</li>
      <li><strong>Oberfläche:</strong> nur die Flächen zählen, die außen sichtbar sind. Wo zwei Teilkörper aneinanderstoßen, fällt die Fläche weg.</li>
    </ol>
    <p>Eine Halbkugel hat das Volumen ⅔ · πr³ und die gewölbte Fläche 2πr².</p>
    <div class="example"><strong>Beispiel:</strong> Ein Silo besteht aus einem Zylinder (r = 3 m, h = 8 m) mit einer Halbkugel als Dach.<br>
    V = π · 3² · 8 + ⅔ · π · 3³ = 72π + 18π = 90π ≈ 282,74 m³.<br>
    Außenfläche ohne Boden: Mantel 2π · 3 · 8 = 48π, Dach 2π · 3² = 18π, zusammen 66π ≈ 207,35 m². Die Deckfläche des Zylinders liegt innen und zählt nicht.</div>
    <div class="merke"><strong>Merke:</strong> Zerlegen oder ergänzen, Teilkörper einzeln berechnen. Volumen addieren oder abziehen; bei der Oberfläche innere Berührflächen weglassen.</div>
  `,
  formulas: [
    { name: "Halbkugel", html: "V = ⅔ · π · r³, gewölbte Fläche 2 · π · r²", quantities: "r Radius" },
    { name: "Zylinder und Kegel", html: "V<sub>Zyl</sub> = πr²h, V<sub>Kegel</sub> = ⅓ · πr²h, M<sub>Kegel</sub> = πrs", quantities: "s Mantellinie" },
  ],
  quiz: {
    question: "Auf einem Zylinder sitzt eine Halbkugel mit gleichem Radius. Welche Fläche zählt bei der Oberfläche des ganzen Körpers nicht mit?",
    options: ["Die Deckfläche des Zylinders unter der Halbkugel", "Die Grundfläche des Zylinders", "Der Mantel des Zylinders", "Die gewölbte Fläche der Halbkugel"],
    correctIndex: 0,
    explanation: "Die Deckfläche des Zylinders wird von der Halbkugel bedeckt und liegt innen. Außen liegen Grundfläche, Mantel und die gewölbte Halbkugelfläche.",
  },
  lab: lab(
    "composite-sphere",
    "Halbkugel und Teilkörper",
    "Wähle einen Körper und ziehe an Höhe und Radius. Rechts stehen die Teilvolumen und der Anteil der Halbkugel bzw. der Luft in der Verpackung.",
    [
      choice("kind", "Körper", BODIES, 0),
      r("r", "Radius r", 1, 6, 3, 0.5, "cm"),
      { ...r("h", "Höhe h", 2, 12, 8, 0.5, "cm"), showIf: (v) => v.kind !== 2 },
    ],
    [
      o("total", "Volumen gesamt", (v) => compositeVolumes(v.kind, v.r, v.h).total, "cm³", 1, true),
      o("share", "Anteil der (Halb-)Kugel", (v) => {
        const vols = compositeVolumes(v.kind, v.r, v.h);
        return (vols.sphere / vols.total) * 100;
      }, "%", 1),
    ],
    [
      { id: "viertel", text: "Stelle ein Silo ein, bei dem die Halbkugel genau ein Viertel des Volumens ausmacht.", check: (v) => v.kind === 0 && same(v.h, 2 * v.r) },
      { id: "doppelt", text: "Stelle eine Eistüte ein, deren Waffel doppelt so viel fasst wie die Halbkugel darüber.", check: (v) => v.kind === 1 && same(v.h, 4 * v.r) },
      { id: "liter-wuerfel", text: "Packe eine Kugel in einen Würfel, der genau 1 Liter fasst.", check: (v) => v.kind === 2 && same(v.r, 5) },
    ],
  ),
  exercises: [
    {
      id: "zusammensetzen",
      make: (rng, level) => {
        if (level === 1) {
          const r0 = rng.pick([2, 2.5, 3, 4, 5]);
          const h = rng.pick([6, 8, 10, 12]);
          const vol = PI * r0 * r0 * h + (2 / 3) * PI * r0 ** 3;
          const surface = 2 * PI * r0 * h + 2 * PI * r0 * r0;
          return task(
            level,
            `Ein Silo besteht aus einem Zylinder (r = ${fmt(r0)} m, h = ${h} m) mit einer Halbkugel als Dach. Berechne das Volumen und die Außenfläche ohne den Boden.`,
            [
              num("V =", vol, "m³", 2, { slips: [{ value: PI * r0 * r0 * h + (4 / 3) * PI * r0 ** 3, hint: "Auf dem Silo sitzt nur eine Halbkugel: ⅔ · πr³." }] }),
              num("Außenfläche:", surface, "m²", 2, { slips: [{ value: surface + PI * r0 * r0, hint: "Die Deckfläche des Zylinders liegt unter dem Dach und zählt nicht; der Boden ist nicht gefragt." }] }),
            ],
            "V = πr²h + ⅔ · πr³; Außenfläche = Zylindermantel 2πrh + Halbkugelfläche 2πr²",
            [`Zylinder: π · ${fmt(r0)}² · ${h} ≈ ${fmt(PI * r0 * r0 * h, 2)} m³`, `Halbkugel: ⅔ · π · ${fmt(r0)}³ ≈ ${fmt((2 / 3) * PI * r0 ** 3, 2)} m³`, `Mantel 2π · ${fmt(r0)} · ${h} + Dach 2π · ${fmt(r0)}²`],
            `V ≈ ${fmt(vol, 2)} m³, Außenfläche ≈ ${fmt(surface, 2)} m²`,
            { r0, h },
            [`Zylinder r = ${fmt(r0)} m, h = ${h} m`, "Dach: Halbkugel"],
          );
        }
        const r0 = rng.pick([2.5, 3, 3.5]);
        const h = rng.pick([10, 11, 12]);
        const vol = (PI * r0 * r0 * h) / 3 + (2 / 3) * PI * r0 ** 3;
        const s = Math.hypot(r0, h);
        return task(
          level,
          `Eine Eiswaffel ist ein Kegel mit dem Randradius ${fmt(r0)} cm und der Höhe ${h} cm. Sie ist ganz mit Eis gefüllt, oben sitzt eine Halbkugel aus Eis. Wie viel Eis ist es insgesamt? Wie viel Waffelfläche (Kegelmantel) wird gebraucht? Fertige eine Skizze an.`,
          [num("Eis:", vol, "cm³", 1), num("Waffel:", PI * r0 * s, "cm²", 1, { slips: [{ value: PI * r0 * h, hint: "Der Mantel braucht die Mantellinie s = √(r² + h²), nicht die Höhe." }] })],
          "Eis = Kegel ⅓ · πr²h + Halbkugel ⅔ · πr³. Mantel = π · r · s mit s = √(r² + h²).",
          [`Kegel: ⅓ · π · ${fmt(r0)}² · ${h} ≈ ${fmt((PI * r0 * r0 * h) / 3, 1)} cm³`, `Halbkugel: ⅔ · π · ${fmt(r0)}³ ≈ ${fmt((2 / 3) * PI * r0 ** 3, 1)} cm³`, `s = √(${fmt(r0)}² + ${h}²) ≈ ${fmt(s, 2)} cm`],
          `Eis ≈ ${fmt(vol, 1)} cm³, Waffel ≈ ${fmt(PI * r0 * s, 1)} cm²`,
          { r0, h },
        );
      },
    },
    {
      id: "abziehen",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick([4, 6, 8, 10, 12]);
          const ball = ballV(a / 2);
          const air = a ** 3 - ball;
          return task(
            level,
            `Eine Kugel liegt genau passend in einer würfelförmigen Schachtel mit ${a} cm Kantenlänge. Wie viel Luft ist in der Schachtel? Wie viel Prozent des Würfels sind das?`,
            [num("Luft:", air, "cm³", 1, { slips: [{ value: a ** 3 - ballV(a), hint: "Der Radius der Kugel ist die halbe Kantenlänge." }] }), num("Anteil:", (air / a ** 3) * 100, "%", 1)],
            "Kugelradius r = a : 2. Luft = Würfel − Kugel.",
            [`r = ${a} : 2 = ${fmt(a / 2)} cm`, `Würfel ${a ** 3} cm³, Kugel ≈ ${fmt(ball, 1)} cm³`, `Luft : Würfel · 100 %`],
            `Luft ≈ ${fmt(air, 1)} cm³, etwa ${fmt((air / a ** 3) * 100, 1)} %`,
            { a },
            [`Würfelkante ${a} cm`],
          );
        }
        const r0 = rng.pick([2, 3, 4]);
        const h = rng.pick([5, 6, 8]);
        const rest = PI * r0 * r0 * h - (2 / 3) * PI * r0 ** 3;
        return task(
          level,
          `Ein Metallbauer fräst in einen Stahlzylinder (r = ${r0} cm, h = ${h} cm) oben eine halbkugelförmige Mulde mit demselben Radius. Wie groß ist das Volumen des Werkstücks? Wie schwer ist es (Stahl: 7,85 g/cm³)?`,
          [num("V =", rest, "cm³", 1, { slips: [{ value: PI * r0 * r0 * h - (4 / 3) * PI * r0 ** 3, hint: "Ausgefräst wird nur eine Halbkugel: ⅔ · πr³." }] }), num("Masse:", (rest * 7.85) / 1000, "kg", 2, { slips: [{ value: rest * 7.85, hint: "Das sind Gramm. 1 kg = 1.000 g." }] })],
          "Ergänzen: Zylinder minus Halbkugel. Masse = Volumen · Dichte.",
          [`Zylinder: π · ${r0}² · ${h} ≈ ${fmt(PI * r0 * r0 * h, 1)} cm³`, `Mulde: ⅔ · π · ${r0}³ ≈ ${fmt((2 / 3) * PI * r0 ** 3, 1)} cm³`, `Masse = V · 7,85 g/cm³ ≈ ${fmt(rest * 7.85, 0)} g`],
          `V ≈ ${fmt(rest, 1)} cm³, Masse ≈ ${fmt((rest * 7.85) / 1000, 2)} kg`,
          { r0, h },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  5,
  "Oberfläche und Volumen der Kugel, zusammengesetzte Körper",
  "#be185d",
  "◯",
  [kugel, zusammengesetzt],
);
