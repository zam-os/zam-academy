import { fmt, fmtUnit } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { CUTS, FIGURES, ropeGamma, ropeSides, rightTriangleCount, thalesAlpha, thalesGamma } from "../lab/views-geometrie";
import { pyramidSolid, regularPolygon, SOLIDS, squarePyramid } from "../models";
import { BOTH, choice, lab, M_ONLY, makeLesson, makeStage, output as o, range as r, task } from "./builders";
import { choiceField, numberField as num, yesNo } from "./helpers";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(3, content);
const cm = (value: number, digits = 2) => fmtUnit(value, "cm", digits);
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
/** "=" for exact results, "≈" for rounded ones. */
const eq = (value: number, digits = 2) => (near(value, Number(value.toFixed(digits))) ? "=" : "≈");

/** Pythagorean triples (legs first). */
const TRIPLES: Array<[number, number, number]> = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
  [20, 21, 29],
  [9, 40, 41],
];

/** A right triangle: a triple, or legs in half centimetres. */
function rightTriangle(rng: Rng): { a: number; b: number; c: number } {
  if (rng.next() < 0.5) {
    const [a, b, c] = rng.pick(TRIPLES);
    return rng.next() < 0.5 ? { a, b, c } : { a: b, b: a, c };
  }
  const a = rng.int(4, 24) / 2;
  const b = rng.int(4, 24) / 2;
  return { a, b, c: Math.hypot(a, b) };
}

/** Vertex names for triangles with other letters. */
const NAME_SETS = [
  ["A", "B", "C"],
  ["P", "Q", "R"],
  ["D", "E", "F"],
  ["K", "L", "M"],
  ["X", "Y", "Z"],
];

/**
 * Level-1 cuts whose answer follows from the kind of figure alone. Each names
 * the lab figure and cut it matches; a test compares the counts with the lab.
 */
export const PART_TASKS: Array<{ fig: number; cut: number; text: string; why: string }> = [
  { fig: 0, cut: 0, text: "Ein Quadrat wird entlang einer Diagonale zerschnitten.", why: "Jede Hälfte enthält eine Quadratecke mit ihrem rechten Winkel." },
  { fig: 0, cut: 2, text: "Ein Quadrat wird entlang beider Diagonalen zerschnitten.", why: "Die Diagonalen des Quadrats stehen senkrecht aufeinander: Alle vier Teildreiecke haben im Schnittpunkt einen rechten Winkel." },
  { fig: 1, cut: 0, text: "Ein Rechteck, das kein Quadrat ist, wird entlang einer Diagonale zerschnitten.", why: "Jede Hälfte enthält eine Rechteckecke mit ihrem rechten Winkel." },
  { fig: 1, cut: 2, text: "Ein Rechteck, das kein Quadrat ist, wird entlang beider Diagonalen zerschnitten.", why: "Die Diagonalen teilen jede Rechteckecke und stehen nicht senkrecht aufeinander: Keines der vier Teildreiecke hat einen rechten Winkel." },
  { fig: 2, cut: 2, text: "Ein Drachenviereck wird entlang beider Diagonalen zerschnitten.", why: "Die Diagonalen des Drachenvierecks stehen senkrecht aufeinander: Alle vier Teildreiecke haben im Schnittpunkt einen rechten Winkel." },
  { fig: 3, cut: 1, text: "Im Parallelogramm ABCD trifft die Höhe von D die Seite AB zwischen A und B. Entlang dieser Höhe wird ein Stück abgeschnitten.", why: "Die Höhe steht senkrecht auf AB: Das abgeschnittene Dreieck hat am Fußpunkt einen rechten Winkel, der Rest ist ein Viereck." },
  { fig: 4, cut: 1, text: "Im Trapez ABCD mit AB ∥ CD trifft die Höhe von D die Seite AB zwischen A und B. Entlang dieser Höhe wird ein Stück abgeschnitten.", why: "Die Höhe steht senkrecht auf AB: Das abgeschnittene Dreieck hat am Fußpunkt einen rechten Winkel, der Rest ist ein Viereck." },
];

// 3.1 Rechtwinklige Dreiecke erkennen ──────────────────────────────────────

const rechtwinklig = L({
  id: "ge-1-rechtwinklige-dreiecke",
  title: "Rechtwinklige Dreiecke erkennen",
  subtitle: "Hypotenuse und Katheten, auch in Vierecken",
  tracks: BOTH,
  whyItMatters:
    "Dachgiebel, Treppen, Leitern, Bildschirme: Überall stecken rechtwinklige Dreiecke. Wer sie in einer Figur findet und ihre Seiten richtig benennt, kann später fehlende Längen mit dem Satz des Pythagoras berechnen.",
  explanationHtml: `
    <p>Ein Dreieck mit einem rechten Winkel (90°) heißt <strong>rechtwinklig</strong>. Seine Seiten haben eigene Namen:</p>
    <ul>
      <li>Die <strong>Hypotenuse</strong> liegt dem rechten Winkel gegenüber. Sie ist die längste Seite.</li>
      <li>Die beiden <strong>Katheten</strong> bilden den rechten Winkel.</li>
    </ul>
    <p>Welche Seite die Hypotenuse ist, hängt von der Beschriftung ab: Ist γ = 90°, dann ist c die Hypotenuse und a, b sind die Katheten. Ist β = 90°, dann ist b die Hypotenuse. Die beiden spitzen Winkel ergänzen sich zu 90°, denn alle drei Winkel zusammen ergeben 180°.</p>
    <p><strong>Teilfiguren:</strong> Eine Diagonale zerlegt ein Rechteck oder Quadrat in zwei rechtwinklige Dreiecke. Im Drachenviereck und in der Raute stehen die Diagonalen senkrecht aufeinander, sie ergeben vier rechtwinklige Dreiecke. Von einem Parallelogramm oder Trapez schneidet eine Höhe ein rechtwinkliges Dreieck ab.</p>
    <div class="example"><strong>Beispiel:</strong> Zeichne ein rechtwinkliges Dreieck mit den Katheten a = 4 cm und b = 3 cm: Zeichne b = CA = 3 cm. Lege das Geodreieck mit der Mittellinie auf b und dem Nullpunkt an C. Zeichne an der senkrechten Linie a = CB = 4 cm. Verbinde A und B: AB ist die Hypotenuse.<br>
    Im rechtwinkligen Dreieck mit α = 35° ist β = 90° − 35° = 55°.</div>
    <div class="merke"><strong>Merke:</strong> Die Hypotenuse liegt dem rechten Winkel gegenüber und ist die längste Seite; die Katheten bilden den rechten Winkel. Die zwei spitzen Winkel ergeben zusammen 90°.</div>
  `,
  formulas: [
    { name: "Hypotenuse", html: "Seite gegenüber dem rechten Winkel", quantities: "die längste Seite des rechtwinkligen Dreiecks" },
    { name: "Spitze Winkel", html: "α + β = 90°, wenn γ = 90°", quantities: "Winkelsumme im Dreieck: 180°" },
  ],
  quiz: {
    question: "Im Dreieck ABC ist der Winkel bei A ein rechter Winkel. Welche Seite ist die Hypotenuse?",
    options: ["a", "b", "c", "die längste Kathete"],
    correctIndex: 0,
    explanation: "Die Hypotenuse liegt dem rechten Winkel gegenüber. Gegenüber von A liegt die Seite a = BC.",
  },
  lab: lab(
    "right-parts",
    "Rechtwinklige Dreiecke in Vierecken",
    "Wähle ein Viereck und eine Zerlegung. Grüne Teile sind rechtwinklige Dreiecke: die Katheten blau und orange, die Hypotenuse lila.",
    [choice("fig", "Viereck", FIGURES, 4), choice("cut", "Zerlegung", CUTS, 0)],
    [
      o("anzahl", "rechtwinklige Dreiecke", (v) => rightTriangleCount(v.fig, v.cut), "", 0, true),
      o("figur", "Figur", (v) => `${FIGURES[v.fig]}, ${CUTS[v.cut]}`),
    ],
    [
      { id: "rechteck", text: "Zerlege ein Rechteck mit einer Diagonale in zwei rechtwinklige Dreiecke.", check: (v) => v.fig === 1 && v.cut === 0 },
      { id: "drachen", text: "Finde ein Viereck ohne rechten Winkel, das beide Diagonalen in vier rechtwinklige Dreiecke zerlegen.", check: (v) => v.fig === 2 && v.cut === 2 },
      { id: "parallelogramm", text: "Schneide mit einer Höhe ein rechtwinkliges Dreieck von einem Parallelogramm ab.", check: (v) => v.fig === 3 && v.cut === 1 },
    ],
  ),
  exercises: [
    {
      id: "hypotenuse",
      make: (rng, level) => {
        if (level === 1) {
          const names = rng.pick(NAME_SETS);
          const right = rng.int(0, 2);
          const sides = names.map((n) => n.toLowerCase());
          const acute = rng.int(15, 75);
          const other = (right + 1) % 3;
          const third = (right + 2) % 3;
          const greek = ["α", "β", "γ"];
          return task(
            level,
            `Im Dreieck ${names.join("")} ist der Winkel bei ${names[right]} ein rechter Winkel. Welche Seite ist die Hypotenuse? Der Winkel bei ${names[other]} beträgt ${acute}°. Wie groß ist der Winkel bei ${names[third]}?`,
            [choiceField("Hypotenuse:", [sides[right], sides[other], sides[third]], 0), num(`Winkel bei ${names[third]}:`, 90 - acute, "°", 0, { slips: [{ value: 180 - acute, hint: "Der rechte Winkel gehört auch zur Winkelsumme: 180° − 90° − Winkel." }] })],
            "Die Hypotenuse liegt dem rechten Winkel gegenüber; die Seite gegenüber einer Ecke trägt deren kleinen Buchstaben. Die spitzen Winkel ergänzen sich zu 90°.",
            [`Gegenüber von ${names[right]} liegt die Seite ${sides[right]}.`, `${greek[third]}: 180° − 90° − ${acute}° = ${90 - acute}°`],
            `Hypotenuse ${sides[right]}, Winkel bei ${names[third]}: ${90 - acute}°`,
            { right, acute },
          );
        }
        const kind = rng.int(0, 2);
        const angle = rng.int(20, 70);
        if (kind === 0)
          return task(
            level,
            `Im Rechteck ABCD wird die Diagonale BD gezeichnet. Welche Strecke ist im Dreieck ABD die Hypotenuse? Der Winkel ∢ABD beträgt ${angle}°. Wie groß ist ∢ADB?`,
            [choiceField("Hypotenuse:", ["BD", "AB", "AD"], 0), num("∢ADB =", 90 - angle, "°", 0)],
            "Im Rechteck ist der Winkel bei A ein rechter. Ihm gegenüber liegt die Diagonale.",
            ["Das Dreieck ABD hat bei A einen rechten Winkel, also ist BD die Hypotenuse.", `∢ADB = 90° − ${angle}° = ${90 - angle}°`],
            `BD; ∢ADB = ${90 - angle}°`,
            { angle },
          );
        if (kind === 1)
          return task(
            level,
            `Die Diagonalen des Drachenvierecks ABCD schneiden sich im Punkt S. Welche Strecke ist im Teildreieck ABS die Hypotenuse? Wie viele rechtwinklige Dreiecke bilden die beiden Diagonalen zusammen?`,
            [choiceField("Hypotenuse:", ["AB", "AS", "BS"], 0), num("Anzahl:", 4, "", 0, { slips: [{ value: 2, hint: "Beide Diagonalen zusammen zerlegen den Drachen in vier Teildreiecke." }] })],
            "Im Drachenviereck stehen die Diagonalen senkrecht aufeinander. Der rechte Winkel liegt bei S.",
            ["Der rechte Winkel liegt bei S, gegenüber liegt AB.", "Die Diagonalen zerlegen den Drachen in vier rechtwinklige Dreiecke."],
            "AB; vier rechtwinklige Dreiecke",
            {},
          );
        const base = rng.int(25, 70);
        return task(
          level,
          `Ein Hausgiebel ist ein gleichschenkliges Dreieck mit den Basiswinkeln ${base}°. Die Höhe vom First auf den Dachboden teilt ihn in zwei rechtwinklige Dreiecke. Wie groß ist in einem dieser Dreiecke der Winkel am First? Welche Strecke ist dort die Hypotenuse?`,
          [num("Winkel am First:", 90 - base, "°", 0, { slips: [{ value: 180 - 2 * base, hint: "Das ist der ganze Winkel am First. Die Höhe teilt ihn in zwei Hälften." }] }), choiceField("Hypotenuse:", ["die schräge Dachseite", "die Höhe", "die halbe Dachbodenbreite"], 0)],
          "Die Höhe steht senkrecht auf dem Dachboden. Die beiden spitzen Winkel im Teildreieck ergänzen sich zu 90°.",
          [`Im Teildreieck: 90° − ${base}° = ${90 - base}°`, "Der rechte Winkel liegt am Fuß der Höhe, gegenüber liegt die schräge Dachseite."],
          `${90 - base}°; die schräge Dachseite`,
          { base },
        );
      },
    },
    {
      id: "teilfiguren",
      make: (rng, level) => {
        if (level === 1) {
          const { fig, cut, text: situation, why } = rng.pick(PART_TASKS);
          const count = rightTriangleCount(fig, cut);
          return task(
            level,
            `${situation} Wie viele rechtwinklige Dreiecke entstehen dabei?`,
            [num("Anzahl:", count, "", 0)],
            "Diagonalen von Quadrat, Raute und Drachen stehen senkrecht aufeinander. Eine Diagonale im Rechteck ergibt zwei rechtwinklige Dreiecke. Eine Höhe steht senkrecht auf einer Seite.",
            [why],
            `${count} rechtwinklige ${count === 1 ? "Dreieck" : "Dreiecke"}`,
            { fig, cut },
          );
        }
        const a = rng.int(3, 9);
        const b = a + rng.int(1, 5);
        return task(
          level,
          `Ein Fliesenleger schneidet eine rechteckige Fliese (${a} dm × ${b} dm) entlang einer Diagonale durch. Wie viele rechtwinklige Dreiecke erhält er? Wie lang ist die längere Kathete eines Teilstücks, und welche Strecke ist die Hypotenuse?`,
          [num("Anzahl:", 2, "", 0), num("längere Kathete:", b, "dm", 0), choiceField("Hypotenuse:", ["die Diagonale", "die kurze Seite", "die lange Seite"], 0)],
          "Die Diagonale zerlegt das Rechteck in zwei gleiche rechtwinklige Dreiecke. Die Rechteckseiten sind die Katheten.",
          ["Zwei Teildreiecke mit je einem rechten Winkel einer Rechteckecke.", `Katheten: ${a} dm und ${b} dm; Hypotenuse: die Diagonale.`],
          `2 Dreiecke; längere Kathete ${b} dm; Hypotenuse ist die Diagonale`,
          { a, b },
        );
      },
    },
  ],
});

// 3.2 Der Thaleskreis (M9) ────────────────────────────────────────────────

const thaleskreis = L({
  id: "ge-2-thaleskreis",
  title: "Der Thaleskreis",
  subtitle: "Jeder Punkt auf dem Halbkreis gibt einen rechten Winkel",
  tracks: M_ONLY,
  whyItMatters:
    "Mit dem Thaleskreis zeichnest du rechtwinklige Dreiecke genau, auch wenn nur die Hypotenuse gegeben ist. Handwerker nutzen die Idee, um mit einem Seil einen rechten Winkel abzustecken.",
  explanationHtml: `
    <p><strong>Satz des Thales:</strong> Liegt der Punkt C auf dem Kreis mit dem Durchmesser AB, dann hat das Dreieck ABC bei C einen rechten Winkel. Dieser Halbkreis heißt <strong>Thaleskreis</strong> über AB. Umgekehrt gilt: Hat ein Dreieck bei C einen rechten Winkel, liegt C auf dem Thaleskreis über der Hypotenuse.</p>
    <p><strong>Warum?</strong> Der Mittelpunkt M von AB ist von A, B und C gleich weit entfernt. Die Strecke MC zerlegt das Dreieck in zwei gleichschenklige Dreiecke mit den Basiswinkeln α und β. Die Winkelsumme ergibt α + β + (α + β) = 180°, also ist α + β = 90° und damit γ = 90°.</p>
    <div class="example"><strong>Beispiel:</strong> Ein rechtwinkliges Dreieck mit der Hypotenuse c = 8 cm und der Kathete b = 5 cm: Zeichne AB = 8 cm, halbiere AB (M), zeichne den Halbkreis um M mit r = 4 cm. Ein Kreisbogen um A mit 5 cm schneidet den Halbkreis in C.<br>
    Liegt C innerhalb des Kreises, ist der Winkel bei C stumpf, liegt C außerhalb, ist er spitz.</div>
    <div class="merke"><strong>Merke:</strong> Jeder Punkt C auf dem Halbkreis über AB (außer A und B) bildet mit A und B einen rechten Winkel. Die Hypotenuse ist der Durchmesser, ihr Mittelpunkt ist der Kreismittelpunkt.</div>
  `,
  formulas: [
    { name: "Satz des Thales", html: "C auf dem Kreis mit Durchmesser AB ⇒ γ = 90°", quantities: "Radius r = c : 2, Mittelpunkt M in der Mitte von AB" },
  ],
  quiz: {
    question: "C liegt auf dem Thaleskreis über AB, und α = 40°. Wie groß ist β?",
    options: ["50°", "40°", "90°", "140°"],
    correctIndex: 0,
    explanation: "Auf dem Thaleskreis ist γ = 90°. Also bleibt β = 180° − 90° − 40° = 50°.",
  },
  lab: lab(
    "thales",
    "Der Halbkreis über AB",
    "Ziehe C am Kreis entlang: Der Winkel bei C bleibt 90°. Lege C mit der Auswahl auch in den Kreis hinein oder aus ihm heraus.",
    [r("c", "Hypotenuse c = AB", 4, 12, 6, 1, "cm"), r("phi", "Lage von C (Winkel bei M)", 10, 170, 120, 1, "°"), { type: "choice", key: "rf", label: "C liegt", options: [{ value: 0.7, label: "im Kreis" }, { value: 1, label: "auf dem Kreis" }, { value: 1.3, label: "außerhalb" }], value: 1 }],
    [
      o("gamma", "Winkel bei C", (v) => thalesGamma(v), "°", 1, true),
      o("alpha", "Winkel bei A", (v) => thalesAlpha(v), "°", 1),
    ],
    [
      { id: "gleichschenklig", text: "Erzeuge ein gleichschenklig-rechtwinkliges Dreieck.", check: (v) => v.rf === 1 && v.phi === 90 },
      { id: "dreissig", text: "Erzeuge ein rechtwinkliges Dreieck mit c = 8 cm und α = 30°.", check: (v) => v.rf === 1 && v.c === 8 && v.phi === 60 },
      { id: "stumpf", text: "Lege C so, dass der Winkel bei C stumpf wird.", check: (v) => thalesGamma(v) > 90.05 },
    ],
  ),
  exercises: [
    {
      id: "winkel",
      make: (rng, level) => {
        if (level === 1) {
          const alpha = rng.int(15, 75);
          return task(
            level,
            `Der Punkt C liegt auf dem Thaleskreis über der Strecke AB. Der Winkel α beträgt ${alpha}°. Berechne γ und β.`,
            [num("γ =", 90, "°", 0), num("β =", 90 - alpha, "°", 0, { slips: [{ value: 180 - alpha, hint: "Vergiss den rechten Winkel bei C nicht: 180° − 90° − α." }] })],
            "Auf dem Thaleskreis ist der Winkel bei C ein rechter. Winkelsumme 180°.",
            ["C auf dem Thaleskreis: γ = 90°", `β = 180° − 90° − ${alpha}°`],
            `γ = 90°, β = ${90 - alpha}°`,
            { alpha },
          );
        }
        const mu = 2 * rng.int(20, 70);
        const alpha = (180 - mu) / 2;
        return task(
          level,
          `M ist der Mittelpunkt der Strecke AB, und C liegt auf dem Kreis um M durch A und B. Der Winkel ∢AMC beträgt ${mu}°. Berechne die Winkel α, β und γ des Dreiecks ABC.`,
          [num("α =", alpha, "°", 0, { slips: [{ value: mu / 2, hint: "Das Dreieck AMC ist gleichschenklig (MA = MC). Seine Basiswinkel sind (180° − ∢AMC) : 2." }] }), num("β =", 90 - alpha, "°", 0), num("γ =", 90, "°", 0)],
          "MA = MC = MB: Die Dreiecke AMC und MBC sind gleichschenklig. Nutze die Basiswinkel und den Satz des Thales.",
          [`Dreieck AMC ist gleichschenklig: α = (180° − ${mu}°) : 2 = ${alpha}°`, "Satz des Thales: γ = 90°", `β = 90° − ${alpha}° = ${90 - alpha}°`],
          `α = ${alpha}°, β = ${90 - alpha}°, γ = 90°`,
          { mu },
        );
      },
    },
    {
      id: "pruefen",
      make: (rng, level) => {
        if (level === 1) {
          const rr = rng.pick([5, 10, 13]);
          const on = rr === 5 ? [[3, 4], [4, 3], [0, 5]] : rr === 10 ? [[6, 8], [8, 6], [0, 10]] : [[5, 12], [12, 5], [0, 13]];
          const off = rr === 5 ? [[2, 4], [4, 4], [1, 4]] : rr === 10 ? [[6, 7], [7, 8], [5, 9]] : [[5, 11], [10, 8], [6, 12]];
          const isOn = rng.next() < 0.5;
          const [x0, y] = rng.pick(isOn ? on : off);
          const x = rng.next() < 0.5 ? -x0 : x0;
          const dist = Math.hypot(x, y);
          return task(
            level,
            `Gegeben sind A(${fmt(-rr)} | 0), B(${rr} | 0) und C(${fmt(x)} | ${y}). Der Mittelpunkt von AB ist M(0 | 0). Wie weit ist C von M entfernt? Hat das Dreieck ABC bei C einen rechten Winkel?`,
            [num("MC =", dist, "", 2), yesNo("rechter Winkel bei C?", isOn)],
            "MC = √(x² + y²). Ist MC so lang wie MA (der Radius), liegt C auf dem Thaleskreis.",
            [`MC = √(${fmt(x)}² + ${y}²) ${eq(dist)} ${fmt(dist, 2)}`, `Radius MA = ${rr}. ${isOn ? "C liegt auf dem Thaleskreis." : "C liegt nicht auf dem Thaleskreis."}`],
            `MC ${eq(dist)} ${fmt(dist, 2)}; ${isOn ? "ja, rechter Winkel" : "nein, kein rechter Winkel"}`,
            { x, y },
          );
        }
        const length = rng.pick([1.6, 2, 2.4, 3, 3.6, 4]);
        const rope = rng.pick([length / 2, length / 2 + 0.2, length / 2 - 0.2]);
        const right = near(rope, length / 2);
        return task(
          level,
          `Eine Gärtnerin will an einem ${fmtUnit(length, "m")} langen Brett AB einen rechten Winkel abstecken. Sie befestigt in der Mitte M des Bretts ein Seil und markiert damit Punkte C, die ${fmtUnit(rope, "m", 1)} von M entfernt sind. Wie lang muss das Seil sein, damit jeder Punkt C mit A und B einen rechten Winkel bildet? Klappt es mit ihrem Seil?`,
          [num("nötige Seillänge:", length / 2, "m", 2), yesNo("klappt es?", right)],
          "Thaleskreis: C muss so weit von M entfernt sein wie A und B, also die halbe Brettlänge.",
          [`Radius = AB : 2 = ${fmtUnit(length / 2, "m")}`, right ? "Das Seil ist genau so lang." : `Das Seil ist ${fmtUnit(rope, "m", 1)} lang, also nicht passend.`],
          `${fmtUnit(length / 2, "m")}; ${right ? "ja" : "nein"}`,
          { length },
        );
      },
    },
  ],
});

// 3.3 Der Satz des Pythagoras ──────────────────────────────────────────────

const pythagoras = L({
  id: "ge-3-pythagoras",
  title: "Der Satz des Pythagoras",
  subtitle: "Kathete² + Kathete² = Hypotenuse²",
  tracks: BOTH,
  whyItMatters:
    "Mit dem Satz des Pythagoras berechnest du eine fehlende Seite im rechtwinkligen Dreieck, ohne zu messen: die Länge einer Leiter, die Diagonale eines Bildschirms, eine Dachschräge. Er ist einer der wichtigsten Sätze der Geometrie.",
  explanationHtml: `
    <p><strong>Satz des Pythagoras:</strong> In jedem rechtwinkligen Dreieck ist die Summe der Flächeninhalte der Quadrate über den beiden Katheten genauso groß wie der Flächeninhalt des Quadrats über der Hypotenuse:</p>
    <p class="formula-line">Kathete² + Kathete² = Hypotenuse²</p>
    <p>Mit γ = 90° heißt das a² + b² = c². Bei anderer Beschriftung ändern sich die Buchstaben: Ist α = 90°, so ist a die Hypotenuse und b² + c² = a². Suche deshalb immer zuerst die Hypotenuse.</p>
    <div class="example"><strong>Beispiel:</strong> Katheten a = 6 cm und b = 8 cm. c² = 6² + 8² = 36 + 64 = 100, also c = √100 = 10 cm.<br>
    Kathete gesucht: c = 13 cm, a = 5 cm. b² = c² − a² = 169 − 25 = 144, also b = 12 cm.<br>
    Mit Taschenrechner: a = 4 cm, b = 7 cm: c = √(16 + 49) = √65 ≈ 8,06 cm.</div>
    <p>Der Puzzle-Beweis im Labor zeigt, warum der Satz stimmt: Vier gleiche Dreiecke lassen in einem großen Quadrat entweder c² oder a² + b² frei.</p>
    <div class="merke"><strong>Merke:</strong> Hypotenuse gesucht: Quadrate der Katheten addieren, dann Wurzel ziehen. Kathete gesucht: Quadrat der anderen Kathete vom Quadrat der Hypotenuse subtrahieren, dann Wurzel ziehen. Der Satz gilt nur im rechtwinkligen Dreieck.</div>
  `,
  formulas: [
    { name: "Satz des Pythagoras", html: "a² + b² = c² (γ = 90°)", quantities: "a, b Katheten, c Hypotenuse" },
    { name: "Umgestellt", html: "c = √(a² + b²); a = √(c² − b²)", quantities: "Hypotenuse: addieren; Kathete: subtrahieren" },
  ],
  quiz: {
    question: "Im Dreieck ABC ist β = 90°, a = 9 cm und c = 12 cm. Wie lang ist b?",
    options: ["15 cm", "√63 cm ≈ 7,94 cm", "21 cm", "3 cm"],
    correctIndex: 0,
    explanation: "Bei β = 90° ist b die Hypotenuse: b² = a² + c² = 81 + 144 = 225, also b = 15 cm.",
  },
  lab: lab(
    "pythagoras",
    "Quadrate an den Seiten",
    "Ziehe die Ecken A und B. Die Flächen der blauen und der orangen Quadrate ergeben zusammen immer die lila Fläche. Im Puzzle-Beweis verschiebst du vier gleiche Dreiecke.",
    [
      r("a", "Kathete a", 1, 9, 3, 0.5, "cm"),
      r("b", "Kathete b", 1, 9, 2, 0.5, "cm"),
      { type: "choice", key: "view", label: "Ansicht", options: [{ value: 0, label: "Quadrate an den Seiten" }, { value: 1, label: "Puzzle-Beweis" }], value: 0 },
      { ...r("puzzle", "Dreiecke verschieben", 0, 100, 0, 1, "%"), showIf: (v: Record<string, number>) => v.view === 1 },
    ],
    [
      o("a2", "a²", (v) => v.a * v.a, "cm²", 2),
      o("b2", "b²", (v) => v.b * v.b, "cm²", 2),
      o("c2", "c² = a² + b²", (v) => v.a * v.a + v.b * v.b, "cm²", 2),
      o("c", "Hypotenuse c", (v) => Math.hypot(v.a, v.b), "cm", 2, true),
    ],
    [
      { id: "zehn", text: "Stelle ein rechtwinkliges Dreieck mit der Hypotenuse c = 10 cm ein.", check: (v) => near(Math.hypot(v.a, v.b), 10) },
      { id: "fuenfzig", text: "Erzeuge ein Dreieck, bei dem das Quadrat über der Hypotenuse genau 50 cm² groß ist.", check: (v) => near(v.a * v.a + v.b * v.b, 50) },
      { id: "puzzle", text: "Schiebe im Puzzle-Beweis alle Dreiecke um, bis a² und b² frei liegen.", check: (v) => v.view === 1 && v.puzzle === 100 },
    ],
  ),
  exercises: [
    {
      id: "hypotenuse",
      make: (rng, level) => {
        const { a, b, c } = rightTriangle(rng);
        const digits = Number.isInteger(c) ? 0 : 2;
        const slips = [
          { value: a * a + b * b, hint: "Das ist c². Ziehe noch die Wurzel." },
          { value: a + b, hint: "Die Seiten werden nicht einfach addiert, sondern ihre Quadrate." },
          { value: Math.sqrt(Math.abs(a * a - b * b)), hint: "Für die Hypotenuse werden die Quadrate addiert, nicht subtrahiert." },
        ];
        if (level === 1)
          return task(
            level,
            `Im Dreieck ABC ist γ = 90°. Die Katheten sind a = ${cm(a)} und b = ${cm(b)} lang. Berechne die Hypotenuse c.`,
            [num("c =", c, "cm", digits, { slips })],
            "c² = a² + b², dann c = √(a² + b²)",
            [`c² = ${fmt(a)}² + ${fmt(b)}² = ${fmt(a * a)} + ${fmt(b * b)} = ${fmt(c * c)}`, `c = √${fmt(c * c)}`],
            `c ${eq(c)} ${cm(c)}`,
            { a, b },
            [`a = ${cm(a)}`, `b = ${cm(b)}`, "γ = 90°"],
          );
        const names = rng.pick(NAME_SETS);
        const right = rng.int(0, 2);
        const [s1, s2] = [names[(right + 1) % 3], names[(right + 2) % 3]];
        const sideName = (x: string, y: string) => [x, y].sort().join("");
        const hyp = sideName(s1, s2);
        return task(
          level,
          `Im Dreieck ${names.join("")} liegt der rechte Winkel bei ${names[right]}. Es gilt ${sideName(names[right], s1)} = ${cm(a)} und ${sideName(names[right], s2)} = ${cm(b)}. Berechne die Länge der dritten Seite ${hyp}.`,
          [num(`${hyp} =`, c, "cm", digits, { slips })],
          "Die Seite gegenüber dem rechten Winkel ist die Hypotenuse. Die beiden Seiten am rechten Winkel sind die Katheten.",
          [`${hyp} liegt dem rechten Winkel bei ${names[right]} gegenüber: Hypotenuse.`, `${hyp}² = ${fmt(a)}² + ${fmt(b)}² = ${fmt(c * c)}`],
          `${hyp} ${eq(c)} ${cm(c)}`,
          { a, b },
        );
      },
    },
    {
      id: "kathete",
      make: (rng, level) => {
        const { a, b, c } = rightTriangle(rng);
        const digits = Number.isInteger(b) ? 0 : 2;
        const cc = Number.isInteger(c) ? c : Number(c.toFixed(1));
        const bb = Math.sqrt(cc * cc - a * a);
        const slips = [
          { value: Math.hypot(cc, a), hint: "Gesucht ist eine Kathete: Subtrahiere das Kathetenquadrat vom Hypotenusenquadrat." },
          { value: cc * cc - a * a, hint: "Das ist b². Ziehe noch die Wurzel." },
          { value: cc - a, hint: "Nicht die Seiten, ihre Quadrate werden subtrahiert." },
        ];
        if (level === 1)
          return task(
            level,
            `Im Dreieck ABC ist γ = 90°. Die Hypotenuse ist c = ${cm(cc)} lang, die Kathete a = ${cm(a)}. Berechne die Kathete b.`,
            [num("b =", bb, "cm", Number.isInteger(c) ? digits : 2, { slips })],
            "b² = c² − a², dann b = √(c² − a²)",
            [`b² = ${fmt(cc)}² − ${fmt(a)}² = ${fmt(cc * cc)} − ${fmt(a * a)} = ${fmt(cc * cc - a * a)}`, `b = √${fmt(cc * cc - a * a)}`],
            `b ${eq(bb)} ${cm(bb)}`,
            { a, c: cc },
            [`c = ${cm(cc)}`, `a = ${cm(a)}`, "γ = 90°"],
          );
        const names = rng.pick(NAME_SETS);
        const right = rng.int(0, 2);
        const [s1, s2] = [names[(right + 1) % 3], names[(right + 2) % 3]];
        const sideName = (x: string, y: string) => [x, y].sort().join("");
        return task(
          level,
          `Im Dreieck ${names.join("")} ist der Winkel bei ${names[right]} ein rechter. Die Seite ${sideName(s1, s2)} ist ${cm(cc)} lang, die Seite ${sideName(names[right], s1)} ist ${cm(a)} lang. Berechne ${sideName(names[right], s2)}.`,
          [num(`${sideName(names[right], s2)} =`, bb, "cm", Number.isInteger(c) ? digits : 2, { slips })],
          "Finde zuerst die Hypotenuse: Sie liegt dem rechten Winkel gegenüber.",
          [`Hypotenuse: ${sideName(s1, s2)} = ${cm(cc)}`, `${sideName(names[right], s2)}² = ${fmt(cc)}² − ${fmt(a)}² = ${fmt(cc * cc - a * a)}`],
          `${sideName(names[right], s2)} ${eq(bb)} ${cm(bb)}`,
          { a, c: cc },
        );
      },
    },
  ],
});

// 3.4 Pythagoras in Körpern und im Alltag ─────────────────────────────────

const anwenden = L({
  id: "ge-4-pythagoras-anwenden",
  title: "Pythagoras in Körpern und im Alltag",
  subtitle: "Diagonalen, Leitern und Dachsparren",
  tracks: BOTH,
  whyItMatters:
    "Passt der Regenschirm in den Koffer? Wie lang wird ein Dachsparren? Wie hoch reicht die Leiter? Im Beruf und im Alltag steckt der Satz des Pythagoras in vielen Fragen. Du musst nur das rechtwinklige Dreieck finden.",
  explanationHtml: `
    <p>In vielen Figuren und Körpern verstecken sich rechtwinklige Dreiecke:</p>
    <ul>
      <li>Rechteck mit den Seiten a und b: Diagonale d = √(a² + b²).</li>
      <li>Quader mit den Kanten a, b, c: Die <strong>Flächendiagonale</strong> der Grundfläche ist e = √(a² + b²). Sie bildet mit der Kante c und der <strong>Raumdiagonale</strong> d ein rechtwinkliges Dreieck: d = √(e² + c²) = √(a² + b² + c²).</li>
    </ul>
    <p>Bei Sachaufgaben hilft immer eine <strong>Skizze</strong>: Zeichne das Dreieck, markiere den rechten Winkel, schreibe gegebene Längen und die gesuchte Größe dazu und bestimme die Hypotenuse.</p>
    <div class="example"><strong>Beispiel:</strong> Quader 4 cm × 3 cm × 12 cm: e = √(16 + 9) = 5 cm, d = √(25 + 144) = 13 cm.<br>
    Eine 5 m lange Leiter steht 1,40 m von der Wand entfernt. Wie hoch reicht sie? Die Leiter ist die Hypotenuse: h = √(5² − 1,4²) = √(25 − 1,96) = √23,04 = 4,8 m.<br>
    Ein Dachdecker braucht die Sparrenlänge eines Satteldachs: Hausbreite 9 m, Firsthöhe 3,5 m. Halbe Breite 4,5 m: s = √(4,5² + 3,5²) = √32,5 ≈ 5,70 m.</div>
    <div class="merke"><strong>Merke:</strong> Skizze machen, rechtwinkliges Dreieck suchen, Hypotenuse bestimmen, dann Pythagoras. Im Quader gilt: Raumdiagonale d = √(a² + b² + c²).</div>
  `,
  formulas: [
    { name: "Flächendiagonale", html: "e = √(a² + b²)", quantities: "Diagonale eines Rechtecks mit den Seiten a, b" },
    { name: "Raumdiagonale im Quader", html: "d = √(a² + b² + c²)", quantities: "a, b, c Kanten des Quaders" },
  ],
  quiz: {
    question: "Eine 2,5 m lange Leiter lehnt an einer Wand, ihr Fuß steht 0,7 m von der Wand entfernt. Wie hoch reicht sie?",
    options: ["2,4 m", "2,6 m", "1,8 m", "3,2 m"],
    correctIndex: 0,
    explanation: "Die Leiter ist die Hypotenuse: h = √(2,5² − 0,7²) = √(6,25 − 0,49) = √5,76 = 2,4 m.",
  },
  lab: lab(
    "cuboid-diagonals",
    "Diagonalen im Quader",
    "Verändere die Kanten des Quaders. Das grüne Dreieck aus Flächendiagonale, Kante und Raumdiagonale hat einen rechten Winkel bei C.",
    [r("a", "Kante a", 1, 12, 2, 1, "cm"), r("b", "Kante b", 1, 12, 2, 1, "cm"), r("c", "Kante c (Höhe)", 1, 12, 2, 1, "cm")],
    [
      o("e", "Flächendiagonale e", (v) => Math.hypot(v.a, v.b), "cm", 2),
      o("d", "Raumdiagonale d", (v) => Math.hypot(v.a, v.b, v.c), "cm", 2, true),
    ],
    [
      { id: "dreizehn", text: "Stelle einen Quader mit e = 5 cm und d = 13 cm ein.", check: (v) => near(Math.hypot(v.a, v.b), 5) && near(Math.hypot(v.a, v.b, v.c), 13) },
      { id: "stab", text: "Ein 10 cm langer Stab soll genau diagonal auf den Boden des Quaders passen.", check: (v) => near(Math.hypot(v.a, v.b), 10) },
      { id: "wuerfel", text: "Erzeuge einen Würfel mit einer Raumdiagonale über 15 cm.", check: (v) => v.a === v.b && v.b === v.c && Math.hypot(v.a, v.b, v.c) > 15 },
    ],
  ),
  exercises: [
    {
      id: "koerper",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.int(2, 15);
          const b = rng.int(2, 15);
          const c = rng.int(2, 15);
          const e = Math.hypot(a, b);
          const d = Math.hypot(a, b, c);
          return task(
            level,
            `Ein Quader ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Berechne die Diagonale e der Grundfläche und die Raumdiagonale d.`,
            [num("e =", e, "cm", 2, { slips: [{ value: a * a + b * b, hint: "Das ist e². Ziehe die Wurzel." }] }), num("d =", d, "cm", 2, { slips: [{ value: Math.hypot(e, a), hint: "Im Dreieck zur Raumdiagonale ist die Höhe c die zweite Kathete." }, { value: e + c, hint: "Die Quadrate werden addiert, nicht die Längen." }] })],
            "e = √(a² + b²); d = √(e² + c²) = √(a² + b² + c²)",
            [`e² = ${a}² + ${b}² = ${a * a + b * b}, e ${eq(e)} ${cm(e)}`, `d² = ${a * a + b * b} + ${c}² = ${a * a + b * b + c * c}`],
            `e ${eq(e)} ${cm(e)}, d ${eq(d)} ${cm(d)}`,
            { a, b, c },
            [`a = ${a} cm`, `b = ${b} cm`, `c = ${c} cm`],
          );
        }
        const a = 10 * rng.int(5, 9);
        const b = 10 * rng.int(3, 6);
        const c = 5 * rng.int(4, 8);
        const d = Math.hypot(a, b, c);
        // At least 7,5 cm away from the diagonal, so rounding never decides.
        const item = 5 * Math.round((d + rng.pick([-15, -10, 10, 15])) / 5);
        const fits = item <= d;
        return task(
          level,
          `Passt ein ${item} cm langer Wanderstock schräg in einen Koffer, der innen ${a} cm lang, ${b} cm breit und ${c} cm hoch ist? Berechne die längste Strecke im Koffer.`,
          [num("Raumdiagonale:", d, "cm", 1, { slips: [{ value: Math.hypot(a, b), hint: "Das ist nur die Diagonale des Bodens. Schräg nach oben passt mehr: die Raumdiagonale." }] }), yesNo("passt er?", fits)],
          "Die längste Strecke im Quader ist die Raumdiagonale d = √(a² + b² + c²).",
          [`d = √(${a}² + ${b}² + ${c}²) = √${a * a + b * b + c * c} ≈ ${fmt(d, 1)} cm`, fits ? `${item} cm ≤ ${fmt(d, 1)} cm` : `${item} cm > ${fmt(d, 1)} cm`],
          `d ≈ ${fmt(d, 1)} cm; ${fits ? "der Stock passt" : "der Stock passt nicht"}`,
          { a, b, c, item },
        );
      },
    },
    {
      id: "sachaufgabe",
      make: (rng, level) => {
        if (level === 1) {
          const L = rng.pick([3, 3.5, 4, 4.5, 5, 6, 7]);
          const x = rng.pick([0.8, 1, 1.2, 1.4, 1.5]);
          const h = Math.sqrt(L * L - x * x);
          return task(
            level,
            `Eine ${fmtUnit(L, "m")} lange Leiter lehnt an einer Hauswand. Ihr Fuß steht ${fmtUnit(x, "m")} von der Wand entfernt. Wie hoch reicht die Leiter an der Wand?`,
            [num("Höhe:", h, "m", 2, { slips: [{ value: Math.hypot(L, x), hint: "Die Leiter ist die längste Seite, die Hypotenuse. Gesucht ist eine Kathete." }, { value: L - x, hint: "Nicht die Längen, ihre Quadrate werden subtrahiert." }] })],
            "Skizze: Wand und Boden bilden den rechten Winkel, die Leiter ist die Hypotenuse. h = √(L² − x²)",
            [`h² = ${fmt(L)}² − ${fmt(x)}² = ${fmt(L * L)} − ${fmt(x * x)} = ${fmt(L * L - x * x)}`],
            `h ${eq(h)} ${fmtUnit(h, "m")}`,
            { L, x },
            [`Leiter: ${fmtUnit(L, "m")}`, `Abstand: ${fmtUnit(x, "m")}`],
          );
        }
        const width = rng.pick([8, 9, 10, 11, 12]);
        const height = rng.pick([2.5, 3, 3.5, 4, 4.5]);
        const overhang = rng.pick([0.5, 0.6, 0.8]);
        const s = Math.hypot(width / 2, height);
        return task(
          level,
          `Ein Zimmerer baut ein symmetrisches Satteldach für ein ${width} m breites Haus. Der First liegt ${fmtUnit(height, "m")} über der Oberkante der Wände. Wie lang ist ein Sparren vom First bis zur Wand? Wie lang muss das Holz sein, wenn er noch ${fmtUnit(overhang, "m")} über die Wand hinausragen soll?`,
          [num("bis zur Wand:", s, "m", 2, { slips: [{ value: Math.hypot(width, height), hint: "Der Sparren reicht nur bis zur Mitte: Nimm die halbe Hausbreite." }] }), num("Holzlänge:", s + overhang, "m", 2)],
          "Skizze: halbe Hausbreite und Firsthöhe sind die Katheten, der Sparren ist die Hypotenuse.",
          [`halbe Breite: ${fmt(width / 2)} m`, `s = √(${fmt(width / 2)}² + ${fmt(height)}²) = √${fmt((width / 2) ** 2 + height ** 2)} ${eq(s)} ${fmtUnit(s, "m")}`, `mit Überstand: ${fmtUnit(s, "m")} + ${fmtUnit(overhang, "m")}`],
          `${fmtUnit(s, "m")} bis zur Wand, ${fmtUnit(s + overhang, "m")} Holz`,
          { width, height },
        );
      },
    },
  ],
});

// 3.5 Umkehrung des Satzes des Pythagoras ──────────────────────────────────

const umkehrung = L({
  id: "ge-5-umkehrung",
  title: "Ist das Dreieck rechtwinklig?",
  subtitle: "Die Umkehrung des Satzes des Pythagoras",
  tracks: BOTH,
  whyItMatters:
    "Ist die Ecke wirklich rechtwinklig? Maurer, Fliesenleger und Gärtner prüfen das mit einem Maßband: drei Längen messen, Quadrate vergleichen. Schon die alten Ägypter steckten so rechte Winkel ab.",
  explanationHtml: `
    <p><strong>Umkehrung des Satzes des Pythagoras:</strong> Ist in einem Dreieck die Summe der Quadrate der beiden kürzeren Seiten gleich dem Quadrat der längsten Seite, dann ist das Dreieck rechtwinklig. Der rechte Winkel liegt der längsten Seite gegenüber.</p>
    <p>So prüfst du: Längste Seite suchen, die anderen beiden quadrieren und addieren, mit dem Quadrat der längsten Seite vergleichen.</p>
    <ul>
      <li>gleich: rechtwinklig,</li>
      <li>kleiner: der Winkel gegenüber der längsten Seite ist stumpf,</li>
      <li>größer: alle Winkel sind spitz.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> 9 cm, 12 cm, 15 cm: 81 + 144 = 225 = 15². Das Dreieck ist rechtwinklig.<br>
    6 cm, 8 cm, 11 cm: 36 + 64 = 100 &lt; 121 = 11². Das Dreieck ist stumpfwinklig.<br>
    Ein Maurer misst von einer Ecke aus 60 cm und 80 cm ab. Ist die Schräge dazwischen genau 1 m lang, ist die Ecke rechtwinklig, denn 0,6² + 0,8² = 1².</div>
    <div class="merke"><strong>Merke:</strong> Gilt für die Seiten a² + b² = c² (c die längste Seite), dann ist das Dreieck rechtwinklig, mit dem rechten Winkel gegenüber von c. Vergleiche immer die Quadrate, nicht die Längen.</div>
  `,
  formulas: [
    { name: "Umkehrung", html: "a² + b² = c² ⇒ γ = 90°", quantities: "c die längste Seite" },
    { name: "Pythagoreische Tripel", html: "3, 4, 5; 5, 12, 13; 8, 15, 17", quantities: "und ihre Vielfachen, z. B. 6, 8, 10" },
  ],
  quiz: {
    question: "Ein Dreieck hat die Seiten 6 cm, 8 cm und 11 cm. Was gilt?",
    options: ["Es ist stumpfwinklig.", "Es ist rechtwinklig.", "Es ist spitzwinklig.", "Es gibt so ein Dreieck nicht."],
    correctIndex: 0,
    explanation: "6² + 8² = 100 ist kleiner als 11² = 121. Der Winkel gegenüber der längsten Seite ist also größer als 90°.",
  },
  lab: lab(
    "rope",
    "Die Knotenschnur",
    "Eine geschlossene Schnur hat gleich weite Knotenabstände. Lege zwei Seiten fest, die dritte ergibt sich aus dem Rest. Wann entsteht ein rechter Winkel?",
    [
      { type: "choice", key: "N", label: "Knotenabstände der Schnur", options: [12, 24, 30, 36, 40].map((n) => ({ value: n, label: `${n} Abstände` })), value: 12 },
      r("p", "Seite p", 1, 20, 4, 1, "Abst."),
      r("q", "Seite q", 1, 20, 4, 1, "Abst."),
    ],
    [
      o("r", "dritte Seite r = N − p − q", (v) => (v.N - v.p - v.q > 0 ? v.N - v.p - v.q : "keine"), "", 0),
      o("gamma", "Winkel gegenüber der längsten Seite", (v) => ropeGamma(v) ?? "kein Dreieck", "°", 1, true),
      o("kind", "Art des Dreiecks", (v) => {
        const { sides, valid } = ropeSides(v);
        if (!valid) return "kein Dreieck";
        const [u, w, Lx] = sides;
        const diff = u * u + w * w - Lx * Lx;
        return diff === 0 ? "rechtwinklig" : diff > 0 ? "spitzwinklig" : "stumpfwinklig";
      }),
    ],
    [
      { id: "zwoelf", text: "Spanne mit 12 Knotenabständen einen rechten Winkel.", check: (v, rd) => v.N === 12 && rd.kind === "rechtwinklig" },
      { id: "dreissig", text: "Spanne mit 30 Knotenabständen einen rechten Winkel. (3 : 4 : 5 geht hier nicht auf.)", check: (v, rd) => v.N === 30 && rd.kind === "rechtwinklig" },
      { id: "stumpf", text: "Spanne ein stumpfwinkliges Dreieck: Die zwei kurzen Seiten im Quadrat ergeben weniger als die längste im Quadrat.", check: (_v, rd) => rd.kind === "stumpfwinklig" },
    ],
  ),
  exercises: [
    {
      id: "pruefen",
      make: (rng, level) => {
        if (level === 1) {
          const [a0, b0, c0] = rng.pick(TRIPLES);
          const k = rng.pick([1, 1, 2]);
          const change = rng.pick([0, 0, 1, -1]);
          const sides = [a0 * k, b0 * k, c0 * k + change];
          const [a, b, c] = sides;
          const diff = a * a + b * b - c * c;
          const kind = diff === 0 ? 0 : diff < 0 ? 1 : 2;
          const shown = rng.shuffle(sides);
          return task(
            level,
            `Ein Dreieck hat die Seiten ${shown.map((x) => `${x} cm`).join(", ")}. Berechne die Summe der Quadrate der beiden kürzeren Seiten. Ist das Dreieck rechtwinklig, stumpfwinklig oder spitzwinklig?`,
            [num("Summe:", a * a + b * b, "cm²", 0, { slips: [{ value: c * c, hint: "Das ist das Quadrat der längsten Seite. Addiere die Quadrate der beiden kürzeren." }] }), choiceField("Das Dreieck ist", ["rechtwinklig", "stumpfwinklig", "spitzwinklig"], kind)],
            "Längste Seite suchen, die Quadrate der beiden anderen addieren und mit dem Quadrat der längsten vergleichen.",
            [`${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`, `${c}² = ${c * c}`],
            `${a * a + b * b} ${diff === 0 ? "=" : diff < 0 ? "<" : ">"} ${c * c}: ${["rechtwinklig", "stumpfwinklig", "spitzwinklig"][kind]}`,
            { a, b, c },
          );
        }
        const [a0, b0, c0] = rng.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]);
        const unit = rng.pick([0.2, 0.3, 0.4]);
        const a = a0 * unit;
        const b = b0 * unit;
        const target = c0 * unit;
        const measured = target + rng.pick([0, 0, -0.03, 0.04, -0.05]);
        const right = near(measured, target);
        return task(
          level,
          `Eine Fliesenlegerin prüft, ob die Ecke eines Raums rechtwinklig ist. Sie misst von der Ecke aus ${fmtUnit(a, "m")} an der einen Wand und ${fmtUnit(b, "m")} an der anderen. Die Schräge zwischen den beiden Marken ist ${fmtUnit(measured, "m")} lang. Wie lang müsste sie bei einem rechten Winkel sein? Ist die Ecke rechtwinklig?`,
          [num("nötige Länge:", target, "m", 2, { slips: [{ value: a + b, hint: "Nicht die Längen addieren, sondern ihre Quadrate." }] }), yesNo("rechtwinklig?", right)],
          "Bei einem rechten Winkel gilt: Schräge² = Wandstück² + Wandstück².",
          [`√(${fmt(a)}² + ${fmt(b)}²) = √${fmt(a * a + b * b, 4)} = ${fmtUnit(target, "m")}`, right ? "Die gemessene Länge stimmt." : `Gemessen: ${fmtUnit(measured, "m")}, das weicht ab.`],
          `${fmtUnit(target, "m")}; ${right ? "ja, rechtwinklig" : "nein, nicht rechtwinklig"}`,
          { a, b, measured },
        );
      },
    },
    {
      id: "fehlend",
      make: (rng, level) => {
        const [a, b, c] = rng.pick(TRIPLES);
        if (level === 1)
          return task(
            level,
            `Zwei Seiten eines Dreiecks sind ${a} cm und ${b} cm lang. Wie lang muss die dritte Seite sein, damit das Dreieck einen rechten Winkel zwischen diesen beiden Seiten hat?`,
            [num("dritte Seite:", c, "cm", 0, { slips: [{ value: a + b, hint: "Nicht addieren: Die dritte Seite ist die Hypotenuse, c = √(a² + b²)." }, { value: a * a + b * b, hint: "Das ist c². Ziehe noch die Wurzel." }] })],
            "Liegt der rechte Winkel zwischen den beiden Seiten, sind es die Katheten.",
            [`c² = ${a}² + ${b}² = ${a * a + b * b}`],
            `c = ${c} cm`,
            { a, b },
          );
        const N = a + b + c;
        return task(
          level,
          `Ein geschlossenes Seil hat ${N} gleiche Knotenabstände. Es wird zu einem Dreieck gespannt; zwei Seiten haben ${a} und ${b} Abstände. Wie viele Abstände hat die dritte Seite? Entsteht zwischen den beiden kürzeren Seiten ein rechter Winkel?`,
          [num("dritte Seite:", c, "Abstände", 0), yesNo("rechter Winkel?", true)],
          "Die dritte Seite ist der Rest des Seils. Dann die Quadrate vergleichen.",
          [`${N} − ${a} − ${b} = ${c}`, `${a}² + ${b}² = ${a * a + b * b} = ${c}²`],
          `${c} Abstände; ja, rechter Winkel`,
          { a, b },
        );
      },
    },
  ],
});

// 3.6 Regelmäßige Vielecke ─────────────────────────────────────────────────

const POLYGON_NAMES: Record<number, string> = { 3: "Dreieck", 4: "Viereck", 5: "Fünfeck", 6: "Sechseck", 8: "Achteck", 9: "Neuneck", 10: "Zehneck", 12: "Zwölfeck", 15: "Fünfzehneck", 18: "Achtzehneck", 20: "Zwanzigeck" };
const NICE_N = [3, 4, 5, 6, 8, 9, 10, 12];

const vielecke = L({
  id: "ge-6-regelmaessige-vielecke",
  title: "Regelmäßige Vielecke",
  subtitle: "Mittelpunktswinkel, Basiswinkel und Umfang",
  tracks: BOTH,
  whyItMatters:
    "Stoppschilder sind Achtecke, Bienenwaben Sechsecke, Schraubenmuttern auch. Wer regelmäßige Vielecke in gleichschenklige Dreiecke zerlegt, kann ihre Winkel berechnen und sie genau zeichnen.",
  explanationHtml: `
    <p>Ein <strong>regelmäßiges Vieleck</strong> (n-Eck) hat n gleich lange Seiten und n gleich große Innenwinkel. Alle Ecken liegen auf einem Kreis um den Mittelpunkt M.</p>
    <p>Verbindest du M mit allen Ecken, zerfällt das n-Eck in n deckungsgleiche, gleichschenklige <strong>Bestimmungsdreiecke</strong>. Für sie gilt:</p>
    <ul>
      <li>Mittelpunktswinkel: μ = 360° : n</li>
      <li>Basiswinkel: (180° − μ) : 2</li>
      <li>Innenwinkel des n-Ecks: zwei Basiswinkel, also 180° − μ</li>
      <li>Umfang: u = n · s</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Regelmäßiges Achteck mit s = 4 cm: μ = 360° : 8 = 45°, Basiswinkel (180° − 45°) : 2 = 67,5°, Innenwinkel 135°, Umfang 8 · 4 cm = 32 cm.<br>
    Beim Sechseck ist μ = 60° und auch jeder Basiswinkel 60°: Die Bestimmungsdreiecke sind gleichseitig.</div>
    <p><strong>Zeichnen:</strong> Kreis um M zeichnen, den Mittelpunktswinkel μ mit dem Geodreieck n-mal hintereinander abtragen, die Schnittpunkte mit dem Kreis verbinden.</p>
    <div class="merke"><strong>Merke:</strong> μ = 360° : n, Basiswinkel = (180° − μ) : 2, Innenwinkel = 180° − μ, u = n · s.</div>
  `,
  formulas: [
    { name: "Mittelpunktswinkel", html: "μ = 360° : n", quantities: "n Anzahl der Ecken" },
    { name: "Basiswinkel und Innenwinkel", html: "(180° − μ) : 2; Innenwinkel = 180° − μ", quantities: "im gleichschenkligen Bestimmungsdreieck" },
    { name: "Umfang", html: "u = n · s", quantities: "s Seitenlänge" },
  ],
  quiz: {
    question: "Wie groß ist der Mittelpunktswinkel eines regelmäßigen Zehnecks?",
    options: ["36°", "144°", "72°", "18°"],
    correctIndex: 0,
    explanation: "μ = 360° : 10 = 36°. 144° ist der Innenwinkel, also 180° − 36°.",
  },
  lab: lab(
    "regular-polygon",
    "Bestimmungsdreiecke",
    "Verändere die Zahl der Ecken und die Seitenlänge. Das orange Bestimmungsdreieck zeigt Mittelpunktswinkel μ und die beiden Basiswinkel.",
    [r("n", "Anzahl der Ecken n", 3, 12, 5, 1), r("s", "Seitenlänge s", 1, 8, 3, 0.5, "cm")],
    [
      o("mu", "Mittelpunktswinkel μ", (v) => regularPolygon(v.n, v.s).centre, "°", 2),
      o("basis", "Basiswinkel", (v) => regularPolygon(v.n, v.s).base, "°", 2),
      o("innen", "Innenwinkel", (v) => regularPolygon(v.n, v.s).interior, "°", 2),
      o("u", "Umfang u", (v) => regularPolygon(v.n, v.s).perimeter, "cm", 1, true),
    ],
    [
      { id: "vierzig", text: "Stelle ein Vieleck mit dem Mittelpunktswinkel 40° ein.", check: (v) => v.n === 9 },
      { id: "gleichseitig", text: "Finde das Vieleck, dessen Bestimmungsdreiecke gleichseitig sind.", check: (v) => v.n === 6 },
      { id: "achteck", text: "Stelle ein regelmäßiges Achteck mit 36 cm Umfang ein.", check: (v) => v.n === 8 && v.s === 4.5 },
    ],
  ),
  exercises: [
    {
      id: "winkel",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.pick(NICE_N);
          const p = regularPolygon(n, 1);
          return task(
            level,
            `Berechne für ein regelmäßiges ${POLYGON_NAMES[n]} den Mittelpunktswinkel, den Basiswinkel eines Bestimmungsdreiecks und den Innenwinkel.`,
            [
              num("μ =", p.centre, "°", 2, { slips: [{ value: 180 / n, hint: "Um den Mittelpunkt herum sind es 360°, nicht 180°." }] }),
              num("Basiswinkel =", p.base, "°", 2, { slips: [{ value: 180 - p.centre, hint: "Das ist der Innenwinkel. Ein Basiswinkel ist die Hälfte davon." }] }),
              num("Innenwinkel =", p.interior, "°", 2),
            ],
            "μ = 360° : n; Basiswinkel = (180° − μ) : 2; Innenwinkel = 2 · Basiswinkel",
            [`μ = 360° : ${n} = ${fmt(p.centre, 2)}°`, `Basiswinkel = (180° − ${fmt(p.centre, 2)}°) : 2 = ${fmt(p.base, 2)}°`],
            `μ = ${fmt(p.centre, 2)}°, Basiswinkel ${fmt(p.base, 2)}°, Innenwinkel ${fmt(p.interior, 2)}°`,
            { n },
          );
        }
        const n = rng.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]);
        const p = regularPolygon(n, 1);
        return task(
          level,
          `Ein regelmäßiges Vieleck hat Innenwinkel von ${fmt(p.interior, 2)}°. Wie viele Ecken hat es? Wie groß ist der Mittelpunktswinkel?`,
          [num("Ecken:", n, "", 0), num("μ =", p.centre, "°", 2, { slips: [{ value: p.interior / 2, hint: "Das ist ein Basiswinkel. μ = 180° − Innenwinkel." }] })],
          "Innenwinkel = 180° − μ, also μ = 180° − Innenwinkel. Dann n = 360° : μ.",
          [`μ = 180° − ${fmt(p.interior, 2)}° = ${fmt(p.centre, 2)}°`, `n = 360° : ${fmt(p.centre, 2)}° = ${n}`],
          `${n} Ecken, μ = ${fmt(p.centre, 2)}°`,
          { n },
        );
      },
    },
    {
      id: "umfang",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.pick(NICE_N);
          const s = rng.int(4, 30) / 2;
          if (rng.next() < 0.5)
            return task(
              level,
              `Ein regelmäßiges ${POLYGON_NAMES[n]} hat die Seitenlänge ${cm(s)}. Berechne den Umfang.`,
              [num("u =", n * s, "cm", 1, { slips: [{ value: (n - 1) * s, hint: "Ein n-Eck hat n gleich lange Seiten." }] })],
              "u = n · s",
              [`u = ${n} · ${cm(s)}`],
              `u = ${cm(n * s)}`,
              { n, s },
            );
          return task(
            level,
            `Ein regelmäßiges ${POLYGON_NAMES[n]} hat den Umfang ${cm(n * s)}. Wie lang ist eine Seite?`,
            [num("s =", s, "cm", 2)],
            "s = u : n",
            [`s = ${cm(n * s)} : ${n}`],
            `s = ${cm(s)}`,
            { n, s },
          );
        }
        const n = rng.pick([6, 8]);
        const s = rng.pick([0.8, 1, 1.2, 1.5, 2, 2.5]);
        const p = regularPolygon(n, s);
        const thing = n === 6 ? "sechseckigen Pavillon" : "achteckigen Gartenpavillon";
        return task(
          level,
          `Ein Schreiner baut einen ${thing} mit regelmäßiger Grundfläche und der Seitenlänge ${fmtUnit(s, "m")}. Wie viel Meter Randleiste braucht er für den Boden? Unter welchem Winkel treffen zwei benachbarte Bodenbalken aus der Mitte aufeinander (Mittelpunktswinkel)?`,
          [num("Randleiste:", p.perimeter, "m", 2), num("μ =", p.centre, "°", 1)],
          "Umfang u = n · s, Mittelpunktswinkel μ = 360° : n.",
          [`u = ${n} · ${fmtUnit(s, "m")} = ${fmtUnit(p.perimeter, "m")}`, `μ = 360° : ${n} = ${fmt(p.centre)}°`],
          `${fmtUnit(p.perimeter, "m")} Randleiste, μ = ${fmt(p.centre)}°`,
          { n, s },
        );
      },
    },
  ],
});

// 3.7 Pyramide und Kegel ───────────────────────────────────────────────────

const pyramideKegel = L({
  id: "ge-7-pyramide-kegel",
  title: "Pyramide und Kegel",
  subtitle: "Eigenschaften, Kopfgeometrie und Schrägbildskizzen",
  tracks: BOTH,
  whyItMatters:
    "Kirchturmdächer, Zelte, Eistüten und Verkehrshütchen sind Pyramiden und Kegel. Wer ihren Aufbau kennt und eine beschriftete Skizze anfertigt, findet darin die rechtwinkligen Dreiecke für jede Berechnung.",
  explanationHtml: `
    <p>Eine <strong>gerade Pyramide</strong> hat ein Vieleck als Grundfläche (Quadrat, Rechteck, Dreieck oder ein regelmäßiges Vieleck) und Dreiecke als Seitenflächen. Die Seitenflächen treffen sich in der Spitze S, die senkrecht über dem Mittelpunkt der Grundfläche liegt. Eine Pyramide mit n-eckiger Grundfläche hat n + 1 Ecken, 2n Kanten und n + 1 Flächen.</p>
    <p>Ein <strong>gerader Kegel</strong> hat einen Kreis als Grundfläche und eine gekrümmte Mantelfläche; seine Spitze liegt über dem Kreismittelpunkt. Er hat 2 Flächen, 1 Kante (den Grundkreis) und eine Spitze, aber keine Ecke.</p>
    <p>Wichtige Strecken: die <strong>Höhe h</strong> (senkrecht von der Spitze zur Grundfläche), die <strong>Seitenhöhe hₛ</strong> (Höhe einer Seitenfläche), die <strong>Seitenkante s</strong> und beim Kegel die <strong>Mantellinie s</strong>.</p>
    <p><strong>Schrägbildskizze:</strong> Grundfläche im Schrägbild zeichnen (nach hinten laufende Kanten unter 45° und halb so lang), Mittelpunkt markieren, Höhe senkrecht nach oben, Spitze mit den Ecken verbinden, verdeckte Kanten gestrichelt. Dann gegebene Werte und gesuchte Größen eintragen.</p>
    <div class="example"><strong>Beispiel:</strong> Quadratische Pyramide mit a = 6 cm und h = 4 cm. Im Inneren steht ein rechtwinkliges Dreieck aus h, a : 2 und hₛ: hₛ = √(4² + 3²) = 5 cm. Ein zweites aus hₛ, a : 2 und s: s = √(5² + 3²) = √34 ≈ 5,83 cm.<br>
    Kegel mit r = 3 cm und h = 4 cm: s = √(3² + 4²) = 5 cm.</div>
    <div class="merke"><strong>Merke:</strong> n-eckige Pyramide: n + 1 Ecken, 2n Kanten, n + 1 Flächen. In Pyramide und Kegel stecken rechtwinklige Dreiecke aus Höhe, halber Grundkante (oder Radius) und Seitenhöhe (oder Mantellinie).</div>
  `,
  formulas: [
    { name: "Quadratische Pyramide", html: "hₛ = √(h² + (a : 2)²); s = √(hₛ² + (a : 2)²)", quantities: "a Grundkante, h Höhe, hₛ Seitenhöhe, s Seitenkante" },
    { name: "Kegel", html: "s = √(r² + h²)", quantities: "r Radius, h Höhe, s Mantellinie" },
    { name: "n-eckige Pyramide", html: "n + 1 Ecken, 2n Kanten, n + 1 Flächen", quantities: "n Ecken der Grundfläche" },
  ],
  quiz: {
    question: "Wie viele Kanten hat eine Pyramide mit einem Sechseck als Grundfläche?",
    options: ["12", "7", "6", "18"],
    correctIndex: 0,
    explanation: "6 Kanten der Grundfläche und 6 Seitenkanten zur Spitze: 12 Kanten. 7 ist die Zahl der Ecken und der Flächen.",
  },
  lab: lab(
    "pyramid-cone",
    "Pyramiden und Kegel im Schrägbild",
    "Wähle einen Körper und verändere Grundkante (beim Kegel den Durchmesser) und Höhe. Die farbigen Strecken bilden die rechtwinkligen Dreiecke im Körper.",
    [choice("body", "Körper", [...SOLIDS], 0), r("a", "Grundkante a (Kegel: Durchmesser)", 2, 8, 4, 1, "cm"), r("h", "Höhe h", 2, 8, 5, 1, "cm")],
    [
      o("ecken", "Ecken", (v) => pyramidSolid(SOLIDS[v.body], v.a, v.h).vertices, "", 0),
      o("kanten", "Kanten", (v) => pyramidSolid(SOLIDS[v.body], v.a, v.h).edges, "", 0),
      o("flaechen", "Flächen", (v) => pyramidSolid(SOLIDS[v.body], v.a, v.h).faces, "", 0),
      o("hs", "Seitenhöhe hₛ (quadratisch) bzw. Mantellinie s (Kegel)", (v) => (v.body === 0 ? squarePyramid(v.a, v.h).hs : v.body === 4 ? Math.hypot(v.a / 2, v.h) : "–"), "cm", 2, true),
    ],
    [
      { id: "sechseck", text: "Finde die Pyramide mit 7 Ecken und 12 Kanten.", check: (v) => v.body === 3 },
      { id: "seitenhoehe", text: "Stelle eine quadratische Pyramide mit der Seitenhöhe 5 cm ein.", check: (v) => v.body === 0 && near(squarePyramid(v.a, v.h).hs, 5) },
      { id: "kegel", text: "Wähle den Körper mit gekrümmter Fläche und stelle ihn mit der Mantellinie 5 cm ein.", check: (v) => v.body === 4 && near(Math.hypot(v.a / 2, v.h), 5) },
    ],
  ),
  exercises: [
    {
      id: "zaehlen",
      make: (rng, level) => {
        const n = rng.int(3, 12);
        if (level === 1)
          return task(
            level,
            `Eine Pyramide hat ein ${n}-Eck als Grundfläche. Wie viele Ecken, Kanten und Flächen hat sie?`,
            [num("Ecken:", n + 1, "", 0, { slips: [{ value: n, hint: "Die Spitze ist auch eine Ecke." }] }), num("Kanten:", 2 * n, "", 0, { slips: [{ value: n, hint: "Zu den Kanten der Grundfläche kommen die Seitenkanten zur Spitze." }] }), num("Flächen:", n + 1, "", 0, { slips: [{ value: n, hint: "Die Grundfläche zählt mit." }] })],
            "Grundfläche: n Ecken und n Kanten. Dazu die Spitze, n Seitenkanten und n Seitenflächen.",
            [`Ecken: ${n} + 1, Kanten: ${n} + ${n}, Flächen: ${n} Seitenflächen + 1 Grundfläche`],
            `${n + 1} Ecken, ${2 * n} Kanten, ${n + 1} Flächen`,
            { n },
          );
        return task(
          level,
          `Kopfgeometrie: Eine gerade Pyramide hat ${2 * n} Kanten. Wie viele Ecken hat ihre Grundfläche, und wie viele Flächen hat die Pyramide insgesamt? Wie viele Kanten treffen sich in der Spitze?`,
          [num("Ecken der Grundfläche:", n, "", 0, { slips: [{ value: 2 * n, hint: "Die Hälfte der Kanten liegt in der Grundfläche, die andere Hälfte führt zur Spitze." }] }), num("Flächen:", n + 1, "", 0), num("Kanten an der Spitze:", n, "", 0)],
          "Eine n-eckige Pyramide hat 2n Kanten: n in der Grundfläche, n zur Spitze.",
          [`2n = ${2 * n}, also n = ${n}`, `Flächen: ${n} + 1`],
          `${n}-Eck; ${n + 1} Flächen; ${n} Kanten an der Spitze`,
          { n },
        );
      },
    },
    {
      id: "hoehen",
      make: (rng, level) => {
        if (level === 1) {
          const a = 2 * rng.int(2, 8);
          const h = rng.int(3, 12);
          const { hs, s } = squarePyramid(a, h);
          return task(
            level,
            `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Höhe h = ${h} cm. Skizziere sie und berechne die Seitenhöhe hₛ und die Seitenkante s.`,
            [num("hₛ =", hs, "cm", 2, { slips: [{ value: Math.hypot(a, h), hint: "Der Fußpunkt der Höhe liegt in der Mitte: Nimm a : 2." }] }), num("s =", s, "cm", 2, { slips: [{ value: Math.hypot(h, a / 2), hint: "Das ist die Seitenhöhe. Für die Seitenkante kommt noch einmal a : 2 dazu." }] })],
            "Dreieck aus h, a : 2 und hₛ; dann Dreieck aus hₛ, a : 2 und s.",
            [`hₛ² = ${h}² + ${a / 2}² = ${h * h + (a / 2) ** 2}`, `s² = hₛ² + ${a / 2}² = ${h * h + 2 * (a / 2) ** 2}`],
            `hₛ ${eq(hs)} ${cm(hs)}, s ${eq(s)} ${cm(s)}`,
            { a, h },
            [`a = ${a} cm`, `h = ${h} cm`],
          );
        }
        const d = rng.pick([6, 8, 10, 12]);
        const h = rng.pick([20, 25, 30, 35, 40]);
        const s = Math.hypot(d / 2, h);
        const thing = rng.pick([
          { name: "Eine Schultüte", unit: "cm" },
          { name: "Das Dach eines Spielturms", unit: "dm" },
          { name: "Eine Eiswaffel", unit: "cm" },
        ]);
        return task(
          level,
          `${thing.name} ist ein gerader Kegel mit dem Durchmesser ${d} ${thing.unit} und der Höhe ${h} ${thing.unit}. Wie lang ist die Mantellinie s? Fertige vorher eine beschriftete Skizze an.`,
          [num("s =", s, thing.unit, 2, { slips: [{ value: Math.hypot(d, h), hint: "In der Skizze steht der Radius, also der halbe Durchmesser, im rechtwinkligen Dreieck." }] })],
          "Rechtwinkliges Dreieck aus Höhe h, Radius r = d : 2 und Mantellinie s.",
          [`r = ${d} : 2 = ${d / 2}`, `s² = ${d / 2}² + ${h}² = ${(d / 2) ** 2 + h * h}`],
          `s ${eq(s)} ${fmtUnit(s, thing.unit)}`,
          { d, h },
        );
      },
    },
  ],
});

// 3.8 Schiefe Pyramiden und Kegel (M9) ────────────────────────────────────

const schief = L({
  id: "ge-8-schiefe-koerper",
  title: "Schiefe Pyramiden und Kegel",
  subtitle: "Die Spitze liegt nicht über der Mitte",
  tracks: M_ONLY,
  whyItMatters:
    "Nicht jedes Dach und nicht jedes Zelt ist symmetrisch. Bei schiefen Körpern werden die Kanten verschieden lang. Mit der richtig gemessenen Höhe und dem Satz des Pythagoras berechnest du sie trotzdem.",
  explanationHtml: `
    <p>Bei einer <strong>schiefen Pyramide</strong> und einem <strong>schiefen Kegel</strong> liegt die Spitze nicht senkrecht über dem Mittelpunkt der Grundfläche. Die Seitenkanten (beim Kegel die Mantellinien) sind dann verschieden lang, die Seitenflächen sind nicht mehr deckungsgleich.</p>
    <p>Die <strong>Höhe h</strong> ist auch hier der senkrechte Abstand der Spitze von der Grundfläche. Ihr Fußpunkt F kann auf einer Kante, in einer Ecke oder sogar außerhalb der Grundfläche liegen.</p>
    <p>Eine Seitenkante berechnest du über ein rechtwinkliges Dreieck aus der Höhe h und dem Abstand des Fußpunkts F zur jeweiligen Ecke.</p>
    <div class="example"><strong>Beispiel:</strong> Quadratische Pyramide, a = 4 cm, h = 6 cm, die Spitze liegt genau über der Ecke A. Dann ist die Kante AS so lang wie die Höhe: 6 cm. Zur gegenüberliegenden Ecke C ist F so weit entfernt wie die Diagonale: √(4² + 4²) = √32 ≈ 5,66 cm. Also CS = √(6² + 32) = √68 ≈ 8,25 cm.<br>
    Ein schiefer Kegel mit r = 3 cm, h = 4 cm, Fußpunkt auf dem Rand: kürzeste Mantellinie 4 cm, längste √(4² + 6²) = √52 ≈ 7,21 cm.</div>
    <div class="merke"><strong>Merke:</strong> Die Höhe steht immer senkrecht auf der Grundfläche. Seitenkanten und Mantellinien berechnest du mit Pythagoras aus der Höhe und dem waagrechten Abstand vom Fußpunkt der Höhe.</div>
  `,
  formulas: [
    { name: "Seitenkante", html: "s = √(h² + e²)", quantities: "e waagrechter Abstand vom Fußpunkt der Höhe zur Ecke" },
    { name: "Spitze über einer Ecke", html: "längste Kante = √(h² + 2a²)", quantities: "quadratische Grundfläche, Kante a" },
  ],
  quiz: {
    question: "Bei einer schiefen Pyramide liegt die Spitze nicht über der Mitte. Wie misst man ihre Höhe?",
    options: ["senkrecht von der Spitze zur Ebene der Grundfläche", "entlang der längsten Seitenkante", "entlang der kürzesten Seitenkante", "von der Spitze zum Mittelpunkt der Grundfläche"],
    correctIndex: 0,
    explanation: "Die Höhe ist immer der senkrechte Abstand der Spitze von der Grundfläche, egal wo ihr Fußpunkt liegt.",
  },
  lab: lab(
    "oblique-solid",
    "Die Spitze wandert",
    "Verschiebe die Spitze mit den Reglern nach links, rechts, vorne oder hinten. Die Höhe bleibt senkrecht; blau ist die kürzeste, orange die längste Kante.",
    [
      choice("body", "Körper", ["quadratische Pyramide", "Kegel"], 0),
      r("a", "Grundkante a (Kegel: Durchmesser)", 4, 8, 4, 1, "cm"),
      r("h", "Höhe h", 3, 8, 5, 1, "cm"),
      r("dx", "Spitze nach rechts", -4, 4, 1, 0.5, "cm"),
      r("dy", "Spitze nach hinten", -4, 4, 0, 0.5, "cm"),
    ],
    [
      o("art", "Körper ist", (v) => (v.dx === 0 && v.dy === 0 ? "gerade" : "schief")),
      o("fuss", "Abstand Fußpunkt zur Mitte", (v) => Math.hypot(v.dx, v.dy), "cm", 2, true),
    ],
    [
      { id: "gerade", text: "Mache den Körper gerade: Die Spitze steht über der Mitte.", check: (v) => v.dx === 0 && v.dy === 0 },
      { id: "ecke", text: "Pyramide: Lege die Spitze genau über eine Ecke. Eine Kante ist dann so lang wie die Höhe.", check: (v) => v.body === 0 && Math.abs(v.dx) === v.a / 2 && Math.abs(v.dy) === v.a / 2 },
      { id: "aussen", text: "Kegel: Lege den Fußpunkt der Höhe außerhalb der Grundfläche.", check: (v) => v.body === 1 && Math.hypot(v.dx, v.dy) > v.a / 2 },
    ],
  ),
  exercises: [
    {
      id: "pyramide",
      make: (rng, level) => {
        const a = rng.int(3, 10);
        const h = rng.int(4, 12);
        if (level === 1) {
          const longest = Math.sqrt(h * h + 2 * a * a);
          return task(
            level,
            `Bei einer schiefen quadratischen Pyramide (a = ${a} cm, h = ${h} cm) liegt die Spitze genau über der Ecke A. Wie lang ist die kürzeste Seitenkante, wie lang die längste?`,
            [num("kürzeste:", h, "cm", 2), num("längste:", longest, "cm", 2, { slips: [{ value: Math.hypot(h, a), hint: "Zur gegenüberliegenden Ecke C ist der waagrechte Abstand die Diagonale a · √2." }] })],
            "Die kürzeste Kante ist AS = h. Zur Ecke C: waagrecht die Diagonale AC = √(a² + a²), dann Pythagoras mit h.",
            [`AS = h = ${h} cm`, `AC² = ${a}² + ${a}² = ${2 * a * a}`, `CS = √(${h}² + ${2 * a * a}) = √${h * h + 2 * a * a}`],
            `kürzeste ${cm(h)}, längste ${eq(longest)} ${cm(longest)}`,
            { a, h },
            [`a = ${a} cm`, `h = ${h} cm`, "Spitze über A"],
          );
        }
        const short = Math.hypot(h, a / 2);
        const long = Math.hypot(h, (a * Math.sqrt(5)) / 2);
        return task(
          level,
          `Ein Zeltdach hat eine quadratische Grundfläche mit a = ${a} m. Die Spitze liegt ${h} m hoch genau über der Mitte der vorderen Kante AB. Wie lang sind die beiden vorderen und die beiden hinteren Dachkanten?`,
          [num("vorne:", short, "m", 2, { slips: [{ value: Math.hypot(h, a), hint: "Der Fußpunkt liegt in der Mitte von AB: waagrecht nur a : 2 bis A." }] }), num("hinten:", long, "m", 2, { slips: [{ value: Math.hypot(h, a), hint: "Zu C und D ist der waagrechte Abstand √(a² + (a : 2)²)." }] })],
          "Fußpunkt F in der Mitte von AB. Waagrechte Abstände: FA = a : 2 und FC = √(a² + (a : 2)²). Dann jeweils mit h Pythagoras.",
          [`FA = ${fmt(a / 2)} m, AS = √(${h}² + ${fmt(a / 2)}²)`, `FC² = ${a}² + ${fmt(a / 2)}² = ${fmt(a * a + (a / 2) ** 2)}, CS = √(${h}² + ${fmt(a * a + (a / 2) ** 2)})`],
          `vorne ${eq(short)} ${fmtUnit(short, "m")}, hinten ${eq(long)} ${fmtUnit(long, "m")}`,
          { a, h },
        );
      },
    },
    {
      id: "kegel",
      make: (rng, level) => {
        const radius = rng.int(2, 8);
        const h = rng.int(3, 12);
        if (level === 1) {
          const long = Math.hypot(h, 2 * radius);
          return task(
            level,
            `Bei einem schiefen Kegel (r = ${radius} cm, h = ${h} cm) liegt der Fußpunkt der Höhe genau auf dem Rand des Grundkreises. Wie lang ist die kürzeste, wie lang die längste Mantellinie?`,
            [num("kürzeste:", h, "cm", 2), num("längste:", long, "cm", 2, { slips: [{ value: Math.hypot(h, radius), hint: "Bis zum gegenüberliegenden Randpunkt ist es waagrecht ein ganzer Durchmesser, 2r." }] })],
            "Kürzeste Mantellinie: am Fußpunkt, also h. Längste: waagrecht der Durchmesser 2r, dann Pythagoras.",
            [`kürzeste = h = ${h} cm`, `längste = √(${h}² + ${2 * radius}²) = √${h * h + 4 * radius * radius}`],
            `${cm(h)} und ${eq(long)} ${cm(long)}`,
            { radius, h },
            [`r = ${radius} cm`, `h = ${h} cm`],
          );
        }
        const d = rng.int(1, radius - 1);
        const long = Math.hypot(h, radius + d);
        const short = Math.hypot(h, radius - d);
        return task(
          level,
          `Ein schiefer Kegel hat den Radius ${radius} cm und die Höhe ${h} cm. Der Fußpunkt der Höhe liegt ${d} cm vom Mittelpunkt des Grundkreises entfernt. Berechne die längste und die kürzeste Mantellinie.`,
          [num("längste:", long, "cm", 2, { slips: [{ value: Math.hypot(h, radius), hint: "Das wäre beim geraden Kegel. Hier ist der waagrechte Abstand r + Verschiebung." }] }), num("kürzeste:", short, "cm", 2)],
          "Waagrechter Abstand zum entferntesten Randpunkt: r + d, zum nächsten: r − d.",
          [`längste: √(${h}² + (${radius} + ${d})²) = √${h * h + (radius + d) ** 2}`, `kürzeste: √(${h}² + (${radius} − ${d})²) = √${h * h + (radius - d) ** 2}`],
          `längste ${eq(long)} ${cm(long)}, kürzeste ${eq(short)} ${cm(short)}`,
          { radius, h, d },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  3,
  "Rechtwinklige Dreiecke, Pythagoras, Vielecke und Körper",
  "#2563eb",
  "📐",
  [rechtwinklig, thaleskreis, pythagoras, anwenden, umkehrung, vielecke, pyramideKegel, schief],
);

