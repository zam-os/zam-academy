import { fmt } from "../exercises/format";
import { quadrant } from "../lab/views-trigonometrie";
import { acosD, asinD, atanD, choiceField, cosD, numberField as num, RAD_HINT, sinD, tanD } from "./helpers";
import { lab, makeLesson, makeStage, output as o, range as r, task } from "./builders";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(4, content);
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (same(value, Math.round(value * 10 ** digits) / 10 ** digits) ? "=" : "≈");

/** Right triangles with whole sides [leg, leg, hypotenuse]. */
const TRIPLES: Array<[number, number, number]> = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
];

/** The value a calculator set to RAD returns, so a hint can name the slip. */
const radSlip = (value: number) => ({ value, hint: RAD_HINT });

// 4.1 Sinus, Kosinus und Tangens ───────────────────────────────────────────

const verhaeltnisse = L({
  id: "tr-1-sin-cos-tan",
  title: "Sinus, Kosinus und Tangens",
  subtitle: "Seitenverhältnisse im rechtwinkligen Dreieck",
  whyItMatters:
    "Alle rechtwinkligen Dreiecke mit demselben Winkel sind ähnlich. Ihre Seitenverhältnisse hängen also nur vom Winkel ab. Diese Verhältnisse heißen Sinus, Kosinus und Tangens und verbinden Winkel mit Längen.",
  explanationHtml: `
    <p>Im rechtwinkligen Dreieck liegt die <strong>Hypotenuse</strong> dem rechten Winkel gegenüber. Für einen spitzen Winkel α heißt die Kathete gegenüber von α <strong>Gegenkathete</strong> (GK), die Kathete an α <strong>Ankathete</strong> (AK).</p>
    <p>Alle rechtwinkligen Dreiecke mit demselben Winkel α sind ähnlich. Deshalb sind ihre Seitenverhältnisse gleich, egal wie groß das Dreieck ist:</p>
    <table class="mini">
      <tr><th>Name</th><th>Verhältnis</th></tr>
      <tr><td>Sinus</td><td>sin α = Gegenkathete : Hypotenuse</td></tr>
      <tr><td>Kosinus</td><td>cos α = Ankathete : Hypotenuse</td></tr>
      <tr><td>Tangens</td><td>tan α = Gegenkathete : Ankathete</td></tr>
    </table>
    <p>Der Taschenrechner muss auf <strong>DEG</strong> (Grad) stehen. Mit sin<sup>−1</sup>, cos<sup>−1</sup> und tan<sup>−1</sup> berechnest du aus einem Verhältnis den Winkel.</p>
    <div class="example"><strong>Beispiel:</strong> Gegenkathete 3 cm, Ankathete 4 cm, Hypotenuse 5 cm. sin α = 3 : 5 = 0,6; cos α = 4 : 5 = 0,8; tan α = 3 : 4 = 0,75. Mit sin<sup>−1</sup>(0,6) erhältst du α ≈ 36,87°. Ein doppelt so großes Dreieck mit 6 cm, 8 cm und 10 cm hat dieselben Verhältnisse.</div>
    <div class="merke"><strong>Merke:</strong> sin α = GK : H, cos α = AK : H, tan α = GK : AK. Welche Kathete Gegen- oder Ankathete ist, hängt vom Winkel ab, den du betrachtest.</div>
  `,
  formulas: [
    { name: "Sinus", html: "sin α = Gegenkathete : Hypotenuse", quantities: "im rechtwinkligen Dreieck" },
    { name: "Kosinus", html: "cos α = Ankathete : Hypotenuse", quantities: "im rechtwinkligen Dreieck" },
    { name: "Tangens", html: "tan α = Gegenkathete : Ankathete", quantities: "im rechtwinkligen Dreieck" },
  ],
  quiz: {
    question: "Im rechtwinkligen Dreieck ist die Gegenkathete von α 5 cm, die Ankathete 12 cm und die Hypotenuse 13 cm lang. Was ist sin α?",
    options: ["5 : 13", "12 : 13", "5 : 12", "13 : 5"],
    correctIndex: 0,
    explanation: "sin α = Gegenkathete : Hypotenuse = 5 : 13 ≈ 0,385. 12 : 13 ist cos α, 5 : 12 ist tan α.",
  },
  lab: lab(
    "trig-ratios",
    "Gleicher Winkel, gleiche Verhältnisse",
    "Ziehe die Ecke B. Ändert sich nur die Größe, bleiben sin α, cos α und tan α gleich; sie hängen allein vom Winkel ab.",
    [r("alpha", "Winkel α", 5, 85, 35, 1, "°"), r("c", "Hypotenuse", 2, 8, 5, 0.5, "cm")],
    [
      o("sin", "sin α", (v) => sinD(v.alpha), "", 3, true),
      o("cos", "cos α", (v) => cosD(v.alpha), "", 3),
      o("tan", "tan α", (v) => tanD(v.alpha), "", 3),
    ],
    [
      { id: "sin-halb", text: "Stelle einen Winkel ein, bei dem die Gegenkathete halb so lang ist wie die Hypotenuse.", check: (v) => v.alpha === 30 },
      { id: "tan-eins", text: "Stelle einen Winkel ein, bei dem Gegenkathete und Ankathete gleich lang sind.", check: (v) => v.alpha === 45 },
      { id: "ankathete-vier", text: "Stelle eine 8 cm lange Hypotenuse mit einer 4 cm langen Ankathete ein.", check: (v) => v.c === 8 && v.alpha === 60 },
    ],
  ),
  exercises: [
    {
      id: "verhaeltnisse",
      make: (rng, level) => {
        const [g, a, h] = rng.pick(TRIPLES);
        if (level === 1) {
          return task(
            level,
            `In einem rechtwinkligen Dreieck ist die Gegenkathete von α ${g} cm, die Ankathete ${a} cm und die Hypotenuse ${h} cm lang. Berechne sin α, cos α und tan α.`,
            [
              num("sin α =", g / h, "", 3, { slips: [{ value: a / h, hint: "Sinus: Gegenkathete durch Hypotenuse." }] }),
              num("cos α =", a / h, "", 3, { slips: [{ value: g / h, hint: "Kosinus: Ankathete durch Hypotenuse." }] }),
              num("tan α =", g / a, "", 3, { slips: [{ value: a / g, hint: "Tangens: Gegenkathete durch Ankathete." }] }),
            ],
            "sin α = GK : H, cos α = AK : H, tan α = GK : AK",
            [`sin α = ${g} : ${h}`, `cos α = ${a} : ${h}`, `tan α = ${g} : ${a}`],
            `sin α ${eq(g / h, 3)} ${fmt(g / h, 3)}, cos α ${eq(a / h, 3)} ${fmt(a / h, 3)}, tan α ${eq(g / a, 3)} ${fmt(g / a, 3)}`,
            { g, a, h },
            [`GK = ${g} cm, AK = ${a} cm, H = ${h} cm`],
          );
        }
        const s = rng.pick([1, 2, 3]);
        return task(
          level,
          `Im Dreieck RST liegt der rechte Winkel bei S. Es ist RS = ${a * s} cm, ST = ${g * s} cm und RT = ${h * s} cm. Gib für den Winkel bei R den Sinus, den Kosinus und den Tangens an.`,
          [
            num("sin =", g / h, "", 3, { slips: [{ value: a / h, hint: "Die Gegenkathete liegt dem Winkel bei R gegenüber: das ist ST." }] }),
            num("cos =", a / h, "", 3, { slips: [{ value: g / h, hint: "Die Ankathete liegt am Winkel bei R an: das ist RS." }] }),
            num("tan =", g / a, "", 3, { slips: [{ value: a / g, hint: "Tangens: Gegenkathete ST durch Ankathete RS." }] }),
          ],
          "Skizze: Die Hypotenuse liegt dem rechten Winkel bei S gegenüber. Gegenkathete von R ist die Seite, die R nicht berührt.",
          [`Hypotenuse RT = ${h * s} cm, Gegenkathete ST = ${g * s} cm, Ankathete RS = ${a * s} cm`, `sin = ${g * s} : ${h * s}, cos = ${a * s} : ${h * s}, tan = ${g * s} : ${a * s}`],
          `sin ${eq(g / h, 3)} ${fmt(g / h, 3)}, cos ${eq(a / h, 3)} ${fmt(a / h, 3)}, tan ${eq(g / a, 3)} ${fmt(g / a, 3)}`,
          { g, a, h, s },
        );
      },
    },
    {
      id: "winkel",
      make: (rng, level) => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          const x = rng.pick([2, 3, 4, 5, 6]);
          const y = x + rng.pick([1, 2, 3, 4, 5]);
          const [given, ratio, fn, inv] =
            kind === 0
              ? [`Gegenkathete ${x} cm und Hypotenuse ${y} cm`, x / y, "sin", asinD]
              : kind === 1
                ? [`Ankathete ${x} cm und Hypotenuse ${y} cm`, x / y, "cos", acosD]
                : [`Gegenkathete ${x} cm und Ankathete ${y} cm`, x / y, "tan", atanD];
          const alpha = inv(ratio);
          return task(
            level,
            `In einem rechtwinkligen Dreieck sind zum Winkel α die ${given} bekannt. Berechne α und den dritten Winkel β.`,
            [num("α =", alpha, "°", 2), num("β =", 90 - alpha, "°", 2)],
            `Passende Funktion wählen: ${fn} α = ${x} : ${y}, dann ${fn}⁻¹. β = 90° − α.`,
            [`${fn} α = ${x} : ${y} ${eq(ratio, 4)} ${fmt(ratio, 4)}`, `α = ${fn}⁻¹(${fmt(ratio, 4)}) ${eq(alpha)} ${fmt(alpha, 2)}°`, `β = 90° − α`],
            `α ${eq(alpha)} ${fmt(alpha, 2)}°, β ${eq(90 - alpha)} ${fmt(90 - alpha, 2)}°`,
            { kind, x, y },
          );
        }
        const xz = rng.pick([3, 4, 5, 6, 8]);
        const yz = rng.pick([2, 3, 5, 7, 9]);
        const atX = atanD(yz / xz);
        return task(
          level,
          `Im Dreieck XYZ liegt der rechte Winkel bei Z. Die Katheten sind XZ = ${xz} cm und YZ = ${yz} cm lang. Berechne die Winkel bei X und bei Y.`,
          [num("Winkel bei X:", atX, "°", 2, { slips: [{ value: 90 - atX, hint: "Für den Winkel bei X ist YZ die Gegenkathete und XZ die Ankathete." }] }), num("Winkel bei Y:", 90 - atX, "°", 2)],
          "Zwei Katheten gegeben: Tangens. Gegenkathete von X ist YZ, Ankathete ist XZ.",
          [`tan(X) = YZ : XZ = ${yz} : ${xz}`, `X = tan⁻¹(${fmt(yz / xz, 4)}) ${eq(atX)} ${fmt(atX, 2)}°`, `Y = 90° − X`],
          `X ${eq(atX)} ${fmt(atX, 2)}°, Y ${eq(90 - atX)} ${fmt(90 - atX, 2)}°`,
          { xz, yz },
        );
      },
    },
  ],
});

// 4.2 Seiten und Winkel berechnen ──────────────────────────────────────────

const berechnen = L({
  id: "tr-2-berechnen",
  title: "Seiten und Winkel berechnen",
  subtitle: "In Dreiecken, Figuren und Körpern",
  whyItMatters:
    "Kennst du in einem rechtwinkligen Dreieck einen Winkel und eine Seite, kannst du jede andere Seite ausrechnen. So berechnest du Höhen von gleichschenkligen Dreiecken, Diagonalen und Neigungswinkel von Pyramiden.",
  explanationHtml: `
    <p>So gehst du vor:</p>
    <ol>
      <li>Rechtwinkliges Dreieck suchen (in Figuren und Körpern oft durch eine Höhe oder Diagonale), Skizze mit rechtem Winkel.</li>
      <li>Gegebene und gesuchte Größe markieren; Hypotenuse, Gegenkathete und Ankathete zum bekannten Winkel benennen.</li>
      <li>Die Funktion wählen, in der genau die gegebene und die gesuchte Größe vorkommen, und umstellen.</li>
    </ol>
    <table class="mini">
      <tr><th>gegeben</th><th>gesucht</th><th>Rechnung</th></tr>
      <tr><td>H, α</td><td>GK</td><td>GK = H · sin α</td></tr>
      <tr><td>H, α</td><td>AK</td><td>AK = H · cos α</td></tr>
      <tr><td>AK, α</td><td>GK</td><td>GK = AK · tan α</td></tr>
      <tr><td>GK, α</td><td>H</td><td>H = GK : sin α</td></tr>
    </table>
    <div class="example"><strong>Beispiel:</strong> Ein gleichschenkliges Dreieck hat die Basis 8 cm und Basiswinkel von 50°. Die Höhe teilt es in zwei rechtwinklige Dreiecke mit der Ankathete 4 cm. Höhe h = 4 cm · tan 50° ≈ 4,77 cm, Schenkel s = 4 cm : cos 50° ≈ 6,22 cm.</div>
    <div class="merke"><strong>Merke:</strong> Erst das rechtwinklige Dreieck und die Seitennamen zum Winkel bestimmen, dann die Funktion wählen. Teilen durch sin, cos oder tan, wenn die Hypotenuse oder die Ankathete gesucht ist.</div>
  `,
  formulas: [
    { name: "Seiten aus Winkel", html: "GK = H · sin α, AK = H · cos α, GK = AK · tan α", quantities: "umgestellte Definitionen" },
  ],
  quiz: {
    question: "Die Hypotenuse ist 10 cm lang, α = 30°. Wie lang ist die Gegenkathete von α?",
    options: ["5 cm", "8,66 cm", "20 cm", "5,77 cm"],
    correctIndex: 0,
    explanation: "GK = H · sin α = 10 cm · sin 30° = 10 cm · 0,5 = 5 cm. 8,66 cm ist die Ankathete (10 cm · cos 30°).",
  },
  lab: lab(
    "ladder",
    "Leiter an der Wand",
    "Ziehe den Fuß oder das obere Ende der Leiter. Die Leiter ist die Hypotenuse, die Höhe an der Wand die Gegenkathete, der Abstand des Fußes die Ankathete.",
    [r("alpha", "Anstellwinkel α", 5, 85, 50, 1, "°"), r("L", "Leiterlänge", 2, 8, 5, 0.5, "m")],
    [
      o("gk", "Höhe an der Wand (Gegenkathete)", (v) => v.L * sinD(v.alpha), "m", 2),
      o("ak", "Abstand des Fußes (Ankathete)", (v) => v.L * cosD(v.alpha), "m", 2),
      o("sin", "sin α", (v) => sinD(v.alpha), "", 3, true),
      o("cos", "cos α", (v) => cosD(v.alpha), "", 3),
    ],
    [
      { id: "halb", text: "Finde den Winkel, bei dem die Leiter genau halb so hoch reicht, wie sie lang ist.", check: (v) => v.alpha === 30 },
      { id: "sicher", text: "Stelle eine 6-m-Leiter sicher auf (65° bis 75°), sodass sie mindestens 5,6 m hoch reicht.", check: (v) => v.L === 6 && v.alpha >= 65 && v.alpha <= 75 && v.L * sinD(v.alpha) >= 5.6 },
      { id: "gleich", text: "Mache die Höhe an der Wand genau so groß wie den Abstand des Fußes.", check: (v) => v.alpha === 45 },
    ],
  ),
  exercises: [
    {
      id: "seite",
      make: (rng, level) => {
        if (level === 1) {
          const alpha = rng.pick([20, 25, 32, 38, 42, 50, 55, 63, 70]);
          const len = rng.pick([4, 5, 6, 7.5, 8, 9, 12]);
          const kind = rng.int(0, 3);
          const cases = [
            { given: `Hypotenuse ${fmt(len)} cm`, sought: "Gegenkathete", value: len * sinD(alpha), how: `${fmt(len)} cm · sin ${alpha}°`, rad: len * Math.sin(alpha) },
            { given: `Hypotenuse ${fmt(len)} cm`, sought: "Ankathete", value: len * cosD(alpha), how: `${fmt(len)} cm · cos ${alpha}°`, rad: len * Math.cos(alpha) },
            { given: `Ankathete ${fmt(len)} cm`, sought: "Gegenkathete", value: len * tanD(alpha), how: `${fmt(len)} cm · tan ${alpha}°`, rad: len * Math.tan(alpha) },
            { given: `Gegenkathete ${fmt(len)} cm`, sought: "Hypotenuse", value: len / sinD(alpha), how: `${fmt(len)} cm : sin ${alpha}°`, rad: len / Math.sin(alpha) },
          ];
          const c = cases[kind];
          return task(
            level,
            `In einem rechtwinkligen Dreieck ist α = ${alpha}° und die ${c.given} lang. Berechne die ${c.sought} von α.`,
            [num(`${c.sought}:`, c.value, "cm", 2, { slips: [radSlip(c.rad)] })],
            "Wähle die Funktion, die die gegebene und die gesuchte Seite enthält, und stelle um.",
            [`${c.sought} = ${c.how}`],
            `${c.sought} ${eq(c.value)} ${fmt(c.value, 2)} cm`,
            { alpha, len, kind },
            [`α = ${alpha}°, ${c.given}`],
          );
        }
        const base = rng.pick([6, 8, 10, 12, 14]);
        const angle = rng.pick([35, 40, 50, 55, 62, 68, 72]);
        const h = (base / 2) * tanD(angle);
        const leg = base / 2 / cosD(angle);
        return task(
          level,
          `Ein gleichschenkliges Dreieck hat eine ${base} cm lange Basis und Basiswinkel von ${angle}°. Berechne die Höhe auf die Basis und die Länge eines Schenkels.`,
          [num("Höhe:", h, "cm", 2, { slips: [{ value: base * tanD(angle), hint: "Die Höhe halbiert die Basis: Ankathete ist die halbe Basis." }] }), num("Schenkel:", leg, "cm", 2, { slips: [{ value: (base / 2) * cosD(angle), hint: "Der Schenkel ist die Hypotenuse: Ankathete : cos α." }] })],
          "Die Höhe teilt das Dreieck in zwei rechtwinklige Dreiecke mit der halben Basis als Ankathete.",
          [`halbe Basis: ${fmt(base / 2)} cm`, `h = ${fmt(base / 2)} cm · tan ${angle}°`, `s = ${fmt(base / 2)} cm : cos ${angle}°`],
          `h ${eq(h)} ${fmt(h, 2)} cm, s ${eq(leg)} ${fmt(leg, 2)} cm`,
          { base, angle },
        );
      },
    },
    {
      id: "figuren-koerper",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick([4, 5, 6, 8, 10]);
          const b = rng.pick([3, 5, 7, 9]);
          const alpha = atanD(b / a);
          const d = a / cosD(alpha);
          return task(
            level,
            `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne den Winkel α zwischen der Diagonale und der langen Seite ${a} cm sowie die Länge der Diagonale.`,
            [num("α =", alpha, "°", 2), num("Diagonale:", d, "cm", 2)],
            "Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke: tan α = Breite : Länge, Diagonale = Länge : cos α.",
            [`tan α = ${b} : ${a}`, `α = tan⁻¹(${fmt(b / a, 4)}) ${eq(alpha)} ${fmt(alpha, 2)}°`, `d = ${a} cm : cos α (Probe mit Pythagoras: √(${a}² + ${b}²))`],
            `α ${eq(alpha)} ${fmt(alpha, 2)}°, d ${eq(d)} ${fmt(d, 2)} cm`,
            { a, b },
          );
        }
        const a = rng.pick([6, 8, 10, 12]);
        const h = rng.pick([5, 6, 8, 9, 12]);
        const angle = atanD(h / (a / 2));
        const hs = Math.hypot(h, a / 2);
        return task(
          level,
          `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Höhe h = ${h} cm. Berechne den Neigungswinkel einer Seitenfläche zur Grundfläche und die Höhe einer Seitenfläche.`,
          [num("Neigungswinkel:", angle, "°", 2, { slips: [{ value: atanD(h / a), hint: "Der Fußpunkt der Höhe liegt in der Mitte: Ankathete ist a : 2." }] }), num("Höhe der Seitenfläche:", hs, "cm", 2)],
          "Schnitt durch die Spitze senkrecht zu einer Grundkante: rechtwinkliges Dreieck mit h, a : 2 und der Seitenflächenhöhe.",
          [`Ankathete a : 2 = ${fmt(a / 2)} cm, Gegenkathete h = ${h} cm`, `tan α = ${h} : ${fmt(a / 2)}`, `h_s = ${h} cm : sin α (oder Pythagoras)`],
          `α ${eq(angle)} ${fmt(angle, 2)}°, h_s ${eq(hs)} ${fmt(hs, 2)} cm`,
          { a, h },
        );
      },
    },
  ],
});

// 4.3 Sachaufgaben ─────────────────────────────────────────────────────────

const sachaufgaben = L({
  id: "tr-3-sachaufgaben",
  title: "Sachaufgaben mit Winkelfunktionen",
  subtitle: "Steigungen, Rampen, Dächer und Höhenwinkel",
  whyItMatters:
    "Straßenbauer, Dachdecker und Zimmerleute rechnen täglich mit Winkeln: Wie steil darf eine Rampe sein? Wie lang wird ein Sparren? Eine beschriftete Skizze macht aus dem Text ein rechtwinkliges Dreieck.",
  explanationHtml: `
    <p>Vorgehen bei Sachaufgaben:</p>
    <ol>
      <li><strong>Skizze</strong> anfertigen, rechten Winkel einzeichnen, gegebene Werte und gesuchte Größe eintragen.</li>
      <li>Rechtwinkliges Dreieck mit Hypotenuse, Gegen- und Ankathete zum bekannten Winkel bestimmen.</li>
      <li>Rechnen, Einheiten beachten, Ergebnis auf Plausibilität prüfen.</li>
    </ol>
    <p><strong>Steigung in Prozent:</strong> Ein Schild „12 %“ heißt: 12 m Höhe auf 100 m waagrechter Strecke. Also tan α = 12 : 100 = 0,12 und α ≈ 6,84°. Prozent und Grad sind verschieden: 100 % Steigung sind 45°.</p>
    <p><strong>Höhenwinkel:</strong> Der Winkel zwischen der Waagrechten und der Blickrichtung nach oben. Die Augenhöhe kommt zur berechneten Höhe dazu.</p>
    <div class="example"><strong>Beispiel:</strong> Eine Rollstuhlrampe darf höchstens 6 % Steigung haben. Für 30 cm Höhe braucht man waagrecht 30 cm : 0,06 = 500 cm = 5 m. Die Rampe selbst ist √(5² + 0,3²) m ≈ 5,01 m lang; ihr Winkel ist tan<sup>−1</sup>(0,06) ≈ 3,43°.</div>
    <div class="merke"><strong>Merke:</strong> Steigung in % = tan α · 100. Erst skizzieren, dann rechnen. Höhenwinkel: Augenhöhe addieren.</div>
  `,
  formulas: [
    { name: "Steigung", html: "p % = tan α · 100 % = Höhe : waagrechte Strecke · 100 %", quantities: "α Steigungswinkel" },
  ],
  quiz: {
    question: "Ein Verkehrsschild zeigt 10 % Steigung. Was bedeutet das?",
    options: [
      "Auf 100 m waagrechter Strecke steigt die Straße um 10 m.",
      "Die Straße steigt mit einem Winkel von 10°.",
      "Auf 100 m Straße steigt die Straße um 10°.",
      "Die Straße ist am Ende 10 m hoch.",
    ],
    correctIndex: 0,
    explanation: "10 % heißt tan α = 10 : 100 = 0,1. Der Winkel ist tan⁻¹(0,1) ≈ 5,71°, nicht 10°.",
  },
  lab: lab(
    "slope",
    "Steigung als Prozent und als Winkel",
    "Wähle die waagrechte Strecke und ziehe das obere Ende der Straße. Das Schild zeigt die Steigung in Prozent, links steht der Winkel.",
    [{ type: "choice", key: "run", label: "Waagrechte Strecke", options: [100, 400, 1000].map((n) => ({ value: n, label: `${n} m` })), value: 100 }, r("h", "Höhenunterschied", 0, 500, 8, 1, "m")],
    [
      o("percent", "Steigung", (v) => (v.h / v.run) * 100, "%", 1, true),
      o("tan", "tan α", (v) => v.h / v.run, "", 4),
      o("alpha", "Steigungswinkel α", (v) => atanD(v.h / v.run), "°", 2),
    ],
    [
      { id: "hundert", text: "Baue eine Straße mit 100 % Steigung. Welcher Winkel ist das?", check: (v) => v.h === v.run },
      { id: "zwoelf", text: "Stelle auf 400 m waagrechter Strecke das Schild „12 %“ ein.", check: (v) => v.run === 400 && v.h === 48 },
      { id: "zehn-grad", text: "Finde die Steigung in Prozent, die zu 10° gehört (auf 0,05° genau).", check: (v) => Math.abs(atanD(v.h / v.run) - 10) <= 0.05 },
    ],
  ),
  exercises: [
    {
      id: "steigung",
      make: (rng, level) => {
        if (level === 1) {
          const run = rng.pick([200, 250, 400, 500, 800]);
          const pct = rng.pick([4, 5, 6, 8, 10, 12, 15]);
          const h = (run * pct) / 100;
          const alpha = atanD(pct / 100);
          return task(
            level,
            `Eine Straße steigt auf ${run} m waagrechter Strecke um ${fmt(h)} m an. Berechne die Steigung in Prozent und den Steigungswinkel.`,
            [num("Steigung:", pct, "%", 2), num("Winkel:", alpha, "°", 2, { slips: [{ value: pct, hint: "Prozent und Grad sind verschieden: α = tan⁻¹(Höhe : Strecke)." }] })],
            "Steigung = Höhe : waagrechte Strecke · 100 %; α = tan⁻¹(Höhe : Strecke)",
            [`${fmt(h)} : ${run} = ${fmt(pct / 100, 2)}, also ${pct} %`, `α = tan⁻¹(${fmt(pct / 100, 2)}) ${eq(alpha)} ${fmt(alpha, 2)}°`],
            `${pct} %, α ${eq(alpha)} ${fmt(alpha, 2)}°`,
            { run, pct },
          );
        }
        const h = rng.pick([15, 24, 30, 36, 45, 54]);
        const pct = rng.pick([5, 6]);
        const run = h / (pct / 100) / 100;
        const ramp = Math.hypot(run, h / 100);
        return task(
          level,
          `Vor einem Eingang mit ${h} cm hoher Stufe soll eine Rollstuhlrampe mit ${pct} % Steigung gebaut werden. Wie lang ist die waagrechte Strecke, wie lang die Rampe selbst? Fertige eine Skizze an.`,
          [num("waagrecht:", run, "m", 2, { slips: [{ value: run * 100, hint: "Rechne in Meter um: 100 cm = 1 m." }] }), num("Rampe:", ramp, "m", 2)],
          "Höhe : waagrechte Strecke = Steigung. Die Rampe ist die Hypotenuse (Pythagoras oder Strecke : cos α).",
          [`${pct} % = ${fmt(pct / 100, 2)}`, `${h} cm : ${fmt(pct / 100, 2)} = ${fmt(run * 100)} cm = ${fmt(run, 2)} m`, `Rampe = √(${fmt(run, 2)}² + ${fmt(h / 100, 2)}²)`],
          `${fmt(run, 2)} m waagrecht, Rampe ${eq(ramp)} ${fmt(ramp, 2)} m`,
          { h, pct },
        );
      },
    },
    {
      id: "hoehen",
      make: (rng, level) => {
        if (level === 1) {
          const d = rng.pick([15, 20, 25, 30, 40, 50]);
          const alpha = rng.pick([22, 28, 31, 35, 40, 48, 52]);
          const eye = rng.pick([1.5, 1.6, 1.7]);
          const height = d * tanD(alpha) + eye;
          return task(
            level,
            `Lena steht ${d} m von einem Turm entfernt. Sie sieht die Turmspitze unter einem Höhenwinkel von ${alpha}°. Ihre Augen sind ${fmt(eye)} m über dem Boden. Wie hoch ist der Turm?`,
            [num("Turmhöhe:", height, "m", 2, { slips: [{ value: d * tanD(alpha), hint: "Die Augenhöhe kommt noch dazu." }, radSlip(d * Math.tan(alpha) + eye)] })],
            "Gegenkathete = Abstand · tan(Höhenwinkel); dann die Augenhöhe addieren.",
            [`${d} m · tan ${alpha}° ${eq(d * tanD(alpha))} ${fmt(d * tanD(alpha), 2)} m`, `+ ${fmt(eye)} m`],
            `Turmhöhe ${eq(height)} ${fmt(height, 2)} m`,
            { d, alpha, eye },
            [`Abstand ${d} m, Höhenwinkel ${alpha}°, Augenhöhe ${fmt(eye)} m`],
          );
        }
        let width = 10;
        let rafter = 6;
        do {
          width = rng.pick([8, 9, 10, 12]);
          rafter = rng.pick([5, 5.5, 6, 6.5, 7, 7.5]);
        } while (rafter < width / 2 + 0.5);
        const alpha = acosD(width / 2 / rafter);
        const ridge = Math.sqrt(rafter * rafter - (width / 2) ** 2);
        return task(
          level,
          `Ein Zimmerer baut ein Satteldach für ein ${width} m breites Haus. Die Sparren sind vom Dachrand bis zum First ${fmt(rafter)} m lang. Berechne die Dachneigung und die Höhe des Firsts über der Dachbodenebene.`,
          [num("Dachneigung:", alpha, "°", 2, { slips: [{ value: acosD(width / rafter), hint: "Ein Sparren reicht nur über die halbe Hausbreite." }] }), num("Firsthöhe:", ridge, "m", 2)],
          "Halbe Hausbreite = Ankathete, Sparren = Hypotenuse: cos α = (Breite : 2) : Sparren.",
          [`cos α = ${fmt(width / 2)} : ${fmt(rafter)}`, `α = cos⁻¹(${fmt(width / 2 / rafter, 4)}) ${eq(alpha)} ${fmt(alpha, 2)}°`, `Firsthöhe = ${fmt(rafter)} m · sin α (oder Pythagoras)`],
          `α ${eq(alpha)} ${fmt(alpha, 2)}°, First ${eq(ridge)} ${fmt(ridge, 2)} m hoch`,
          { width, rafter },
        );
      },
    },
  ],
});

// 4.4 Einheitskreis ────────────────────────────────────────────────────────

const QUADRANTS = ["I", "II", "III", "IV"];

const einheitskreis = L({
  id: "tr-4-einheitskreis",
  title: "Sinus und Kosinus am Einheitskreis",
  subtitle: "P(cos α | sin α) und der Wertebereich",
  whyItMatters:
    "Im rechtwinkligen Dreieck gibt es nur Winkel unter 90°. Am Einheitskreis bekommen Sinus und Kosinus für jeden Winkel bis 360° einen Wert, und du siehst sofort, warum sie nie größer als 1 werden.",
  explanationHtml: `
    <p>Der <strong>Einheitskreis</strong> hat den Radius 1 und den Mittelpunkt im Ursprung. Ein Punkt P wandert vom Punkt (1 | 0) aus gegen den Uhrzeigersinn um den Winkel α.</p>
    <p>Das Dreieck aus Ursprung, P und dem Lotfußpunkt auf der x-Achse ist rechtwinklig mit der Hypotenuse 1. Also ist sin α = Gegenkathete : 1 und cos α = Ankathete : 1:</p>
    <p class="formula-line">P(cos α | sin α)</p>
    <p>Damit sind Sinus und Kosinus für alle Winkel von 0° bis 360° erklärt. Weil P auf dem Kreis mit Radius 1 liegt, gilt der <strong>Wertebereich</strong>: −1 ≤ sin α ≤ 1 und −1 ≤ cos α ≤ 1.</p>
    <table class="mini">
      <tr><th>Quadrant</th><th>I (0°–90°)</th><th>II (90°–180°)</th><th>III (180°–270°)</th><th>IV (270°–360°)</th></tr>
      <tr><td>sin α</td><td>positiv</td><td>positiv</td><td>negativ</td><td>negativ</td></tr>
      <tr><td>cos α</td><td>positiv</td><td>negativ</td><td>negativ</td><td>positiv</td></tr>
    </table>
    <div class="example"><strong>Beispiel:</strong> α = 150°: P liegt im II. Quadranten, P(−0,866 | 0,5). sin 150° = 0,5 = sin 30°, denn 150° und 30° liegen spiegelbildlich zur y-Achse. Allgemein: sin(180° − α) = sin α.</div>
    <div class="merke"><strong>Merke:</strong> Am Einheitskreis ist P(cos α | sin α). Sinus ist die y-Koordinate, Kosinus die x-Koordinate. Beide liegen immer zwischen −1 und 1.</div>
  `,
  formulas: [
    { name: "Einheitskreis", html: "P(cos α | sin α)", quantities: "Radius 1, α ab der positiven x-Achse" },
    { name: "Wertebereich", html: "−1 ≤ sin α ≤ 1, −1 ≤ cos α ≤ 1", quantities: "für alle Winkel" },
  ],
  quiz: {
    question: "Welcher Wert ist für sin α nicht möglich?",
    options: ["1,2", "−1", "0", "0,99"],
    correctIndex: 0,
    explanation: "sin α ist die y-Koordinate eines Punkts auf dem Kreis mit Radius 1. Sie liegt immer zwischen −1 und 1; 1,2 ist zu groß.",
  },
  lab: lab(
    "unit-circle",
    "Punkt auf dem Einheitskreis",
    "Ziehe P um den Kreis. Die orange Strecke ist cos α (x-Koordinate), die blaue sin α (y-Koordinate).",
    [r("alpha", "Winkel α", 0, 360, 40, 5, "°")],
    [
      o("cos", "cos α", (v) => cosD(v.alpha), "", 3),
      o("sin", "sin α", (v) => sinD(v.alpha), "", 3, true),
      o("quadrant", "Quadrant", (v) => (quadrant(v.alpha) === 0 ? "auf einer Achse" : QUADRANTS[quadrant(v.alpha) - 1]), "", 0),
    ],
    [
      { id: "unten", text: "Bringe P an den tiefsten Punkt des Kreises. Welchen Wert hat sin α dort?", check: (v) => v.alpha === 270 },
      { id: "zweiter", text: "Finde den zweiten Winkel zwischen 0° und 360° mit sin α = 0,5 (nicht 30°).", check: (v) => v.alpha === 150 },
      { id: "cos-minus-halb", text: "Stelle einen Winkel ein, bei dem cos α = −0,5 und sin α positiv ist.", check: (v) => v.alpha === 120 },
    ],
  ),
  exercises: [
    {
      id: "werte",
      make: (rng, level) => {
        if (level === 1) {
          const alpha = rng.pick([20, 50, 70, 110, 135, 160, 200, 225, 250, 290, 315, 340]);
          return task(
            level,
            `Berechne für α = ${alpha}° die Koordinaten des Punkts P auf dem Einheitskreis.`,
            [num("x = cos α =", cosD(alpha), "", 3, { slips: [radSlip(Math.cos(alpha)), { value: sinD(alpha), hint: "Die x-Koordinate ist cos α." }] }), num("y = sin α =", sinD(alpha), "", 3, { slips: [radSlip(Math.sin(alpha)), { value: cosD(alpha), hint: "Die y-Koordinate ist sin α." }] })],
            "P(cos α | sin α); Taschenrechner auf DEG.",
            [`cos ${alpha}° ≈ ${fmt(cosD(alpha), 3)}`, `sin ${alpha}° ≈ ${fmt(sinD(alpha), 3)}`],
            `P(${fmt(cosD(alpha), 3)} | ${fmt(sinD(alpha), 3)})`,
            { alpha },
          );
        }
        const s = rng.pick([0.2, 0.35, 0.5, 0.6, 0.75, 0.9]);
        const a1 = asinD(s);
        return task(
          level,
          `Für einen Winkel zwischen 0° und 360° gilt sin α = ${fmt(s, 2)}. Es gibt zwei solche Winkel. Bestimme beide mithilfe des Einheitskreises.`,
          [num("kleinerer Winkel:", a1, "°", 1), num("größerer Winkel:", 180 - a1, "°", 1, { slips: [{ value: 360 - a1, hint: "Gleiche y-Koordinate heißt: Spiegelung an der y-Achse, also 180° − α." }] })],
          "sin⁻¹ liefert den Winkel im I. Quadranten. Derselbe Sinus gehört zum Spiegelpunkt an der y-Achse: 180° − α.",
          [`α₁ = sin⁻¹(${fmt(s, 2)}) ${eq(a1, 1)} ${fmt(a1, 1)}°`, `α₂ = 180° − α₁`],
          `α₁ ${eq(a1, 1)} ${fmt(a1, 1)}°, α₂ ${eq(180 - a1, 1)} ${fmt(180 - a1, 1)}°`,
          { s },
        );
      },
    },
    {
      id: "quadranten",
      make: (rng, level) => {
        if (level === 1) {
          const alpha = rng.pick([25, 65, 100, 145, 170, 195, 240, 260, 285, 330, 355]);
          const q = quadrant(alpha);
          return task(
            level,
            `In welchem Quadranten liegt der Punkt P zum Winkel α = ${alpha}°? Welche Vorzeichen haben sin α und cos α?`,
            [choiceField("Quadrant:", QUADRANTS, q - 1), choiceField("sin α ist", ["positiv", "negativ"], q <= 2 ? 0 : 1), choiceField("cos α ist", ["positiv", "negativ"], q === 1 || q === 4 ? 0 : 1)],
            "I: 0° bis 90°, II: 90° bis 180°, III: 180° bis 270°, IV: 270° bis 360°. sin α ist die y-, cos α die x-Koordinate.",
            [`${alpha}° liegt im ${QUADRANTS[q - 1]}. Quadranten`, `y-Koordinate ${q <= 2 ? "oberhalb" : "unterhalb"} der x-Achse, x-Koordinate ${q === 1 || q === 4 ? "rechts" : "links"} der y-Achse`],
            `${QUADRANTS[q - 1]}. Quadrant, sin α ${q <= 2 ? "positiv" : "negativ"}, cos α ${q === 1 || q === 4 ? "positiv" : "negativ"}`,
            { alpha },
          );
        }
        const [x0, y0] = rng.pick([
          [0.6, 0.8],
          [0.8, 0.6],
          [0.28, 0.96],
          [0.96, 0.28],
        ]);
        const x = x0 * rng.pick([1, -1]);
        const y = y0 * rng.pick([1, -1]);
        const base = acosD(x);
        const alpha = y >= 0 ? base : 360 - base;
        return task(
          level,
          `Der Punkt P(${fmt(x, 2)} | ${fmt(y, 2)}) liegt auf dem Einheitskreis. Bestimme den Winkel α zwischen 0° und 360°, der zu P gehört.`,
          [num("α =", alpha, "°", 1, { slips: [{ value: base, hint: "cos⁻¹ liefert nur Winkel bis 180°. Liegt P unterhalb der x-Achse, ist α = 360° − cos⁻¹(x)." }] })],
          "cos α = x. cos⁻¹ gibt einen Winkel zwischen 0° und 180°; ist y negativ, gehört P zu 360° minus diesem Winkel.",
          [`cos α = ${fmt(x, 2)}, cos⁻¹(${fmt(x, 2)}) ${eq(base, 1)} ${fmt(base, 1)}°`, y >= 0 ? "y positiv: P liegt oberhalb der x-Achse" : `y negativ: α = 360° − ${fmt(base, 1)}°`],
          `α ${eq(alpha, 1)} ${fmt(alpha, 1)}°`,
          { x, y },
        );
      },
    },
  ],
});

// 4.5 Sinusfunktion ────────────────────────────────────────────────────────

const sinusfunktion = L({
  id: "tr-5-sinusfunktion",
  title: "Die Sinusfunktion",
  subtitle: "y = sin α beschreibt periodische Vorgänge",
  whyItMatters:
    "Eine Gondel im Riesenrad, ein schwingendes Pendel, der Wechselstrom aus der Steckdose: Diese Vorgänge wiederholen sich immer wieder. Die Sinusfunktion beschreibt solche periodischen Vorgänge.",
  explanationHtml: `
    <p>Ordnet man jedem Winkel α den Wert sin α zu, entsteht die <strong>Sinusfunktion</strong> y = sin α. Ihr Graph ist eine Welle:</p>
    <ul>
      <li>Nach einer vollen Umdrehung (360°) wiederholen sich alle Werte: Die <strong>Periode</strong> ist 360°.</li>
      <li>Der Wertebereich ist −1 ≤ y ≤ 1. Das Maximum 1 liegt bei 90°, das Minimum −1 bei 270° (und jeweils 360° später).</li>
      <li>Nullstellen liegen bei 0°, 180°, 360°, 540°, …</li>
    </ul>
    <p>Bei einem <strong>Riesenrad</strong> mit dem Radius r startet eine Gondel auf Höhe der Achse. Nach einer Drehung um α ist sie r · sin α über der Achse (bei negativem Wert darunter). So beschreibt die Sinusfunktion auch ein Pendel oder eine Schaukel, die hin und her schwingt.</p>
    <div class="example"><strong>Beispiel:</strong> Riesenrad mit r = 20 m, die Achse ist 22 m über dem Boden. Nach α = 30°: 22 m + 20 m · sin 30° = 22 m + 10 m = 32 m. Nach α = 210°: 22 m + 20 m · (−0,5) = 12 m. Nach α = 390° ist die Gondel wieder auf 32 m, denn 390° = 30° + 360°.</div>
    <div class="merke"><strong>Merke:</strong> y = sin α hat die Periode 360°, den Wertebereich −1 ≤ y ≤ 1, Maxima bei 90° + k · 360° und Nullstellen bei 0°, 180°, 360°, …</div>
  `,
  formulas: [
    { name: "Sinusfunktion", html: "y = sin α", quantities: "Periode 360°, −1 ≤ y ≤ 1" },
  ],
  quiz: {
    question: "Nach wie viel Grad wiederholen sich die Werte der Funktion y = sin α?",
    options: ["360°", "180°", "90°", "720°"],
    correctIndex: 0,
    explanation: "Nach einer vollen Umdrehung um 360° ist der Punkt auf dem Einheitskreis wieder an derselben Stelle. Nach 180° hat sin α nur denselben Betrag mit anderem Vorzeichen.",
  },
  lab: lab(
    "sine-wave",
    "Vom Kreis zur Welle",
    "Ziehe den Punkt auf dem Kreis oder auf dem Graphen bis 720°. Seine Höhe über der Achse ist sin α.",
    [r("alpha", "Winkel α", 0, 720, 60, 5, "°")],
    [o("sin", "sin α", (v) => sinD(v.alpha), "", 3, true), o("turns", "Umdrehungen", (v) => v.alpha / 360, "", 2)],
    [
      { id: "hoch-zwei", text: "Stelle den höchsten Punkt in der zweiten Umdrehung ein.", check: (v) => v.alpha === 450 },
      { id: "nullstelle", text: "Stelle die Nullstelle zwischen 0° und 360° ein, die nicht am Rand liegt.", check: (v) => v.alpha === 180 },
      { id: "periode", text: "Gehe von 30° aus genau eine Periode weiter.", check: (v) => v.alpha === 390 },
    ],
  ),
  exercises: [
    {
      id: "graph",
      make: (rng, level) => {
        if (level === 1) {
          const alpha = rng.pick([15, 40, 75, 120, 160, 200, 250, 300, 330]);
          return task(
            level,
            `Berechne den Funktionswert y = sin α für α = ${alpha}°. Bei welchem Winkel zwischen 360° und 720° hat die Funktion denselben Wert wegen der Periode?`,
            [num("y =", sinD(alpha), "", 3, { slips: [radSlip(Math.sin(alpha))] }), num("Winkel:", alpha + 360, "°", 0)],
            "Taschenrechner auf DEG. Die Periode ist 360°: sin(α + 360°) = sin α.",
            [`sin ${alpha}° ≈ ${fmt(sinD(alpha), 3)}`, `${alpha}° + 360° = ${alpha + 360}°`],
            `y ≈ ${fmt(sinD(alpha), 3)}, auch bei ${alpha + 360}°`,
            { alpha },
          );
        }
        const s = rng.pick([0.5, -0.5, 0.8, -0.3, 0.25, -0.75]);
        const base = asinD(Math.abs(s));
        const [a1, a2] = s > 0 ? [base, 180 - base] : [180 + base, 360 - base];
        return task(
          level,
          `Für welche Winkel α zwischen 0° und 360° gilt sin α = ${fmt(s, 2)}? Gib beide Winkel an. Nutze den Graphen oder den Einheitskreis.`,
          [num("kleinerer Winkel:", a1, "°", 1, { slips: s < 0 ? [{ value: asinD(s), hint: "Der Taschenrechner gibt einen negativen Winkel. Gesucht sind Winkel zwischen 0° und 360°." }] : [] }), num("größerer Winkel:", a2, "°", 1)],
          s > 0 ? "Positiver Sinus: I. und II. Quadrant, also α und 180° − α." : "Negativer Sinus: III. und IV. Quadrant, also 180° + α₀ und 360° − α₀ mit α₀ = sin⁻¹ des Betrags.",
          [`α₀ = sin⁻¹(${fmt(Math.abs(s), 2)}) ${eq(base, 1)} ${fmt(base, 1)}°`, s > 0 ? `180° − ${fmt(base, 1)}°` : `180° + ${fmt(base, 1)}° und 360° − ${fmt(base, 1)}°`],
          `α₁ ${eq(a1, 1)} ${fmt(a1, 1)}°, α₂ ${eq(a2, 1)} ${fmt(a2, 1)}°`,
          { s },
        );
      },
    },
    {
      id: "riesenrad",
      make: (rng, level) => {
        const r0 = rng.pick([10, 15, 20, 25]);
        const axle = r0 + 2;
        if (level === 1) {
          const alpha = rng.pick([30, 45, 60, 135, 210, 240, 300, 330]);
          const height = axle + r0 * sinD(alpha);
          return task(
            level,
            `Ein Riesenrad hat den Radius ${r0} m, seine Achse ist ${axle} m über dem Boden. Eine Gondel startet auf Höhe der Achse und dreht sich um α = ${alpha}°. Wie hoch über dem Boden ist sie?`,
            [num("Höhe:", height, "m", 2, { slips: [{ value: r0 * sinD(alpha), hint: "Das ist die Höhe über der Achse. Die Achsenhöhe kommt dazu." }] })],
            "Höhe = Achsenhöhe + r · sin α",
            [`${r0} m · sin ${alpha}° ${eq(r0 * sinD(alpha))} ${fmt(r0 * sinD(alpha), 2)} m`, `${axle} m + (${fmt(r0 * sinD(alpha), 2)} m)`],
            `Höhe ${eq(height)} ${fmt(height, 2)} m`,
            { r0, alpha },
            [`r = ${r0} m, Achse ${axle} m, α = ${alpha}°`],
          );
        }
        const T = rng.pick([8, 10, 12, 20]);
        const t = rng.int(1, T - 1);
        const alpha = (360 * t) / T;
        const height = axle + r0 * sinD(alpha);
        return task(
          level,
          `Ein Riesenrad mit ${r0} m Radius braucht für eine Umdrehung ${T} Minuten; seine Achse ist ${axle} m hoch. Eine Gondel startet auf Achsenhöhe und fährt zuerst nach oben. Wie hoch ist sie nach ${t} Minuten? Nach wie vielen Minuten ist sie zum ersten Mal ganz oben?`,
          [num("Höhe:", height, "m", 2), num("ganz oben nach:", T / 4, "min", 2, { slips: [{ value: T / 2, hint: "Ganz oben ist die Gondel nach einer Vierteldrehung (90°)." }] })],
          "Winkel nach t Minuten: α = 360° · t : T. Höhe = Achse + r · sin α. Ganz oben bei α = 90°.",
          [`α = 360° · ${t} : ${T} = ${fmt(alpha, 2)}°`, `Höhe = ${axle} m + ${r0} m · sin ${fmt(alpha, 2)}°`, `90° von 360° ist ein Viertel: ${T} min : 4`],
          `Höhe ${eq(height)} ${fmt(height, 2)} m, ganz oben nach ${fmt(T / 4, 2)} min`,
          { r0, T, t },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  4,
  "Sinus, Kosinus, Tangens, Sachaufgaben, Einheitskreis und Sinusfunktion",
  "#1d4ed8",
  "∠",
  [verhaeltnisse, berechnen, sachaufgaben, einheitskreis, sinusfunktion],
);
