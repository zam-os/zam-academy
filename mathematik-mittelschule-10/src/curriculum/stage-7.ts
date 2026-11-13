import { factorForm, fmt, linear, point, quadratic, vertexForm } from "../exercises/format";
import {
  BINOMIALS,
  DATA_SETS,
  fractionSolution,
  intersectionKind,
  lineThrough,
  MODEL_TYPES,
  modelFits,
  parabolaThrough,
  SLOPES,
} from "../lab/views-funktionen";
import type { ExerciseTask } from "../model/types";
import { choiceField, numberField as num, yesNo } from "./helpers";
import { choice, lab, makeLesson, makeStage, NAMES, output as o, range as r, task } from "./builders";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(7, content);
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (same(value, Math.round(value * 10 ** digits) / 10 ** digits) ? "=" : "≈");
const SIGN_OPTIONS = [
  { value: 1, label: "nach oben (+x²)" },
  { value: -1, label: "nach unten (−x²)" },
];

// 7.1 Geradengleichungen ───────────────────────────────────────────────────

const geraden = L({
  id: "fz-1-geradengleichung",
  title: "Geradengleichungen aufstellen",
  subtitle: "Aus zwei Punkten oder aus Punkt und Steigung",
  whyItMatters:
    "Taxitarife, Handyverträge und Wasserstände ändern sich oft gleichmäßig. Kennst du zwei Werte, stellst du die Gleichung der Geraden auf und berechnest jeden weiteren Wert.",
  explanationHtml: `
    <p>Eine lineare Funktion hat die Gleichung <strong>y = m · x + t</strong>. m ist die <strong>Steigung</strong>, t der <strong>y-Achsenabschnitt</strong> (Wiederholung aus M9).</p>
    <ul>
      <li><strong>Zwei Punkte</strong> P(x₁ | y₁) und Q(x₂ | y₂): m = (y₂ − y₁) : (x₂ − x₁). Dann t aus einem Punkt: t = y₁ − m · x₁.</li>
      <li><strong>Punkt und Steigung</strong>: t = y − m · x.</li>
      <li><strong>Fehlende Werte</strong>: y einsetzen und nach x auflösen, x = (y − t) : m.</li>
      <li><strong>Schnittpunkt zweier Geraden</strong>: Terme gleichsetzen, x berechnen, y durch Einsetzen.</li>
    </ul>
    <p>Zeichnen: t auf der y-Achse markieren, dann mit dem Steigungsdreieck (1 nach rechts, m nach oben) weitergehen.</p>
    <div class="example"><strong>Beispiel:</strong> P(1 | 3) und Q(4 | 9). m = (9 − 3) : (4 − 1) = 6 : 3 = 2. t = 3 − 2 · 1 = 1. Also y = 2x + 1.<br>
    Für welches x ist y = 15? 15 = 2x + 1, also x = 7.</div>
    <div class="merke"><strong>Merke:</strong> m = (y₂ − y₁) : (x₂ − x₁), t = y − m · x. Schnittpunkte durch Gleichsetzen.</div>
  `,
  formulas: [
    { name: "Steigung aus zwei Punkten", html: "m = (y₂ − y₁) : (x₂ − x₁)", quantities: "P(x₁ | y₁), Q(x₂ | y₂)" },
    { name: "y-Achsenabschnitt", html: "t = y − m · x", quantities: "aus einem Punkt der Geraden" },
  ],
  quiz: {
    question: "Welche Steigung hat die Gerade durch A(2 | 1) und B(6 | 9)?",
    options: ["2", "0,5", "4", "8"],
    correctIndex: 0,
    explanation: "m = (9 − 1) : (6 − 2) = 8 : 4 = 2. 0,5 entsteht, wenn man Δx durch Δy teilt.",
  },
  lab: lab(
    "line-two-points",
    "Gerade durch zwei Punkte",
    "Ziehe P und Q. Das lila Steigungsdreieck zeigt Δx und Δy; rechts stehen m, t und die Gleichung.",
    [r("x1", "P: x", -6, 6, -2, 1), r("y1", "P: y", -6, 6, -1, 1), r("x2", "Q: x", -6, 6, 2, 1), r("y2", "Q: y", -6, 6, 1, 1)],
    [
      o("m", "Steigung m", (v) => (lineThrough(v) ? fmt(lineThrough(v)!.m, 2) : "senkrecht"), "", 0),
      o("eq", "Gleichung", (v) => (lineThrough(v) ? `y = ${linear(lineThrough(v)!.m, lineThrough(v)!.t)}` : `x = ${fmt(v.x1)}`), "", 0, true),
    ],
    [
      { id: "gerade-a", text: "Lege P und Q so, dass die Gerade y = 2x − 1 entsteht.", check: (v) => { const g = lineThrough(v); return !!g && same(g.m, 2) && same(g.t, -1); } },
      { id: "waagrecht", text: "Stelle eine waagrechte Gerade mit dem y-Achsenabschnitt 3 ein.", check: (v) => v.x1 !== v.x2 && v.y1 === 3 && v.y2 === 3 },
      { id: "fallend", text: "Stelle eine Gerade durch den Ursprung mit der Steigung −0,5 ein.", check: (v) => { const g = lineThrough(v); return !!g && same(g.m, -0.5) && same(g.t, 0); } },
    ],
  ),
  exercises: [
    {
      id: "zwei-punkte",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([-2, -1, -0.5, 0.5, 1, 2, 3]);
          const x1 = rng.int(-4, 2);
          const dx = rng.pick([2, 4]);
          const y1 = rng.int(-3, 3);
          const x2 = x1 + dx;
          const y2 = y1 + m * dx;
          const t = y1 - m * x1;
          return task(
            level,
            `Eine Gerade geht durch P${point(x1, y1)} und Q${point(x2, y2)}. Berechne die Steigung m und den y-Achsenabschnitt t.`,
            [num("m =", m, "", 2, { slips: [{ value: dx / (y2 - y1), hint: "Δy durch Δx, nicht umgekehrt." }] }), num("t =", t, "", 2)],
            "m = (y₂ − y₁) : (x₂ − x₁), dann t = y₁ − m · x₁.",
            [`m = (${fmt(y2)} − ${paren(y1)}) : (${fmt(x2)} − ${paren(x1)}) = ${fmt(y2 - y1)} : ${fmt(dx)} = ${fmt(m, 2)}`, `t = ${fmt(y1)} − ${paren(m)} · ${paren(x1)} = ${fmt(t, 2)}`],
            `y = ${linear(m, t)}`,
            { m, x1, dx, y1 },
          );
        }
        const t = rng.pick([3, 3.5, 4, 5]);
        const m = rng.pick([1.5, 1.8, 2, 2.2, 2.5]);
        const k1 = rng.pick([3, 4, 5]);
        const k2 = rng.pick([10, 12, 15]);
        const budget = rng.pick([30, 40, 50]);
        const km = (budget - t) / m;
        return task(
          level,
          `Ein Taxi berechnet für ${k1} km insgesamt ${fmt(t + m * k1)} € und für ${k2} km ${fmt(t + m * k2)} €. Der Preis setzt sich aus einer Grundgebühr und einem festen Preis pro Kilometer zusammen. Berechne beides. Wie weit kommt man mit ${budget} €?`,
          [num("pro km:", m, "€", 2), num("Grundgebühr:", t, "€", 2), num("Strecke:", km, "km", 2, { slips: [{ value: budget / m, hint: "Zuerst die Grundgebühr abziehen." }] })],
          "Zwei Punkte (km | €): Steigung = Preis pro km, y-Achsenabschnitt = Grundgebühr. Dann y = budget einsetzen.",
          [`m = (${fmt(t + m * k2)} − ${fmt(t + m * k1)}) : (${k2} − ${k1}) = ${fmt(m, 2)}`, `t = ${fmt(t + m * k1)} − ${fmt(m, 2)} · ${k1} = ${fmt(t, 2)}`, `${budget} = ${fmt(m, 2)}x + ${fmt(t, 2)} → x = (${budget} − ${fmt(t, 2)}) : ${fmt(m, 2)}`],
          `y = ${linear(m, t)}; mit ${budget} € etwa ${fmt(km, 2)} km`,
          { t, m, k1, k2, budget },
        );
      },
    },
    {
      id: "punkt-steigung",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([-3, -2, -1, 0.5, 1, 2, 4]);
          const px = rng.int(-3, 4);
          const py = rng.int(-4, 5);
          const t = py - m * px;
          const y = rng.pick([6, 8, 10, -6]);
          return task(
            level,
            `Eine Gerade hat die Steigung m = ${fmt(m)} und geht durch P${point(px, py)}. Berechne t. Für welches x ist y = ${fmt(y)}?`,
            [num("t =", t, "", 2, { slips: [{ value: py + m * px, hint: "t = y − m · x: Das Produkt wird abgezogen." }] }), num("x =", (y - t) / m, "", 2)],
            "t = y − m · x; dann y einsetzen und nach x auflösen.",
            [`t = ${fmt(py)} − ${paren(m)} · ${paren(px)} = ${fmt(t, 2)}`, `${fmt(y)} = ${linear(m, t)} → x = (${fmt(y)} − ${paren(t)}) : ${paren(m)}`],
            `t = ${fmt(t, 2)}, x ${eq((y - t) / m)} ${fmt((y - t) / m, 2)}`,
            { m, px, py, y },
          );
        }
        const xs = rng.int(-3, 4);
        const m1 = rng.pick([2, 3, -1]);
        const m2 = rng.pick([-2, 0.5, 1]);
        const ys = rng.int(-3, 5);
        const t1 = ys - m1 * xs;
        const ax = xs + 2;
        const bx = xs - 2;
        return task(
          level,
          `Gerade g hat die Steigung ${fmt(m1)} und geht durch A${point(ax, ys + 2 * m1)}. Gerade h geht durch B${point(bx, ys - 2 * m2)} und C${point(bx + 4, ys + 2 * m2)}. Berechne den Schnittpunkt S der beiden Geraden.`,
          [num("S: x =", xs, "", 2), num("S: y =", ys, "", 2)],
          "Erst beide Gleichungen aufstellen, dann gleichsetzen.",
          [`g: t = ${fmt(ys + 2 * m1)} − ${paren(m1)} · ${paren(ax)} → y = ${linear(m1, t1)}`, `h: m = ${fmt(4 * m2)} : 4 = ${fmt(m2, 2)} → y = ${linear(m2, ys - m2 * xs)}`, `gleichsetzen: ${linear(m1, t1)} = ${linear(m2, ys - m2 * xs)}`],
          `S${point(xs, ys)}`,
          { xs, ys, m1, m2 },
        );
      },
    },
  ],
});

// 7.2 Parallele und Senkrechte ─────────────────────────────────────────────

const parallel = L({
  id: "fz-2-parallel-senkrecht",
  title: "Parallele und senkrechte Geraden",
  subtitle: "Gleiche Steigung oder m₁ · m₂ = −1",
  whyItMatters:
    "Ein Weg soll parallel zu einer Straße verlaufen, eine Leitung senkrecht auf eine Wand treffen. Mit den Steigungen stellst du solche Geraden auf, ohne zu zeichnen.",
  explanationHtml: `
    <p><strong>Parallele Geraden</strong> haben dieselbe Steigung: m₁ = m₂.</p>
    <p><strong>Senkrechte Geraden</strong> (sie schneiden sich im rechten Winkel) erfüllen m₁ · m₂ = −1, also m₂ = −1 : m₁. Man nimmt den Kehrwert und ändert das Vorzeichen.</p>
    <p>Durch einen gegebenen Punkt P bestimmst du danach t wie gewohnt: t = y − m · x.</p>
    <div class="example"><strong>Beispiel:</strong> g: y = 2x + 1 und P(3 | 1).<br>
    Parallele durch P: m = 2, t = 1 − 2 · 3 = −5, also y = 2x − 5.<br>
    Senkrechte durch P: m = −1 : 2 = −0,5, t = 1 − (−0,5) · 3 = 2,5, also y = −0,5x + 2,5.</div>
    <div class="merke"><strong>Merke:</strong> parallel: gleiche Steigung. Senkrecht: m₂ = −1 : m₁ (Kehrwert mit anderem Vorzeichen).</div>
  `,
  formulas: [
    { name: "Parallele", html: "m₁ = m₂", quantities: "gleiche Steigung" },
    { name: "Senkrechte", html: "m₁ · m₂ = −1", quantities: "m₂ = −1 : m₁" },
  ],
  quiz: {
    question: "Die Gerade g hat die Steigung 4. Welche Steigung hat eine Gerade, die senkrecht zu g steht?",
    options: ["−1/4", "−4", "1/4", "4"],
    correctIndex: 0,
    explanation: "m₂ = −1 : 4 = −1/4. Dann gilt 4 · (−1/4) = −1. Mit −4 wäre das Produkt −16.",
  },
  lab: lab(
    "parallel-perp",
    "Parallele und Senkrechte durch P",
    "Wähle die Steigung von g und ziehe den Punkt P. Orange ist die Parallele, lila die Senkrechte durch P.",
    [
      { type: "choice", key: "m", label: "Steigung von g", options: SLOPES.map((value) => ({ value, label: fmt(value, 2) })), value: 0.5 },
      r("t", "y-Achsenabschnitt von g", -4, 4, 1, 0.5),
      r("px", "P: x", -6, 6, 2, 1),
      r("py", "P: y", -6, 6, 4, 1),
    ],
    [
      o("par", "Parallele", (v) => `y = ${linear(v.m, v.py - v.m * v.px)}`, "", 0),
      o("perp", "Senkrechte", (v) => `y = ${linear(-1 / v.m, v.py + v.px / v.m)}`, "", 0, true),
    ],
    [
      { id: "parallel-ursprung", text: "Lege P so, dass die Parallele durch den Ursprung geht.", check: (v) => same(v.py, v.m * v.px) },
      { id: "senkrecht-ursprung", text: "Lege P so, dass die Senkrechte durch den Ursprung geht.", check: (v) => same(v.py, -v.px / v.m) },
      { id: "t-vier", text: "Bei m = 0,5: Lege P so, dass die Senkrechte die y-Achse bei 4 schneidet.", check: (v) => v.m === 0.5 && same(v.py + 2 * v.px, 4) },
    ],
  ),
  exercises: [
    {
      id: "parallel",
      make: (rng, level) => {
        const m = rng.pick([-2, -1, -0.5, 0.5, 2, 4]);
        const t = rng.int(-3, 3);
        const px = rng.pick([-2, 2, 4]);
        const py = rng.int(-3, 5);
        const mp = -1 / m;
        if (level === 1) {
          return task(
            level,
            `Gegeben ist g: y = ${linear(m, t)} und der Punkt P${point(px, py)}. Bestimme den y-Achsenabschnitt der Parallelen zu g durch P und die Steigung einer Senkrechten zu g.`,
            [num("t der Parallelen:", py - m * px, "", 2), num("m der Senkrechten:", mp, "", 2, { slips: [{ value: -m, hint: "Nicht nur das Vorzeichen ändern: Kehrwert nehmen, −1 : m." }, { value: 1 / m, hint: "Beim Kehrwert auch das Vorzeichen ändern." }] })],
            "Parallele: gleiche Steigung, t = y − m · x. Senkrechte: m⊥ = −1 : m.",
            [`Parallele: t = ${fmt(py)} − ${paren(m)} · ${paren(px)} = ${fmt(py - m * px, 2)}`, `m⊥ = −1 : ${paren(m)} = ${fmt(mp, 2)}`],
            `Parallele y = ${linear(m, py - m * px)}, m⊥ = ${fmt(mp, 2)}`,
            { m, t, px, py },
          );
        }
        return task(
          level,
          `Eine Straße verläuft auf der Karte entlang der Geraden y = ${linear(m, t)} (1 Einheit = 100 m). Vom Haus H${point(px, py)} soll ein Weg auf kürzestem Weg, also senkrecht, zur Straße führen. Stelle die Gleichung des Weges auf.`,
          [num("m =", mp, "", 2, { slips: [{ value: m, hint: "Senkrecht heißt nicht parallel: m⊥ = −1 : m." }] }), num("t =", py - mp * px, "", 2)],
          "Senkrechte durch H: m⊥ = −1 : m, dann t = y − m⊥ · x.",
          [`m⊥ = −1 : ${paren(m)} = ${fmt(mp, 2)}`, `t = ${fmt(py)} − ${paren(mp)} · ${paren(px)} = ${fmt(py - mp * px, 2)}`],
          `Weg: y = ${linear(mp, py - mp * px)}`,
          { m, t, px, py },
        );
      },
    },
    {
      id: "lage",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.pick([-3, -2, -0.5, 0.5, 2, 3]);
          const kind = rng.int(0, 2);
          const m2 = kind === 0 ? m : kind === 1 ? -1 / m : rng.pick([m + 1, -m]);
          const t1 = rng.int(-4, 4);
          const t2 = t1 + rng.pick([-3, -2, 2, 3]);
          return task(
            level,
            `Wie liegen die Geraden g: y = ${linear(m, t1)} und h: y = ${linear(m2, t2)} zueinander? Berechne das Produkt der Steigungen.`,
            [choiceField("Lage:", ["parallel", "senkrecht", "weder noch"], kind), num("m₁ · m₂ =", m * m2, "", 2)],
            "Gleiche Steigung: parallel. Produkt −1: senkrecht.",
            [`m₁ = ${fmt(m, 2)}, m₂ = ${fmt(m2, 2)}`, `m₁ · m₂ = ${fmt(m * m2, 2)}`],
            kind === 0 ? "gleiche Steigung: parallel" : kind === 1 ? "Produkt −1: senkrecht" : "weder parallel noch senkrecht",
            { m, kind },
          );
        }
        const ax = rng.int(-4, -1);
        const ay = rng.int(-2, 2);
        const slope = rng.pick([0.5, 1, 2, -1, -2]);
        const bx = ax + 4;
        const by = ay + 4 * slope;
        const cx = rng.int(-1, 3);
        const cy = rng.int(3, 6);
        const mh = -1 / slope;
        return task(
          level,
          `Im Dreieck ABC ist A${point(ax, ay)}, B${point(bx, by)} und C${point(cx, cy)}. Die Höhe von C aus steht senkrecht auf der Seite AB. Bestimme die Gleichung der Geraden, auf der diese Höhe liegt.`,
          [num("m =", mh, "", 2), num("t =", cy - mh * cx, "", 2)],
          "Steigung von AB berechnen, dann die Senkrechte durch C.",
          [`m(AB) = ${fmt(by - ay)} : 4 = ${fmt(slope, 2)}`, `m⊥ = −1 : ${paren(slope)} = ${fmt(mh, 2)}`, `t = ${fmt(cy)} − ${paren(mh)} · ${paren(cx)}`],
          `y = ${linear(mh, cy - mh * cx)}`,
          { ax, ay, slope, cx, cy },
        );
      },
    },
  ],
});

// 7.3 Binomische Formeln ───────────────────────────────────────────────────

const binome = L({
  id: "fz-3-binomische-formeln",
  title: "Binomische Formeln",
  subtitle: "Terme zweiten Grades umformen",
  whyItMatters:
    "Die binomischen Formeln sind Abkürzungen beim Ausmultiplizieren und beim Zerlegen in Faktoren. Du brauchst sie für die Scheitelpunktform, für quadratische Gleichungen und zum geschickten Kopfrechnen.",
  explanationHtml: `
    <table class="mini">
      <tr><th>Formel</th><th>Beispiel</th></tr>
      <tr><td>1. (a + b)² = a² + 2ab + b²</td><td>(x + 3)² = x² + 6x + 9</td></tr>
      <tr><td>2. (a − b)² = a² − 2ab + b²</td><td>(2x − 5)² = 4x² − 20x + 25</td></tr>
      <tr><td>3. (a + b)(a − b) = a² − b²</td><td>(x + 4)(x − 4) = x² − 16</td></tr>
    </table>
    <p>Als Flächen: Ein Quadrat mit der Seite a + b besteht aus a², zweimal ab und b². Deshalb fehlt bei (a + b)² = a² + b² das Mittelglied 2ab, ein häufiger Fehler.</p>
    <p><strong>Rückwärts</strong> (Faktorisieren): x² − 10x + 25 = (x − 5)², denn 25 = 5² und 10x = 2 · x · 5.</p>
    <div class="example"><strong>Beispiel:</strong> (3x + 2)² = 9x² + 12x + 4, denn a = 3x, b = 2: a² = 9x², 2ab = 2 · 3x · 2 = 12x, b² = 4.<br>
    Kopfrechnen: 21 · 19 = (20 + 1)(20 − 1) = 400 − 1 = 399.</div>
    <div class="merke"><strong>Merke:</strong> (a ± b)² = a² ± 2ab + b², (a + b)(a − b) = a² − b². Das Mittelglied 2ab nie vergessen.</div>
  `,
  formulas: [
    { name: "1. binomische Formel", html: "(a + b)² = a² + 2ab + b²", quantities: "" },
    { name: "2. binomische Formel", html: "(a − b)² = a² − 2ab + b²", quantities: "" },
    { name: "3. binomische Formel", html: "(a + b)(a − b) = a² − b²", quantities: "" },
  ],
  quiz: {
    question: "Welcher Term ist gleich (x + 5)²?",
    options: ["x² + 10x + 25", "x² + 25", "x² + 5x + 25", "x² + 10x + 10"],
    correctIndex: 0,
    explanation: "Mit a = x und b = 5: a² + 2ab + b² = x² + 2 · x · 5 + 25 = x² + 10x + 25. Ohne das Mittelglied fehlen die zwei Rechtecke 5x.",
  },
  lab: lab(
    "binomial-area",
    "Binomische Formeln als Flächen",
    "Wähle eine Formel und ziehe die Längen a und b. Die Teilflächen zeigen jedes Glied der Formel.",
    [choice("formula", "Formel", BINOMIALS, 0), r("a", "Länge a", 1, 6, 4, 0.5), r("b", "Länge b", 0.5, 4, 2, 0.5)],
    [
      o("left", "linke Seite", (v) => (v.formula === 0 ? (v.a + v.b) ** 2 : v.formula === 1 ? (v.a - v.b) ** 2 : (v.a + v.b) * (v.a - v.b)), "", 2, true),
      o("middle", "Mittelglied 2ab", (v) => 2 * v.a * v.b, "", 2),
    ],
    [
      { id: "gleich", text: "1. Formel: Mache die beiden Rechtecke ab zusammen genauso groß wie a² + b².", check: (v) => v.formula === 0 && v.a === v.b },
      { id: "minus", text: "2. Formel: Stelle (5 − 3)² ein und vergleiche 25 − 30 + 9.", check: (v) => v.formula === 1 && v.a === 5 && v.b === 3 },
      { id: "dritte", text: "3. Formel: Berechne 7 · 3 als (a + b)(a − b). Welche a und b passen?", check: (v) => v.formula === 2 && v.a === 5 && v.b === 2 },
    ],
  ),
  exercises: [
    {
      id: "ausmultiplizieren",
      make: (rng, level) => {
        const c = rng.int(2, 9);
        const kind = rng.int(0, 2);
        if (level === 1) {
          const b = kind === 0 ? 2 * c : kind === 1 ? -2 * c : 0;
          const k = kind === 2 ? -c * c : c * c;
          const left = kind === 0 ? `(x + ${c})²` : kind === 1 ? `(x − ${c})²` : `(x + ${c})(x − ${c})`;
          return task(
            level,
            `Multipliziere mit einer binomischen Formel aus: ${left} = x² + b · x + c. Gib b und c an.`,
            [num("b =", b, "", 0, { slips: kind < 2 ? [{ value: kind === 0 ? c : -c, hint: "Das Mittelglied ist 2 · a · b." }] : [] }), num("c =", k, "", 0)],
            `${BINOMIALS[kind]} = ${kind === 0 ? "a² + 2ab + b²" : kind === 1 ? "a² − 2ab + b²" : "a² − b²"} mit a = x, b = ${c}`,
            [kind === 2 ? `x² − ${c}²` : `x² ${kind === 0 ? "+" : "−"} 2 · x · ${c} + ${c}²`],
            `${left} = ${quadratic(1, b, k)}`,
            { c, kind },
          );
        }
        const a = rng.pick([2, 3, 4]);
        const sign = kind === 1 ? -1 : 1;
        const left = kind === 2 ? `(${a}x + ${c})(${a}x − ${c})` : `(${a}x ${sign > 0 ? "+" : "−"} ${c})²`;
        const A = a * a;
        const B = kind === 2 ? 0 : 2 * a * c * sign;
        const C = kind === 2 ? -c * c : c * c;
        return task(
          level,
          `Schreibe ${left} ohne Klammern in der Form A · x² + B · x + C.`,
          [num("A =", A, "", 0, { slips: [{ value: a, hint: "(" + a + "x)² = " + a + "² · x²." }] }), num("B =", B, "", 0), num("C =", C, "", 0)],
          "a ist hier der ganze Term mit x, also a² = (kx)² = k² · x².",
          [`a = ${a}x, b = ${c}`, kind === 2 ? `a² − b² = ${A}x² − ${c * c}` : `a² ${sign > 0 ? "+" : "−"} 2ab + b² = ${A}x² ${sign > 0 ? "+" : "−"} ${2 * a * c}x + ${c * c}`],
          `${left} = ${quadratic(A, B, C)}`,
          { a, c, kind },
        );
      },
    },
    {
      id: "faktorisieren",
      make: (rng, level) => {
        if (level === 1) {
          const c = rng.int(2, 9);
          const kind = rng.int(0, 2);
          const term = kind === 0 ? quadratic(1, 2 * c, c * c) : kind === 1 ? quadratic(1, -2 * c, c * c) : quadratic(1, 0, -c * c);
          return task(
            level,
            `Schreibe ${term} als Produkt. Welche binomische Formel passt, und welche Zahl b steht in der Klammer?`,
            [choiceField("Formel:", BINOMIALS.map((f, i) => `${i + 1}. ${f}`), kind), num("b =", c, "", 0, { slips: [{ value: c * c, hint: "b ist die Wurzel aus dem letzten Glied." }] })],
            "Letztes Glied = b². Mittelglied ± 2 · x · b. Ohne Mittelglied und mit Minus: 3. Formel.",
            [`${c * c} = ${c}²`, kind === 2 ? "kein Mittelglied, Differenz: 3. Formel" : `${2 * c}x = 2 · x · ${c}`],
            kind === 0 ? `(x + ${c})²` : kind === 1 ? `(x − ${c})²` : `(x + ${c})(x − ${c})`,
            { c, kind },
          );
        }
        const n = rng.pick([20, 30, 40, 50, 60, 70, 80, 90]);
        const d = rng.int(1, 3);
        const kind = rng.int(0, 2);
        const value = kind === 0 ? (n + d) ** 2 : kind === 1 ? (n - d) ** 2 : (n + d) * (n - d);
        const shown = kind === 0 ? `${n + d}²` : kind === 1 ? `${n - d}²` : `${n + d} · ${n - d}`;
        // The prompt fixes a and b: 67² could also be split as (60 + 7)², with another middle term.
        const split = kind === 0 ? `(${n} + ${d})²` : kind === 1 ? `(${n} − ${d})²` : `(${n} + ${d}) · (${n} − ${d})`;
        return task(
          level,
          `Rechne im Kopf mit einer binomischen Formel: ${shown} = ${split}, also a = ${n} und b = ${d}. Gib das Ergebnis und ${kind === 2 ? "das Glied b²" : "das Mittelglied 2ab"} an.`,
          [num("Ergebnis:", value, "", 0), num(kind === 2 ? "b² =" : "2ab =", kind === 2 ? d * d : 2 * n * d, "", 0)],
          `${kind === 0 ? "(a + b)² = a² + 2ab + b²" : kind === 1 ? "(a − b)² = a² − 2ab + b²" : "(a + b)(a − b) = a² − b²"} mit a = ${n} und b = ${d}.`,
          [kind === 0 ? `(${n} + ${d})² = ${fmt(n * n)} + ${2 * n * d} + ${d * d}` : kind === 1 ? `(${n} − ${d})² = ${fmt(n * n)} − ${2 * n * d} + ${d * d}` : `(${n} + ${d})(${n} − ${d}) = ${fmt(n * n)} − ${d * d}`],
          `${shown} = ${fmt(value)}`,
          { n, d, kind },
        );
      },
    },
  ],
});

// 7.4 Quadratische Gleichungen ─────────────────────────────────────────────

const gleichungen = L({
  id: "fz-4-quadratische-gleichungen",
  title: "Quadratische Gleichungen lösen",
  subtitle: "Ergänzen, Lösungsformel, Zeichnung, Faktorisieren",
  whyItMatters:
    "Wie breit muss ein Beet sein, damit es 40 m² hat und 3 m länger als breit ist? Solche Fragen führen auf quadratische Gleichungen. Du lernst mehrere Verfahren und wählst das passende.",
  explanationHtml: `
    <p><strong>Reinquadratisch</strong> (ohne x-Glied): x² = d. Ist d &gt; 0, gibt es zwei Lösungen ±√d; bei d = 0 eine Lösung (0); bei d &lt; 0 keine.</p>
    <p><strong>Gemischtquadratisch</strong> ax² + bx + c = 0 (Wiederholung der Klammerregeln aus M9). Verfahren:</p>
    <ul>
      <li><strong>Faktorisieren:</strong> x² − 5x + 6 = (x − 2)(x − 3) = 0. Ein Produkt ist 0, wenn ein Faktor 0 ist: x = 2 oder x = 3. Schnell, wenn man die Faktoren sieht; ebenso x² − 4x = x(x − 4).</li>
      <li><strong>Quadratische Ergänzung:</strong> x² + 6x − 7 = 0 → (x + 3)² − 9 − 7 = 0 → (x + 3)² = 16 → x + 3 = ±4.</li>
      <li><strong>Lösungsformel:</strong> x₁,₂ = (−b ± √(b² − 4ac)) : (2a). Die <strong>Diskriminante</strong> D = b² − 4ac entscheidet: D &gt; 0 zwei, D = 0 eine, D &lt; 0 keine Lösung. Funktioniert immer.</li>
      <li><strong>Zeichnung:</strong> Die Lösungen sind die Nullstellen der Parabel. Anschaulich, aber oft ungenau.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> x² − 2x − 8 = 0 mit a = 1, b = −2, c = −8: D = 4 + 32 = 36. x₁,₂ = (2 ± 6) : 2, also x₁ = −2 und x₂ = 4. Probe mit Faktoren: (x + 2)(x − 4) = x² − 2x − 8.<br>
    In Sachaufgaben prüfen: Eine negative Länge ergibt keinen Sinn und fällt weg.</div>
    <div class="merke"><strong>Merke:</strong> Lösungsformel x₁,₂ = (−b ± √D) : (2a) mit D = b² − 4ac. Faktorisieren ist am schnellsten, wenn die Faktoren erkennbar sind. Ergebnisse auf Plausibilität prüfen.</div>
  `,
  formulas: [
    { name: "Lösungsformel", html: "x₁,₂ = (−b ± √(b² − 4ac)) : (2a)", quantities: "für ax² + bx + c = 0" },
    { name: "Diskriminante", html: "D = b² − 4ac", quantities: "D > 0: zwei, D = 0: eine, D < 0: keine Lösung" },
  ],
  quiz: {
    question: "Wie viele Lösungen hat die Gleichung x² + 4 = 0?",
    options: ["keine", "zwei: 2 und −2", "eine: −2", "eine: 2"],
    correctIndex: 0,
    explanation: "x² = −4. Kein Quadrat ist negativ, also gibt es keine Lösung. Die Parabel y = x² + 4 liegt ganz über der x-Achse.",
  },
  lab: lab(
    "roots",
    "Lösungen als Nullstellen",
    "Ziehe die Nullstellen x₁ und x₂ auf der x-Achse. Oben stehen die Gleichung und ihre faktorisierte Form.",
    [r("x1", "Nullstelle x₁", -6, 6, -1, 0.5), r("x2", "Nullstelle x₂", -6, 6, 1, 0.5), { type: "choice", key: "a", label: "Öffnung", options: SIGN_OPTIONS, value: 1 }],
    [
      o("eq", "Gleichung", (v) => `${quadratic(v.a, -v.a * (v.x1 + v.x2), v.a * v.x1 * v.x2)} = 0`, "", 0, true),
      o("D", "Diskriminante D", (v) => (v.x1 - v.x2) ** 2, "", 2),
    ],
    [
      { id: "zwei-fuenf", text: "Stelle die Gleichung (x − 2)(x + 5) = 0 ein.", check: (v) => v.a === 1 && [v.x1, v.x2].sort((p, q) => p - q).join() === "-5,2" },
      { id: "doppelt", text: "Erzeuge eine nach unten geöffnete Parabel mit nur einer Lösung bei x = 3.", check: (v) => v.x1 === 3 && v.x2 === 3 && v.a === -1 },
      { id: "allgemein", text: "Stelle die Parabel zur Gleichung x² − 2x − 3 = 0 ein.", check: (v) => v.a === 1 && [v.x1, v.x2].sort((p, q) => p - q).join() === "-1,3" },
    ],
  ),
  exercises: [
    {
      id: "loesen",
      make: (rng, level) => {
        if (level === 1) {
          let r1 = 0;
          let r2 = 0;
          do {
            r1 = rng.int(-6, 5);
            r2 = rng.int(-5, 7);
          } while (r1 >= r2);
          const b = -(r1 + r2);
          const c = r1 * r2;
          return task(
            level,
            `Löse die Gleichung ${quadratic(1, b, c)} = 0. Gib die kleinere und die größere Lösung an.`,
            [num("x₁ =", r1, "", 2), num("x₂ =", r2, "", 2)],
            "Lösungsformel mit a = 1 oder Faktorisieren: Welche zwei Zahlen ergeben multipliziert c und addiert −b?",
            [`D = ${paren(b)}² − 4 · 1 · ${paren(c)} = ${fmt(b * b - 4 * c)}`, `x₁,₂ = (${fmt(-b)} ± ${fmt(Math.sqrt(b * b - 4 * c))}) : 2`, `Probe: ${factorForm(1, r1, r2)}`],
            `x₁ = ${fmt(r1)}, x₂ = ${fmt(r2)}`,
            { r1, r2 },
          );
        }
        const w = rng.int(4, 12);
        const d = rng.int(2, 6);
        const area = w * (w + d);
        return task(
          level,
          `Ein rechteckiges Beet soll ${area} m² groß werden. Es ist ${d} m länger als breit. Stelle eine Gleichung auf und berechne Breite und Länge.`,
          [num("Breite:", w, "m", 2, { slips: [{ value: -(w + d), hint: "Diese Lösung der Gleichung ist negativ und als Länge nicht sinnvoll." }] }), num("Länge:", w + d, "m", 2)],
          "Breite x, Länge x + d: x · (x + d) = Fläche. Negative Lösungen fallen weg.",
          [`x(x + ${d}) = ${area} → ${quadratic(1, d, -area)} = 0`, `D = ${d * d} + ${4 * area} = ${d * d + 4 * area}`, `x = (−${d} ± ${fmt(Math.sqrt(d * d + 4 * area))}) : 2 → ${w} oder ${fmt(-(w + d))}`],
          `Breite ${w} m, Länge ${w + d} m`,
          { w, d },
        );
      },
    },
    {
      id: "anzahl",
      make: (rng, level) => {
        if (level === 1) {
          const d = rng.pick([-9, -4, 0, 4, 9, 16, 25, 2, 5]);
          const count = d > 0 ? 2 : d === 0 ? 1 : 0;
          const fields: ExerciseTask["fields"] = [choiceField("Anzahl der Lösungen:", ["keine", "eine", "zwei"], count)];
          if (count > 0) fields.push(num("größte Lösung:", Math.sqrt(d), "", 2));
          return task(
            level,
            `Wie viele Lösungen hat die Gleichung x² ${d < 0 ? "+" : "−"} ${fmt(Math.abs(d))} = 0? ${count > 0 ? "Gib die größte Lösung an." : "Begründe."}`.replace("x² − 0 = 0", "x² = 0"),
            fields,
            "Umformen zu x² = d. d > 0: ±√d; d = 0: nur 0; d < 0: keine Lösung.",
            [`x² = ${fmt(d)}`],
            count === 0 ? "keine Lösung, denn ein Quadrat ist nie negativ" : count === 1 ? "eine Lösung: x = 0" : `zwei Lösungen: ±${fmt(Math.sqrt(d), 2)}`,
            { d },
          );
        }
        const b = rng.int(-8, 8);
        const kind = rng.int(0, 2);
        const c = kind === 0 ? Math.floor((b * b) / 4) - rng.int(1, 6) : kind === 1 && b % 2 === 0 ? (b * b) / 4 : Math.floor((b * b) / 4) + rng.int(1, 6);
        const D = b * b - 4 * c;
        const count = D > 0 ? 2 : D === 0 ? 1 : 0;
        return task(
          level,
          `Ohne die Gleichung zu lösen: Wie viele Lösungen hat ${quadratic(1, b, c)} = 0? Berechne dafür die Diskriminante.`,
          [num("D =", D, "", 0, { slips: [{ value: b * b + 4 * c, hint: "D = b² − 4ac: Achte auf das Vorzeichen von c." }] }), choiceField("Lösungen:", ["keine", "eine", "zwei"], count)],
          "D = b² − 4ac mit a = 1. D > 0: zwei, D = 0: eine, D < 0: keine.",
          [`D = ${paren(b)}² − 4 · 1 · ${paren(c)} = ${fmt(D)}`],
          `D = ${fmt(D)}: ${count === 2 ? "zwei Lösungen" : count === 1 ? "eine Lösung" : "keine Lösung"}`,
          { b, c },
        );
      },
    },
  ],
});

// 7.5 Bruchgleichungen ─────────────────────────────────────────────────────

const bruch = L({
  id: "fz-5-bruchgleichungen",
  title: "Bruchgleichungen",
  subtitle: "Definitionsmenge und Lösungsmenge",
  whyItMatters:
    "Wenn Kosten auf x Personen verteilt werden oder eine Strecke in x Stunden gefahren wird, steht die Variable im Nenner. Solche Bruchgleichungen löst du sicher, wenn du zuerst die verbotenen Werte ausschließt.",
  explanationHtml: `
    <p>In einer <strong>Bruchgleichung</strong> steht die Variable im Nenner, oft auch im Zähler (Wiederholung aus M9).</p>
    <ol>
      <li><strong>Definitionsmenge D:</strong> Alle Zahlen ausschließen, für die ein Nenner 0 wird.</li>
      <li>Mit dem <strong>Hauptnenner</strong> multiplizieren, sodass keine Brüche mehr vorkommen.</li>
      <li>Die entstandene Gleichung lösen.</li>
      <li><strong>Prüfen</strong>, ob die Lösung in D liegt. Sonst gehört sie nicht zur Lösungsmenge L.</li>
    </ol>
    <div class="example"><strong>Beispiel:</strong> (x + 3) : (x − 1) = 2. D = ℚ \\ {1}.<br>
    Mal (x − 1): x + 3 = 2(x − 1) = 2x − 2, also x = 5. 5 liegt in D: L = {5}.<br>
    Probe: (5 + 3) : (5 − 1) = 8 : 4 = 2.<br>
    Dagegen 4 : (x − 2) = 0 hat keine Lösung, denn ein Bruch ist nur 0, wenn sein Zähler 0 ist: L = { }.</div>
    <div class="merke"><strong>Merke:</strong> Erst D bestimmen (Nenner ≠ 0), dann mit dem Hauptnenner multiplizieren, lösen und mit D vergleichen.</div>
  `,
  formulas: [{ name: "Bruchgleichung", html: "D: Nenner ≠ 0; L ⊆ D", quantities: "Lösung immer mit D vergleichen" }],
  quiz: {
    question: "Welche Zahl gehört nicht zur Definitionsmenge der Gleichung 5 : (x + 3) = 2?",
    options: ["−3", "3", "0", "5"],
    correctIndex: 0,
    explanation: "Für x = −3 wird der Nenner x + 3 = 0, und durch 0 kann man nicht teilen. D = ℚ \\ {−3}.",
  },
  lab: lab(
    "fraction-eq",
    "Bruchgleichung als Schnitt",
    "Die blaue Kurve ist die linke Seite a : (x − b), die orange Gerade die rechte Seite c. Die gestrichelte Linie zeigt die Definitionslücke. Ziehe c und b.",
    [r("a", "Zähler a", -12, 12, 6, 1), r("b", "Lücke b", -4, 4, 2, 1), r("c", "rechte Seite c", -4, 4, 1, 0.5)],
    [
      o("D", "Definitionsmenge", (v) => `ℚ \\ {${fmt(v.b)}}`, "", 0),
      o("L", "Lösungsmenge", (v) => {
        const s = fractionSolution(v.a, v.b, v.c);
        return s === null ? "{ }" : `{${fmt(s, 2)}}`;
      }, "", 0, true),
    ],
    [
      { id: "keine", text: "Stelle die rechte Seite so ein, dass die Gleichung keine Lösung hat (a ≠ 0).", check: (v) => v.a !== 0 && v.c === 0 },
      { id: "loesung-vier", text: "Stelle 6 : (x − 1) = 2 ein. Welche Lösung hat die Gleichung?", check: (v) => v.a === 6 && v.b === 1 && v.c === 2 },
      { id: "luecke", text: "Verschiebe die Lücke nach x = −2 und stelle eine Gleichung mit der Lösung x = 0 ein.", check: (v) => v.b === -2 && fractionSolution(v.a, v.b, v.c) !== null && same(fractionSolution(v.a, v.b, v.c)!, 0) },
    ],
  ),
  exercises: [
    {
      id: "loesen",
      make: (rng, level) => {
        if (level === 1) {
          const b = rng.int(-4, 4);
          const c = rng.pick([1, 2, 3, 4, -2]);
          const k = rng.pick([1, 2, 3, 4, 5, -1, -3]);
          const a = c * k;
          const x = b + k;
          const den = b === 0 ? "x" : `(x ${b > 0 ? "−" : "+"} ${Math.abs(b)})`;
          return task(
            level,
            `Gegeben ist die Gleichung ${fmt(a)} : ${den} = ${fmt(c)}. Welche Zahl ist aus der Definitionsmenge ausgeschlossen? Berechne die Lösung.`,
            [num("ausgeschlossen:", b, "", 0, { slips: [{ value: -b, hint: "Der Nenner wird 0, wenn x die Zahl hinter dem Minus ist." }] }), num("x =", x, "", 2)],
            "Nenner = 0 setzen ergibt die Lücke. Dann mit dem Nenner multiplizieren.",
            [`D = ℚ \\ {${fmt(b)}}`, `${fmt(a)} = ${fmt(c)} · ${den}`, `x = ${fmt(b)} + ${paren(a)} : ${paren(c)} = ${fmt(x)}`],
            `L = {${fmt(x)}}`,
            { a, b, c },
          );
        }
        const rr = rng.pick([2, 3, -1]);
        const q = rng.int(1, 5);
        let x = q;
        while (x === q) x = rng.int(-4, 8);
        const p = rr * (x - q) - x;
        const num0 = p === 0 ? "x" : `(x ${p > 0 ? "+" : "−"} ${Math.abs(p)})`;
        return task(
          level,
          `Bestimme Definitionsmenge und Lösungsmenge der Gleichung ${num0} : (x − ${q}) = ${fmt(rr)}.`,
          [num("ausgeschlossen:", q, "", 0), num("x =", x, "", 2)],
          "Mit (x − " + q + ") multiplizieren, Klammer auflösen, x auf eine Seite bringen.",
          [`D = ℚ \\ {${q}}`, `${p === 0 ? "x" : `x ${p > 0 ? "+" : "−"} ${Math.abs(p)}`} = ${fmt(rr)} · (x − ${q})`, `x = ${fmt(x)}; liegt in D`],
          `L = {${fmt(x)}}`,
          { rr, q, x },
        );
      },
    },
    {
      id: "sachaufgabe",
      make: (rng, level) => {
        if (level === 1) {
          const each = rng.pick([40, 45, 50, 60, 75, 80]);
          const people = rng.int(4, 12);
          const total = each * people;
          return task(
            level,
            `Ein Ferienhaus kostet ${fmt(total)} €. Die Kosten werden gleichmäßig auf x Freunde verteilt, und jeder zahlt ${each} €. Stelle eine Bruchgleichung auf. Welche Zahl ist für x ausgeschlossen? Wie viele Freunde sind es?`,
            [num("ausgeschlossen:", 0, "", 0), num("x =", people, "", 0)],
            `${fmt(total)} : x = ${each}; durch 0 Personen kann man nicht teilen.`,
            [`${fmt(total)} : x = ${each}`, `D = ℚ \\ {0}`, `x = ${fmt(total)} : ${each}`],
            `${people} Freunde`,
            { each, people },
          );
        }
        const e = rng.pick([1, 2]);
        let x = rng.int(4, 10);
        if (e === 2 && x % 2 === 1) x += 1;
        const d = rng.pick([5, 10, 15, 20]);
        const total = (d * x * (x + e)) / e;
        return task(
          level,
          `Ein Gewinn von ${fmt(total)} € wird gleichmäßig auf x Personen verteilt. Wären es ${e} ${e === 1 ? "Person" : "Personen"} mehr, bekäme jeder ${d} € weniger. Stelle eine Bruchgleichung auf und berechne x.`,
          [num("x =", x, "", 0, { slips: [{ value: -(x + e), hint: "Diese Lösung ist negativ und als Personenzahl nicht sinnvoll." }] })],
          `${fmt(total)} : x − ${fmt(total)} : (x + ${e}) = ${d}; mit x(x + ${e}) multiplizieren.`,
          [`D = ℚ \\ {0; −${e}}`, `${fmt(total)}(x + ${e}) − ${fmt(total)}x = ${d}x(x + ${e})`, `${quadratic(d, d * e, -total * e)} = 0 → x = ${x} (die negative Lösung fällt weg)`],
          `${x} Personen; jede bekommt ${fmt(total / x)} €`,
          { e, x, d },
        );
      },
    },
  ],
});

// 7.6 Abhängigkeiten erkennen ──────────────────────────────────────────────

const abhaengig = L({
  id: "fz-6-abhaengigkeiten",
  title: "Lineare, umgekehrt proportionale und quadratische Abhängigkeiten",
  subtitle: "In Situationen, Tabellen und Graphen unterscheiden",
  whyItMatters:
    "Kosten wachsen mit der Menge, die Fahrzeit sinkt mit der Geschwindigkeit, der Bremsweg wächst mit dem Quadrat der Geschwindigkeit. Wer erkennt, welche Abhängigkeit vorliegt, rechnet mit dem richtigen Modell.",
  explanationHtml: `
    <table class="mini">
      <tr><th>Abhängigkeit</th><th>Gleichung</th><th>Tabelle</th><th>Graph</th></tr>
      <tr><td>linear</td><td>y = m · x + t</td><td>gleiche Differenzen bei gleichen x-Schritten</td><td>Gerade</td></tr>
      <tr><td>proportional</td><td>y = k · x</td><td>Quotient y : x immer gleich</td><td>Gerade durch den Ursprung</td></tr>
      <tr><td>umgekehrt proportional</td><td>y = k : x</td><td>Produkt x · y immer gleich</td><td>Hyperbelast</td></tr>
      <tr><td>quadratisch</td><td>y = a · x² (+ …)</td><td>verdoppelt sich x, vervierfacht sich y</td><td>Parabel</td></tr>
    </table>
    <div class="example"><strong>Beispiel:</strong> 24 Pizzastücke werden auf x Personen verteilt: 1 → 24, 2 → 12, 3 → 8, 4 → 6. Das Produkt ist immer 24: umgekehrt proportional, y = 24 : x.<br>
    Ein Stein fällt in x Sekunden etwa 5 · x² Meter: nach 1 s 5 m, nach 2 s 20 m. Doppelte Zeit, vierfacher Weg: quadratisch.</div>
    <div class="merke"><strong>Merke:</strong> Differenzen gleich: linear. Produkte gleich: umgekehrt proportional. Doppeltes x gibt vierfaches y: quadratisch (y = a · x²).</div>
  `,
  formulas: [
    { name: "linear", html: "y = m · x + t", quantities: "proportional: t = 0" },
    { name: "umgekehrt proportional", html: "y = k : x", quantities: "x · y = k" },
    { name: "quadratisch", html: "y = a · x²", quantities: "doppeltes x, vierfaches y" },
  ],
  quiz: {
    question: "In einer Tabelle ist das Produkt x · y für alle Wertepaare 36. Welche Abhängigkeit liegt vor?",
    options: ["umgekehrt proportional", "linear", "quadratisch", "proportional"],
    correctIndex: 0,
    explanation: "Ein konstantes Produkt kennzeichnet umgekehrte Proportionalität: y = 36 : x. Bei proportionalen Größen wäre der Quotient y : x konstant.",
  },
  lab: lab(
    "dependencies",
    "Welches Modell passt?",
    "Wähle eine Situation, einen Modelltyp und den Faktor k (Griff auf der Kurve). Das Modell passt, wenn es alle blauen Messpunkte trifft.",
    [choice("data", "Situation", DATA_SETS.map((d) => d.title), 0), choice("type", "Modell", MODEL_TYPES, 0), r("k", "Faktor k", 1, 24, 1, 1)],
    [
      o("fits", "passt?", (v) => (modelFits(v) ? "ja, alle Punkte" : "nein"), "", 0, true),
    ],
    [
      { id: "aepfel", text: "Finde das Modell für die Äpfel.", check: (v) => v.data === 0 && modelFits(v) },
      { id: "pizza", text: "Finde das Modell für die Pizzastücke.", check: (v) => v.data === 1 && modelFits(v) },
      { id: "fall", text: "Finde das Modell für den Fallweg.", check: (v) => v.data === 2 && modelFits(v) },
    ],
  ),
  exercises: [
    {
      id: "tabelle",
      make: (rng, level) => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          const k = rng.pick([2, 3, 4, 6]);
          const xs = kind === 1 ? [1, 2, 3, 4, 6] : [1, 2, 3, 4, 5];
          const t = kind === 0 ? rng.int(1, 5) : 0;
          const f = (x: number) => (kind === 0 ? k * x + t : kind === 1 ? (12 * k) / x : k * x * x);
          const nextX = kind === 1 ? 12 : 6;
          return task(
            level,
            `Untersuche die Wertetabelle: ${xs.map((x) => `x = ${x}: y = ${fmt(f(x), 2)}`).join("; ")}. Welche Abhängigkeit liegt vor? Berechne y für x = ${nextX}.`,
            [choiceField("Abhängigkeit:", ["linear", "umgekehrt proportional", "quadratisch"], kind), num("y =", f(nextX), "", 2)],
            "Prüfe Differenzen (linear), Produkte x · y (umgekehrt proportional) und ob doppeltes x vierfaches y gibt (quadratisch).",
            [kind === 0 ? `Differenzen immer ${k}` : kind === 1 ? `x · y immer ${12 * k}` : `x = 1 → ${k}, x = 2 → ${4 * k}: vierfach`],
            `${["linear", "umgekehrt proportional", "quadratisch"][kind]}, y = ${fmt(f(nextX), 2)}`,
            { kind, k, t },
          );
        }
        const cases = [
          { text: "Ein Rechteck soll immer 48 m² Fläche haben. Länge y in Abhängigkeit von der Breite x.", kind: 1, x: 6, y: 8 },
          { text: "Ein Handyvertrag kostet 9 € Grundgebühr und 0,10 € pro SMS. Kosten y für x SMS.", kind: 0, x: 40, y: 13 },
          { text: "Ein Quadrat hat die Seitenlänge x cm. Flächeninhalt y in cm².", kind: 2, x: 7, y: 49 },
          { text: "Für eine Strecke von 180 km braucht man bei x km/h die Zeit y in Stunden.", kind: 1, x: 90, y: 2 },
          { text: "Der Bremsweg y (in m) eines Autos beträgt etwa (x : 10)² bei x km/h.", kind: 2, x: 50, y: 25 },
          { text: "Ein Wassertank enthält 500 Liter und verliert jede Minute 4 Liter. Inhalt y nach x Minuten.", kind: 0, x: 30, y: 380 },
        ];
        const c = rng.pick(cases);
        return task(
          level,
          `${c.text} Welche Abhängigkeit liegt vor? Berechne y für x = ${fmt(c.x)}.`,
          [choiceField("Abhängigkeit:", ["linear", "umgekehrt proportional", "quadratisch"], c.kind), num("y =", c.y, "", 2)],
          "Stelle dir vor, x verdoppelt sich: Was passiert mit y?",
          [c.kind === 0 ? "gleiche Änderung pro Schritt" : c.kind === 1 ? "Produkt x · y bleibt gleich" : "y wächst mit x²"],
          `${["linear", "umgekehrt proportional", "quadratisch"][c.kind]}, y = ${fmt(c.y, 2)}`,
          { kind: c.kind, x: c.x },
        );
      },
    },
    {
      id: "umgekehrt",
      make: (rng, level) => {
        if (level === 1) {
          const k = rng.pick([24, 36, 48, 60, 72]);
          const x1 = rng.pick([2, 3, 4, 6]);
          const x2 = rng.pick([8, 12]);
          return task(
            level,
            `x und y sind umgekehrt proportional. Für x = ${x1} ist y = ${fmt(k / x1)}. Berechne den Faktor k und y für x = ${x2}.`,
            [num("k =", k, "", 2, { slips: [{ value: k / x1 / x1, hint: "Bei umgekehrter Proportionalität ist das Produkt x · y konstant." }] }), num("y =", k / x2, "", 2)],
            "k = x · y; dann y = k : x.",
            [`k = ${x1} · ${fmt(k / x1)} = ${k}`, `y = ${k} : ${x2}`],
            `k = ${k}, y = ${fmt(k / x2, 2)}`,
            { k, x1, x2 },
          );
        }
        const workers = rng.pick([4, 6, 8, 12]);
        const days = rng.pick([5, 6, 9, 10, 15]);
        const total = workers * days;
        const fewer = rng.pick([2, 3, 5].filter((n) => total % n === 0 && n !== workers));
        const target = rng.pick([2, 3, 4].filter((n) => total % n === 0 && n !== days));
        return task(
          level,
          `${workers} Arbeiter brauchen für einen Auftrag ${days} Tage. Wie lange brauchen ${fewer} Arbeiter bei gleicher Arbeitsleistung? Wie viele Arbeiter braucht man, um in ${target} Tagen fertig zu werden?`,
          [num("Tage:", total / fewer, "", 2, { slips: [{ value: (days * fewer) / workers, hint: "Arbeiter und Tage sind umgekehrt proportional: Das Produkt bleibt gleich." }] }), num("Arbeiter:", total / target, "", 2)],
          "Arbeiter · Tage bleibt gleich (Gesamtarbeit in Arbeitstagen).",
          [`Gesamtarbeit: ${workers} · ${days} = ${total} Arbeitstage`, `${total} : ${fewer}`, `${total} : ${target}`],
          `${fmt(total / fewer, 2)} Tage; ${fmt(total / target, 2)} Arbeiter`,
          { workers, days },
        );
      },
    },
  ],
});

// 7.7 Quadratische Funktionen in Scheitelpunktform ─────────────────────────

const scheitel = L({
  id: "fz-7-scheitelpunktform",
  title: "Quadratische Funktionen: Scheitelpunktform",
  subtitle: "y = ±(x − xₛ)² + yₛ in Tabelle, Graph und Gleichung",
  whyItMatters:
    "Der Bogen einer Brücke, ein Wasserstrahl, der Wurf eines Balls: Viele Kurven sind Parabeln. In der Scheitelpunktform liest du den höchsten oder tiefsten Punkt direkt ab.",
  explanationHtml: `
    <p>Die <strong>Normalparabel</strong> y = x² hat den Scheitel S(0 | 0). Verschiebt man sie um xₛ nach rechts und um yₛ nach oben, entsteht</p>
    <p class="formula-line">y = (x − xₛ)² + yₛ mit dem Scheitel S(xₛ | yₛ).</p>
    <p>Mit Minus davor, y = −(x − xₛ)² + yₛ, ist die Parabel <strong>nach unten geöffnet</strong>; der Scheitel ist dann der höchste Punkt.</p>
    <ul>
      <li>Achtung beim Vorzeichen: y = (x + 3)² − 1 hat S(−3 | −1).</li>
      <li>Die Parabel ist symmetrisch zur Geraden x = xₛ.</li>
      <li>Wertetabelle: Vom Scheitel aus 1 nach rechts → 1 nach oben (unten), 2 nach rechts → 4, 3 nach rechts → 9.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Ein Wasserstrahl folgt y = −(x − 3)² + 4 (in m). Der höchste Punkt ist S(3 | 4): 4 m Höhe, 3 m vom Start. Er trifft den Boden bei (x − 3)² = 4, also x = 1 und x = 5.</div>
    <div class="merke"><strong>Merke:</strong> y = ±(x − xₛ)² + yₛ hat den Scheitel S(xₛ | yₛ). Plus: nach oben offen, Minus: nach unten offen. Das Vorzeichen in der Klammer kehrt sich um.</div>
  `,
  formulas: [{ name: "Scheitelpunktform", html: "y = ±(x − xₛ)² + yₛ", quantities: "Scheitel S(xₛ | yₛ)" }],
  quiz: {
    question: "Welchen Scheitel hat die Parabel y = (x + 3)² − 1?",
    options: ["S(−3 | −1)", "S(3 | −1)", "S(−3 | 1)", "S(3 | 1)"],
    correctIndex: 0,
    explanation: "x + 3 = x − (−3), also xₛ = −3. Das −1 hinten ist yₛ. S(3 | −1) wäre der Scheitel von (x − 3)² − 1.",
  },
  lab: lab(
    "vertex",
    "Normalparabel verschieben",
    "Ziehe den Scheitel S und wähle die Öffnung. Die Treppe zeigt die Schritte der Normalparabel: 1 nach rechts, 1 hoch; 2 nach rechts, 4 hoch.",
    [r("d", "xₛ", -6, 6, 0, 0.5), r("e", "yₛ", -4, 6, 0, 0.5), { type: "choice", key: "s", label: "Öffnung", options: SIGN_OPTIONS, value: 1 }],
    [
      o("term", "Gleichung", (v) => `y = ${vertexForm(v.s, v.d, v.e)}`, "", 0, true),
      o("S", "Scheitel", (v) => `S${point(v.d, v.e)}`, "", 0),
      o("zeros", "Anzahl Nullstellen", (v) => (v.e === 0 ? 1 : v.s * v.e < 0 ? 2 : 0), "", 0),
    ],
    [
      { id: "zwei-punkte", text: "Lege eine nach oben offene Parabel durch die Punkte (1 | 2) und (5 | 2).", check: (v) => v.s === 1 && v.d === 3 && v.e === -2 },
      { id: "beruehren", text: "Eine nach unten offene Parabel soll die x-Achse links vom Ursprung berühren.", check: (v) => v.s === -1 && v.e === 0 && v.d < 0 },
      { id: "y-fuenf", text: "Eine nach oben offene Parabel soll die y-Achse bei 5 schneiden, aber die x-Achse nicht treffen.", check: (v) => v.s === 1 && v.d * v.d + v.e === 5 && v.e > 0 },
    ],
  ),
  exercises: [
    {
      id: "ablesen",
      make: (rng, level) => {
        if (level === 1) {
          const d = rng.int(-5, 5);
          const e = rng.int(-4, 5);
          const s = rng.pick([1, -1]);
          return task(
            level,
            `Gib den Scheitel der Parabel y = ${vertexForm(s, d, e)} an. Ist sie nach oben oder nach unten geöffnet?`,
            [num("xₛ =", d, "", 2, { slips: d !== 0 ? [{ value: -d, hint: "Das Vorzeichen in der Klammer kehrt sich um: (x − xₛ)." }] : [] }), num("yₛ =", e, "", 2), choiceField("Öffnung:", ["nach oben", "nach unten"], s === 1 ? 0 : 1)],
            "y = ±(x − xₛ)² + yₛ: S(xₛ | yₛ); Minus vor der Klammer heißt nach unten.",
            [`Klammer ${d === 0 ? "x²" : `(x ${d > 0 ? "−" : "+"} ${Math.abs(d)})`}: xₛ = ${fmt(d)}`, `yₛ = ${fmt(e)}`],
            `S${point(d, e)}, nach ${s === 1 ? "oben" : "unten"} geöffnet`,
            { d, e, s },
          );
        }
        const d = rng.int(2, 6);
        const h = rng.pick([1, 4, 9, 16]);
        const w = Math.sqrt(h);
        return task(
          level,
          `Der Strahl eines Springbrunnens folgt y = ${vertexForm(-1, d, h)} (x und y in m, y = 0 ist die Wasseroberfläche). Wie hoch steigt der Strahl? Wo trifft er wieder auf das Wasser, und wie weit ist das vom Austrittspunkt entfernt?`,
          [num("Höhe:", h, "m", 2), num("Auftreffen bei x =", d + w, "m", 2), num("Abstand:", 2 * w, "m", 2, { slips: [{ value: w, hint: "Die Nullstellen liegen symmetrisch links und rechts vom Scheitel." }] })],
          "Höchster Punkt = Scheitel. Nullstellen: (x − xₛ)² = yₛ.",
          [`S${point(d, h)}`, `(x − ${d})² = ${h} → x = ${d} ± ${w}`, `${fmt(d + w)} − ${paren(d - w)} = ${fmt(2 * w)}`],
          `${h} m hoch, trifft bei x = ${d + w} auf, ${2 * w} m vom Austritt entfernt`,
          { d, h },
        );
      },
    },
    {
      id: "wertetabelle",
      make: (rng, level) => {
        const d = rng.int(-3, 3);
        const e = rng.int(-4, 4);
        const s = rng.pick([1, -1]);
        const f = (x: number) => s * (x - d) ** 2 + e;
        if (level === 1) {
          const x1 = d + rng.pick([-2, -1, 1, 2, 3]);
          const x2 = d - (x1 - d);
          return task(
            level,
            `Berechne für y = ${vertexForm(s, d, e)} die Funktionswerte bei x = ${fmt(x1)} und x = ${fmt(x2)}. Was fällt dir auf?`,
            [num("y(" + fmt(x1) + ") =", f(x1), "", 2), num("y(" + fmt(x2) + ") =", f(x2), "", 2)],
            "Einsetzen: erst die Klammer, dann quadrieren, dann ± und yₛ.",
            [`y(${fmt(x1)}) = ${s === -1 ? "−" : ""}(${fmt(x1)} − ${paren(d)})² ${e < 0 ? "−" : "+"} ${Math.abs(e)}`, `Beide x-Werte liegen gleich weit vom Scheitel entfernt: Symmetrie.`],
            `beide ${fmt(f(x1), 2)}: symmetrisch zu x = ${fmt(d)}`,
            { d, e, s, x1 },
          );
        }
        const px = d + rng.pick([-3, -2, 2, 3]);
        const py = rng.int(-5, 8);
        const eNeeded = py - s * (px - d) ** 2;
        return task(
          level,
          `Eine ${s === 1 ? "nach oben" : "nach unten"} geöffnete Normalparabel hat ihren Scheitel auf der Geraden x = ${fmt(d)} und geht durch P${point(px, py)}. Bestimme yₛ und die Funktionsgleichung.`,
          [num("yₛ =", eNeeded, "", 2)],
          "Ansatz y = ±(x − xₛ)² + yₛ, P einsetzen und nach yₛ auflösen.",
          [`${fmt(py)} = ${s === -1 ? "−" : ""}(${fmt(px)} − ${paren(d)})² + yₛ`, `yₛ = ${fmt(py)} ${s === 1 ? "−" : "+"} ${fmt((px - d) ** 2)}`],
          `yₛ = ${fmt(eNeeded)}, y = ${vertexForm(s, d, eNeeded)}`,
          { d, s, px, py },
        );
      },
    },
  ],
});

// 7.8 Normalform und Scheitelpunktform ────────────────────────────────────

const umformen = L({
  id: "fz-8-normalform",
  title: "Normalform und Scheitelpunktform",
  subtitle: "Ausmultiplizieren und quadratisch ergänzen",
  whyItMatters:
    "Die Normalform zeigt sofort den Schnittpunkt mit der y-Achse, die Scheitelpunktform den Scheitel. Wer zwischen beiden wechseln kann, wählt für jede Frage die passende Form, etwa für den größten Gewinn eines Betriebs.",
  explanationHtml: `
    <p><strong>Normalform:</strong> y = ±x² + px + q. Der Schnittpunkt mit der y-Achse ist (0 | q).</p>
    <p><strong>Scheitelpunktform → Normalform:</strong> mit einer binomischen Formel ausmultiplizieren.</p>
    <p><strong>Normalform → Scheitelpunktform:</strong> <strong>quadratische Ergänzung</strong>. Man addiert und subtrahiert (p : 2)², sodass eine binomische Formel entsteht. Bei −x² klammert man zuerst −1 aus.</p>
    <div class="example"><strong>Beispiel:</strong> y = (x − 3)² + 1 = x² − 6x + 9 + 1 = x² − 6x + 10.<br>
    y = x² + 8x + 10 = x² + 8x + 4² − 4² + 10 = (x + 4)² − 6, also S(−4 | −6).<br>
    y = −x² + 6x − 5 = −(x² − 6x) − 5 = −[(x − 3)² − 9] − 5 = −(x − 3)² + 4, also S(3 | 4).</div>
    <div class="merke"><strong>Merke:</strong> Ausmultiplizieren führt zur Normalform, quadratisches Ergänzen mit (p : 2)² zur Scheitelpunktform. Für y = x² + px + q ist S(−p : 2 | q − (p : 2)²).</div>
  `,
  formulas: [
    { name: "Quadratische Ergänzung", html: "x² + px = (x + p/2)² − (p/2)²", quantities: "" },
    { name: "Scheitel aus der Normalform", html: "S(−p/2 | q − (p/2)²)", quantities: "für y = x² + px + q" },
  ],
  quiz: {
    question: "Welche Scheitelpunktform gehört zu y = x² − 6x + 5?",
    options: ["y = (x − 3)² − 4", "y = (x + 3)² − 4", "y = (x − 3)² + 5", "y = (x − 6)² + 5"],
    correctIndex: 0,
    explanation: "x² − 6x + 5 = x² − 6x + 9 − 9 + 5 = (x − 3)² − 4. Die Ergänzung 9 muss auch wieder abgezogen werden.",
  },
  lab: lab(
    "square-tiles",
    "Quadratische Ergänzung mit Kacheln",
    "x² und die beiden Rechtecke bx/2 bilden fast ein Quadrat. Ziehe das Eckquadrat, bis es genau passt; rechts entsteht die Scheitelpunktform.",
    [
      { type: "choice", key: "b", label: "Koeffizient p", options: [2, 4, 6, 8, 10].map((b) => ({ value: b, label: `${b}x` })), value: 4 },
      r("q", "Ergänzung", 0, 30, 0, 1),
      r("c", "Konstante q", -10, 10, 0, 1),
    ],
    [
      o("fits", "Eckquadrat", (v) => (v.q === (v.b / 2) ** 2 ? "passt genau" : v.q < (v.b / 2) ** 2 ? "zu klein" : "zu groß"), "", 0),
      o("S", "Scheitel", (v) => (v.q === (v.b / 2) ** 2 ? `S${point(-v.b / 2, v.c - v.q)}` : "erst ergänzen"), "", 0, true),
    ],
    [
      { id: "sechs", text: "Ergänze x² + 6x zu einem vollständigen Quadrat.", check: (v) => v.b === 6 && v.q === 9 },
      { id: "zehn", text: "Ergänze x² + 10x zu einem vollständigen Quadrat.", check: (v) => v.b === 10 && v.q === 25 },
      { id: "scheitel", text: "Bestimme den Scheitel von y = x² + 8x + 10.", check: (v) => v.b === 8 && v.q === 16 && v.c === 10 },
    ],
  ),
  exercises: [
    {
      id: "zur-normalform",
      make: (rng, level) => {
        const d = rng.int(-5, 5);
        const e = rng.int(-6, 6);
        const s = level === 1 ? 1 : -1;
        const p = -2 * d * s;
        const q = s * d * d + e;
        return task(
          level,
          `Schreibe y = ${vertexForm(s, d, e)} in der Normalform y = ${s === 1 ? "" : "−"}x² + px + q. Gib p und q an.`,
          [num("p =", p, "", 2, { slips: [{ value: -d * s, hint: "Das Mittelglied der binomischen Formel ist 2 · x · " + Math.abs(d) + "." }] }), num("q =", q, "", 2, { slips: s === -1 ? [{ value: d * d + e, hint: "Das Minus vor der Klammer gilt für alle Glieder in der Klammer." }] : [] })],
          s === 1 ? "Binomische Formel ausmultiplizieren, dann yₛ addieren." : "Erst die Klammer ausmultiplizieren, dann das Minus auf jedes Glied anwenden.",
          [`${d === 0 ? "x²" : `(x ${d > 0 ? "−" : "+"} ${Math.abs(d)})² = ${quadratic(1, -2 * d, d * d)}`}`, s === -1 ? `−(${quadratic(1, -2 * d, d * d)}) = ${quadratic(-1, 2 * d, -d * d)}` : "", `${e < 0 ? "−" : "+"} ${Math.abs(e)}`].filter(Boolean),
          `y = ${quadratic(s, p, q)}`,
          { d, e },
        );
      },
    },
    {
      id: "zur-scheitelform",
      make: (rng, level) => {
        if (level === 1) {
          const p = 2 * rng.int(-5, 5);
          const q = rng.int(-8, 10);
          const xs = -p / 2;
          const ys = q - (p / 2) ** 2;
          return task(
            level,
            `Bestimme mit quadratischer Ergänzung den Scheitel der Parabel y = ${quadratic(1, p, q)}.`,
            [num("xₛ =", xs, "", 2, { slips: p !== 0 ? [{ value: p / 2, hint: "Aus x² + px wird (x + p/2)²: xₛ = −p/2." }] : [] }), num("yₛ =", ys, "", 2, { slips: [{ value: q + (p / 2) ** 2, hint: "Die Ergänzung (p/2)² muss wieder abgezogen werden." }] })],
            "x² + px + q = (x + p/2)² − (p/2)² + q",
            [`(p/2)² = ${fmt((p / 2) ** 2)}`, `y = ${quadratic(1, p, 0)} + ${fmt((p / 2) ** 2)} − ${fmt((p / 2) ** 2)} ${q < 0 ? "−" : "+"} ${Math.abs(q)}`, `y = ${vertexForm(1, xs, ys)}`],
            `S${point(xs, ys)}`,
            { p, q },
          );
        }
        const d = rng.pick([15, 20, 25, 30]);
        const e = rng.pick([100, 150, 200, 225]);
        const b = 2 * d;
        const c = -(d * d - e);
        return task(
          level,
          `Ein kleiner Betrieb berechnet seinen Tagesgewinn mit G(x) = ${quadratic(-1, b, c)} (G in €, x verkaufte Stück). Bei welcher Stückzahl ist der Gewinn am größten, und wie groß ist er dann?`,
          [num("Stückzahl:", d, "", 0), num("Gewinn:", e, "€", 2)],
          "−1 ausklammern, quadratisch ergänzen: G(x) = −(x − xₛ)² + yₛ. Der Scheitel ist das Maximum.",
          [`G(x) = −(x² − ${b}x) ${c < 0 ? "−" : "+"} ${fmt(Math.abs(c))}`, `= −[(x − ${d})² − ${d * d}] ${c < 0 ? "−" : "+"} ${fmt(Math.abs(c))}`, `= ${vertexForm(-1, d, e)}`],
          `größter Gewinn ${fmt(e)} € bei ${d} Stück`,
          { d, e },
        );
      },
    },
  ],
});

// 7.9 Funktionsgleichung aus zwei Punkten ─────────────────────────────────

const zweiPunkte = L({
  id: "fz-9-zwei-punkte",
  title: "Parabelgleichung aus zwei Punkten",
  subtitle: "Einsetzen und Gleichungssystem lösen",
  whyItMatters:
    "Von einer Brücke oder einem Torbogen kennt man oft nur zwei Punkte, etwa die Fußpunkte. Ist die Form y = ±x² + px + q bekannt, reichen zwei Punkte, um die ganze Gleichung zu bestimmen.",
  explanationHtml: `
    <p>Gesucht ist y = x² + px + q (oder y = −x² + px + q). Unbekannt sind nur p und q. Jeder Punkt liefert durch Einsetzen eine lineare Gleichung. Zwei Punkte ergeben ein <strong>lineares Gleichungssystem</strong> (Wiederholung aus M9), das du mit dem Additions- oder Einsetzungsverfahren löst.</p>
    <div class="example"><strong>Beispiel:</strong> P(1 | 2) und Q(3 | 6) liegen auf y = x² + px + q.<br>
    P: 2 = 1 + p + q, also p + q = 1.<br>
    Q: 6 = 9 + 3p + q, also 3p + q = −3.<br>
    Subtrahieren: 2p = −4, p = −2; dann q = 1 − (−2) = 3. Ergebnis: y = x² − 2x + 3.<br>
    Probe mit Q: 9 − 6 + 3 = 6. ✓<br>
    Liegt ein Punkt auf der y-Achse, etwa (0 | 4), ist sofort q = 4.</div>
    <div class="merke"><strong>Merke:</strong> Beide Punkte in y = ±x² + px + q einsetzen, das Gleichungssystem für p und q lösen, mit einem Punkt die Probe machen.</div>
  `,
  formulas: [{ name: "Ansatz", html: "y = ±x² + px + q, zwei Punkte einsetzen", quantities: "lineares Gleichungssystem für p und q" }],
  quiz: {
    question: "Die Parabel y = x² + px + q geht durch den Punkt (0 | 4). Was folgt daraus?",
    options: ["q = 4", "p = 4", "p + q = 4", "p = −4"],
    correctIndex: 0,
    explanation: "Einsetzen: 4 = 0² + p · 0 + q, also q = 4. Für p braucht man einen zweiten Punkt.",
  },
  lab: lab(
    "parabola-fit",
    "Parabel durch P und Q",
    "Ziehe P und Q. Es gibt genau eine Parabel y = x² + px + q (bzw. −x²) durch beide Punkte, solange sie nicht übereinander liegen.",
    [r("x1", "P: x", -5, 5, -1, 1), r("y1", "P: y", -5, 7, 2, 1), r("x2", "Q: x", -5, 5, 2, 1), r("y2", "Q: y", -5, 7, 3, 1), { type: "choice", key: "s", label: "Öffnung", options: SIGN_OPTIONS, value: 1 }],
    [
      o("eq", "Gleichung", (v) => {
        const pq = parabolaThrough(v);
        return pq ? `y = ${quadratic(v.s, pq.p, pq.q)}` : "keine Funktion";
      }, "", 0, true),
    ],
    [
      { id: "normal", text: "Lege P und Q so, dass genau die Normalparabel y = x² entsteht.", check: (v) => { const pq = parabolaThrough(v); return v.s === 1 && !!pq && same(pq.p, 0) && same(pq.q, 0); } },
      { id: "scheitel", text: "Nach oben geöffnet: Lege P und Q so, dass der Scheitel bei (2 | −1) liegt.", check: (v) => { const pq = parabolaThrough(v); return v.s === 1 && !!pq && same(pq.p, -4) && same(pq.q, 3); } },
      { id: "unten", text: "Nach unten geöffnet: Erzeuge y = −x² + 2x + 3.", check: (v) => { const pq = parabolaThrough(v); return v.s === -1 && !!pq && same(pq.p, 2) && same(pq.q, 3); } },
    ],
  ),
  exercises: [
    {
      id: "gleichungssystem",
      make: (rng, level) => {
        if (level === 1) {
          const p = rng.int(-6, 6);
          const q = rng.int(-5, 6);
          let x1 = 0;
          let x2 = 0;
          while (x1 === x2) {
            x1 = rng.int(-3, 3);
            x2 = rng.int(-3, 3);
          }
          const f = (x: number) => x * x + p * x + q;
          return task(
            level,
            `Die Punkte P${point(x1, f(x1))} und Q${point(x2, f(x2))} liegen auf der Parabel y = x² + px + q. Berechne p und q.`,
            [num("p =", p, "", 2), num("q =", q, "", 2)],
            "Beide Punkte einsetzen; die zwei linearen Gleichungen voneinander abziehen.",
            [`P: ${fmt(f(x1))} = ${fmt(x1 * x1)} + ${paren(x1)}p + q → ${fmt(x1)}p + q = ${fmt(f(x1) - x1 * x1)}`, `Q: ${fmt(f(x2))} = ${fmt(x2 * x2)} + ${paren(x2)}p + q → ${fmt(x2)}p + q = ${fmt(f(x2) - x2 * x2)}`, `subtrahieren: ${fmt(x1 - x2)}p = ${fmt(f(x1) - x1 * x1 - f(x2) + x2 * x2)}`],
            `p = ${fmt(p)}, q = ${fmt(q)}: y = ${quadratic(1, p, q)}`,
            { p, q, x1, x2 },
          );
        }
        const half = rng.int(2, 6);
        const shift = rng.int(-2, 2);
        const left = shift - half;
        const right = shift + half;
        const p = left + right;
        const q = -left * right;
        const top = q + (p / 2) ** 2;
        return task(
          level,
          `Ein Torbogen hat die Form y = −x² + px + q (in m). Seine Fußpunkte liegen bei (${fmt(left)} | 0) und (${fmt(right)} | 0). Bestimme p und q. Wie hoch ist der Bogen?`,
          [num("p =", p, "", 2), num("q =", q, "", 2), num("Höhe:", top, "m", 2, { slips: [{ value: q, hint: "q ist die Höhe bei x = 0; der höchste Punkt liegt in der Mitte der Fußpunkte." }] })],
          "Fußpunkte einsetzen (y = 0), Gleichungssystem lösen. Höchster Punkt in der Mitte zwischen den Fußpunkten.",
          [`0 = −${fmt(left * left)} + ${paren(left)}p + q und 0 = −${fmt(right * right)} + ${paren(right)}p + q`, `p = ${fmt(p)}, q = ${fmt(q)}`, `Mitte x = ${fmt(p / 2)}: y = ${fmt(top)}`],
          `y = ${quadratic(-1, p, q)}, Höhe ${fmt(top)} m`,
          { left, right },
        );
      },
    },
    {
      id: "pruefen",
      make: (rng, level) => {
        const p = rng.int(-6, 6);
        const q = rng.int(-5, 6);
        const f = (x: number) => x * x + p * x + q;
        if (level === 1) {
          const x = rng.int(-3, 4);
          const on = rng.next() < 0.5;
          const y = f(x) + (on ? 0 : rng.pick([-2, -1, 1, 2]));
          return task(
            level,
            `Liegt der Punkt A${point(x, y)} auf der Parabel y = ${quadratic(1, p, q)}? Berechne den Funktionswert an der Stelle x = ${fmt(x)}.`,
            [num("y(" + fmt(x) + ") =", f(x), "", 2), yesNo("A liegt auf der Parabel?", on)],
            "x einsetzen und mit dem y-Wert des Punktes vergleichen.",
            [`y(${fmt(x)}) = ${fmt(x * x)} + ${paren(p)} · ${paren(x)} + ${paren(q)} = ${fmt(f(x))}`],
            on ? "ja, A liegt auf der Parabel" : `nein, an der Stelle ${fmt(x)} ist y = ${fmt(f(x))}`,
            { p, q, x },
          );
        }
        const x = rng.int(-4, 5);
        const y = rng.int(-4, 8);
        const qq = y - x * x - p * x;
        return task(
          level,
          `Die Parabel y = ${quadratic(1, p, 0)} + q geht durch P${point(x, y)}. Bestimme q und den Scheitel der Parabel.`,
          [num("q =", qq, "", 2), num("xₛ =", -p / 2, "", 2), num("yₛ =", qq - (p / 2) ** 2, "", 2)],
          "P einsetzen ergibt q; dann quadratisch ergänzen.",
          [`${fmt(y)} = ${fmt(x * x)} + ${paren(p)} · ${paren(x)} + q → q = ${fmt(qq)}`, `y = ${vertexForm(1, -p / 2, qq - (p / 2) ** 2)}`],
          `q = ${fmt(qq)}, S${point(-p / 2, qq - (p / 2) ** 2)}`,
          { p, x, y },
        );
      },
    },
  ],
});

// 7.10 Schnittpunkte ───────────────────────────────────────────────────────

const schnitt = L({
  id: "fz-10-schnittpunkte",
  title: "Achsenschnittpunkte und Schnittpunkte",
  subtitle: "Parabel mit Achsen, Geraden und Parabeln",
  whyItMatters:
    "Wo trifft ein Ball den Boden, wo kreuzt eine Straße eine Bahnlinie? Schnittpunkte berechnest du immer gleich: Gleichungen gleichsetzen und die entstandene Gleichung lösen.",
  explanationHtml: `
    <ul>
      <li><strong>y-Achse:</strong> x = 0 einsetzen. Bei y = x² + px + q ist das (0 | q).</li>
      <li><strong>x-Achse (Nullstellen):</strong> y = 0 setzen und die quadratische Gleichung lösen.</li>
      <li><strong>Parabel und Gerade:</strong> Terme gleichsetzen, alles auf eine Seite bringen, quadratische Gleichung lösen. Zwei, eine oder keine Lösung: Die Gerade schneidet, berührt oder verfehlt die Parabel. Die y-Werte erhältst du durch Einsetzen in die Geradengleichung.</li>
      <li><strong>Zwei Parabeln:</strong> ebenso gleichsetzen. Haben beide x² mit gleichem Vorzeichen, fällt x² weg und es bleibt eine lineare Gleichung.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> y = x² − 4 und y = x + 2. Gleichsetzen: x² − 4 = x + 2, also x² − x − 6 = 0 = (x − 3)(x + 2). x₁ = 3, x₂ = −2. Einsetzen: S₁(3 | 5), S₂(−2 | 0).<br>
    y = x² + 2x und y = x² − 4x + 6: 2x = −4x + 6, x = 1, y = 3: S(1 | 3).</div>
    <div class="merke"><strong>Merke:</strong> Schnittpunkte: gleichsetzen, auf Normalform bringen, lösen, y durch Einsetzen. Vorgehen in Worten beschreiben können.</div>
  `,
  formulas: [{ name: "Schnittpunkt", html: "f(x) = g(x) setzen, lösen, y = f(x)", quantities: "y-Achse: x = 0; x-Achse: y = 0" }],
  quiz: {
    question: "Wie viele gemeinsame Punkte haben die Parabel y = x² und die Gerade y = −1?",
    options: ["keinen", "einen", "zwei", "unendlich viele"],
    correctIndex: 0,
    explanation: "x² = −1 hat keine Lösung, weil Quadrate nie negativ sind. Die Gerade y = −1 liegt ganz unter der Parabel.",
  },
  lab: lab(
    "parabola-line",
    "Parabel und Gerade",
    "Ziehe den y-Achsenabschnitt und die Steigung der Geraden. Die grünen Punkte sind die Schnittpunkte mit y = x² − 4.",
    [r("m", "Steigung m", -4, 4, 1, 0.5), r("t", "y-Achsenabschnitt t", -6, 6, 1, 0.25)],
    [
      o("D", "Diskriminante D", (v) => intersectionKind(v.m, v.t).D, "", 3, true),
      o("points", "gemeinsame Punkte", (v) => {
        const { xs } = intersectionKind(v.m, v.t);
        return xs.length === 0 ? "keine" : xs.map((x) => point(x, v.m * x + v.t)).join(", ");
      }, "", 0),
    ],
    [
      { id: "tangente", text: "Lege die Gerade so, dass sie die Parabel nur berührt.", check: (v) => intersectionKind(v.m, v.t).D === 0 },
      { id: "passante-steigend", text: "Erzeuge eine steigende Gerade, die die Parabel nicht trifft.", check: (v) => v.m > 0 && intersectionKind(v.m, v.t).D < 0 },
      { id: "sekante-punkte", text: "Lege die Gerade durch die Parabelpunkte mit x = −1 und x = 3.", check: (v) => v.m === 2 && v.t === -1 },
    ],
  ),
  exercises: [
    {
      id: "achsen",
      make: (rng, level) => {
        let r1 = 0;
        let r2 = 0;
        do {
          r1 = rng.int(-6, 4);
          r2 = rng.int(-4, 6);
        } while (r1 >= r2);
        const s = level === 1 ? 1 : -1;
        const p = -s * (r1 + r2);
        const q = s * r1 * r2;
        return task(
          level,
          level === 1
            ? `Berechne die Schnittpunkte der Parabel y = ${quadratic(1, p, q)} mit den Koordinatenachsen.`
            : `Ein Bogen folgt y = ${quadratic(-1, p, q)}. Wo schneidet er die x-Achse, und in welcher Höhe schneidet er die y-Achse? Beschreibe dein Vorgehen.`,
          [num("y-Achse bei y =", q, "", 2), num("Nullstelle x₁ =", r1, "", 2), num("Nullstelle x₂ =", r2, "", 2)],
          "y-Achse: x = 0. x-Achse: y = 0 setzen und lösen (Lösungsformel oder Faktorisieren).",
          [`x = 0: y = ${fmt(q)}`, `y = 0: ${quadratic(s, p, q)} = 0${s === -1 ? ` ⇔ ${quadratic(1, -p, -q)} = 0` : ""}`, `faktorisiert: ${factorForm(1, r1, r2)} = 0`],
          `(0 | ${fmt(q)}), N₁${point(r1, 0)}, N₂${point(r2, 0)}`,
          { r1, r2 },
        );
      },
    },
    {
      id: "schnitt",
      make: (rng, level) => {
        if (level === 1) {
          let r1 = 0;
          let r2 = 0;
          do {
            r1 = rng.int(-4, 3);
            r2 = rng.int(-3, 5);
          } while (r1 >= r2);
          const q = rng.int(-5, 3);
          const m = r1 + r2;
          const t = q - r1 * r2;
          return task(
            level,
            `Berechne die Schnittpunkte der Parabel y = ${quadratic(1, 0, q)} mit der Geraden y = ${linear(m, t)}.`,
            [num("x₁ =", r1, "", 2), num("y₁ =", m * r1 + t, "", 2), num("x₂ =", r2, "", 2), num("y₂ =", m * r2 + t, "", 2)],
            "Gleichsetzen, alles auf eine Seite, quadratische Gleichung lösen, y durch Einsetzen.",
            [`${quadratic(1, 0, q)} = ${linear(m, t)}`, `${quadratic(1, -m, q - t)} = 0`, `${factorForm(1, r1, r2)} = 0`],
            `S₁${point(r1, m * r1 + t)}, S₂${point(r2, m * r2 + t)}`,
            { r1, r2, q },
          );
        }
        const x0 = rng.int(-3, 4);
        let p1 = 0;
        let p2 = 0;
        while (p1 === p2) {
          p1 = rng.int(-4, 4);
          p2 = rng.int(-4, 4);
        }
        const q1 = rng.int(-4, 4);
        const q2 = q1 + (p1 - p2) * x0;
        const y0 = x0 * x0 + p1 * x0 + q1;
        const name = rng.pick(NAMES);
        return task(
          level,
          `${name} soll den Schnittpunkt der Parabeln y = ${quadratic(1, p1, q1)} und y = ${quadratic(1, p2, q2)} berechnen. Bestimme ihn und begründe, warum es höchstens einen Schnittpunkt gibt.`,
          [num("x =", x0, "", 2), num("y =", y0, "", 2)],
          "Gleichsetzen: x² fällt auf beiden Seiten weg, es bleibt eine lineare Gleichung.",
          [`${quadratic(1, p1, q1)} = ${quadratic(1, p2, q2)}`, `${linear(p1 - p2, 0)} = ${fmt(q2 - q1)} → x = ${fmt(x0)}`, `y = ${fmt(y0)}`],
          `S${point(x0, y0)}; nur ein Schnittpunkt, weil die lineare Gleichung nur eine Lösung hat`,
          { x0, p1, p2, q1 },
        );
      },
    },
  ],
});

function paren(value: number): string {
  return value < 0 ? `(${fmt(value)})` : fmt(value);
}

export const STAGE = makeStage(
  7,
  "Geraden, binomische Formeln, quadratische Gleichungen und Funktionen",
  "#4338ca",
  "ƒ",
  [geraden, parallel, binome, gleichungen, bruch, abhaengig, scheitel, umformen, zweiPunkte, schnitt],
);
