import { fmt, frac, MINUS } from "../exercises/format";
import { CONCEPT_DIAGRAMS } from "./concept-diagrams";
import { Q, signed, task } from "./builders";
import { choiceField, intField, numberField } from "./helpers";
import {
  labHyperbolaAxes,
  labHyperbolaDomain,
  labHyperbolaFit,
  labHyperbolaShift,
  labInverseProportion,
} from "./labs-1-3";
import { makeLessons } from "./make";
import type { ExerciseGenerator } from "../model/types";

function hypHtml(a: number, b: number, c: number): string {
  const denom = b === 0 ? "x" : b > 0 ? `x + ${fmt(b, 0)}` : `x ${MINUS} ${fmt(-b, 0)}`;
  const shift = c === 0 ? "" : signed(c, 0);
  return `${frac(fmt(a, 0), denom)}${shift}`;
}

// ─── Generators LB 3 ────────────────────────────────────────────────────────

const exHyperbolaDomain: ExerciseGenerator = {
  id: "gr-defmenge-bestimmen",
  make(rng, level) {
    const a = rng.pick([-6, -4, 3, 4, 5, 8]);
    const gap = level === 1 ? rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]) : rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
    const b = -gap;
    const c = rng.pick([-3, -2, -1, 1, 2, 3, 4].filter((v) => v !== gap));
    const coeff = level === 1 ? 1 : rng.pick([2, 3]);
    const denomGap = gap;
    const denomHtml =
      coeff === 1
        ? b === 0
          ? "x"
          : `x${signed(b, 0)}`
        : b === 0
          ? `${fmt(coeff, 0)}x`
          : `${fmt(coeff, 0)}x${signed(-coeff * gap, 0)}`;

    return task(
      level,
      `Bestimme die maximale Definitionsmenge D = ℚ \\ {x₀} der Funktion f(x) = ${frac(fmt(a, 0), denomHtml)}${c === 0 ? "" : signed(c, 0)}, indem du die ausgeschlossene Zahl x₀ angibst.`,
      `Ein Mischvorgang wird durch f(x) = ${frac(fmt(a, 0), denomHtml)}${c === 0 ? "" : signed(c, 0)} beschrieben. Für welchen Wert x₀ wird der Nenner Null, sodass f dort nicht definiert ist?`,
      [
        intField("Ausgeschlossenes x₀ =", denomGap, [
          { value: -denomGap, hint: `Setze den Nenner gleich 0 und löse nach x auf – achte aufs Vorzeichen!` },
          { value: c, hint: `Die Konstante ${fmt(c, 0)} außerhalb des Bruchs schränkt den Nenner nicht ein.` },
        ]),
      ],
      `Setze den gesamten Nenner gleich 0 und löse nach x auf.`,
      `${coeff === 1 ? `x${signed(b, 0)} = 0` : `${fmt(coeff, 0)}x${signed(-coeff * gap, 0)} = 0`}.`,
      `Nullstelle des Nenners: x₀ = <strong>${fmt(denomGap, 0)}</strong> (also D = ℚ \\ {${fmt(denomGap, 0)}}).`,
      { a, b, c, denomGap },
    );
  },
};

const exHyperbolaEval: ExerciseGenerator = {
  id: "gr-funktionswert-luecke",
  make(rng, level) {
    const k = rng.pick([1, 2, 3, -2]);
    const d = rng.pick([-3, -2, 2, 3, 4]);
    const a = k * d;
    const gap = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const b = -gap;
    const x = gap + d;
    const c = level === 1 ? 0 : rng.int(-3, 3);
    const ans = k + c;

    return task(
      level,
      `Berechne für f(x) = ${hypHtml(a, b, c)} den Funktionswert an der Stelle x = ${fmt(x, 0)}.`,
      `Prüfe zunächst, ob x = ${fmt(x, 0)} zur Definitionsmenge von f(x) = ${hypHtml(a, b, c)} gehört, und berechne dann f(${fmt(x, 0)}).`,
      [
        intField(`f(${fmt(x, 0)}) =`, ans, [
          ...(c !== 0 ? [{ value: k - c, hint: `Achte auf das Vorzeichen des Summanden${signed(c, 0)} hinter dem Bruch.` }] : []),
          ...(x !== 0
            ? [{ value: a / x + c, hint: `Im Nenner steht (x${signed(b, 0)}), also erst ${fmt(x, 0)}${signed(b, 0)} = ${fmt(d, 0)} ausrechnen.` }]
            : []),
        ]),
      ],
      `Setze x = ${fmt(x, 0)} zuerst in den Nenner (x${signed(b, 0)}) ein.`,
      `Nennerwert: ${fmt(x, 0)}${signed(b, 0)} = ${fmt(d, 0)} ≠ 0 → ${fmt(a, 0)} : ${fmt(d, 0)} = ${fmt(k, 0)}.`,
      `f(${fmt(x, 0)}) = ${fmt(k, 0)}${c === 0 ? "" : signed(c, 0)} = <strong>${fmt(ans, 0)}</strong>.`,
      { a, b, c, x, ans },
    );
  },
};

const exAsymptotesRead: ExerciseGenerator = {
  id: "gr-asymptoten-ablesen",
  make(rng, level) {
    const a = rng.pick([-5, -3, 2, 4, 6]);
    const xAsy = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const b = -xAsy;
    const c = level === 1 ? rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]) : rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

    return task(
      level,
      `Gib für f(x) = ${hypHtml(a, b, c)} die senkrechte Asymptote x = x_A und die waagrechte Asymptote y = y_A an.`,
      `Der Graph von f(x) = ${hypHtml(a, b, c)} entsteht durch Verschieben von ${fmt(a, 0)}/x. Bestimme die Gleichungen beider Asymptoten (x = x_A und y = y_A).`,
      [
        intField("senkrecht x =", xAsy, [
          { value: b, hint: `Die senkrechte Asymptote liegt bei x = ${MINUS}b, nicht bei b.` },
        ]),
        intField("waagrecht y =", c, [
          { value: -c, hint: `Die waagrechte Asymptote y = c übernimmt direkt das Vorzeichen hinter dem Bruch.` },
        ]),
      ],
      `Senkrechte Asymptote = Nullstelle des Nenners (−b); waagrechte Asymptote = Verschiebung c.`,
      `Nenner 0 bei x = ${fmt(xAsy, 0)}; für große |x| nähert sich der Bruch 0, es bleibt y = ${fmt(c, 0)}.`,
      `Senkrechte Asymptote <strong>x = ${fmt(xAsy, 0)}</strong>, waagrechte Asymptote <strong>y = ${fmt(c, 0)}</strong>.`,
      { a, b, c, xAsy },
    );
  },
};

const exShiftTerm: ExerciseGenerator = {
  id: "gr-verschiebung-term",
  make(rng, level) {
    const a = rng.pick([2, 3, 4, -2]);
    const dx = rng.pick([-3, -2, 2, 3, 4]);
    const dy = rng.pick([-3, -2, 1, 2, 3]);
    const b = -dx;
    const c = dy;
    const dirX = dx > 0 ? `${fmt(dx, 0)} nach rechts` : `${fmt(-dx, 0)} nach links`;
    const dirY = dy > 0 ? `${fmt(dy, 0)} nach oben` : `${fmt(-dy, 0)} nach unten`;

    return task(
      level,
      `Der Graph von g(x) = ${fmt(a, 0)}/x wird um ${dirX} und um ${dirY} verschoben: f(x) = ${frac(fmt(a, 0), "x + b")} + c. Bestimme die Parameter b und c.`,
      `Aus der Grundhyperbel ${fmt(a, 0)}/x entsteht eine neue Hyperbel mit senkrechter Asymptote x = ${fmt(dx, 0)} und waagrechter Asymptote y = ${fmt(dy, 0)}. Welche Werte haben b und c in ${frac(fmt(a, 0), "x + b")} + c?`,
      [
        intField("b =", b, [
          { value: dx, hint: `Verschiebung um ${fmt(dx, 0)} in x-Richtung liefert im Nenner (x ${MINUS} (${fmt(dx, 0)})), also b = ${MINUS}(${fmt(dx, 0)}).` },
        ]),
        intField("c =", c, [
          { value: -c, hint: `In y-Richtung bleibt das Vorzeichen direkt erhalten: + c.` },
        ]),
      ],
      `Rechts/links verschiebt mit umgekehrtem Vorzeichen im Nenner (b = ${MINUS}x_A), hoch/runter mit direktem Vorzeichen (c = y_A).`,
      `x_A = ${fmt(dx, 0)} ⇒ b = ${MINUS}(${fmt(dx, 0)}) = ${fmt(b, 0)}; y_A = ${fmt(dy, 0)} ⇒ c = ${fmt(c, 0)}.`,
      `<strong>b = ${fmt(b, 0)}</strong> und <strong>c = ${fmt(c, 0)}</strong>.`,
      { a, dx, dy, b, c },
    );
  },
};

const exHyperbolaYInt: ExerciseGenerator = {
  id: "gr-sy-berechnen",
  make(rng, level) {
    const b = rng.pick([-4, -3, -2, 2, 3, 4]);
    const k = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const a = k * b;
    const c = level === 1 ? rng.int(-2, 3) : rng.int(-4, 4);
    const sy = k + c;

    return task(
      level,
      `Berechne die y-Koordinate des Schnittpunkts Sy(0 | y_s) der Hyperbel f(x) = ${hypHtml(a, b, c)} mit der y-Achse.`,
      `Bestimme die Koordinaten des y-Achsenschnittpunkts von f(x) = ${hypHtml(a, b, c)}. Warum darf hier 0 eingesetzt werden?`,
      [
        intField("y_s =", sy, [
          { value: c, hint: `Bei x = 0 wird der Bruch zu ${fmt(a, 0)} / (${fmt(b, 0)}) = ${fmt(k, 0)}, nicht zu 0.` },
          { value: -k + c, hint: `Prüfe das Vorzeichen von ${fmt(a, 0)} : (${fmt(b, 0)}).` },
        ]),
      ],
      `Setze x = 0 in den Funktionsterm ein.`,
      `f(0) = ${fmt(a, 0)} / (${fmt(b, 0)})${c === 0 ? "" : signed(c, 0)} = ${fmt(k, 0)}${c === 0 ? "" : signed(c, 0)}.`,
      `Schnittpunkt mit der y-Achse: Sy(0 | <strong>${fmt(sy, 0)}</strong>).`,
      { a, b, c, sy },
    );
  },
};

const exHyperbolaZero: ExerciseGenerator = {
  id: "gr-nullstelle-rechnen",
  make(rng, level) {
    const c = rng.pick([-3, -2, -1, 1, 2, 3]);
    const d = rng.pick([-4, -3, -2, 2, 3, 4]);
    const a = -c * d;
    const b = level === 1 ? rng.pick([-2, -1, 1, 2, 3]) : rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const x0 = d - b;

    return task(
      level,
      `Berechne die Nullstelle x₀ der Funktion f(x) = ${hypHtml(a, b, c)}.`,
      `Wo schneidet der Graph von f(x) = ${hypHtml(a, b, c)} die x-Achse? Stelle nach f(x₀) = 0 um und prüfe die Definitionslücke.`,
      [
        intField("Nullstelle x₀ =", x0, [
          { value: -b, hint: `x = ${fmt(-b, 0)} ist die senkrechte Asymptote (Definitionslücke), keine Nullstelle.` },
          { value: d + b, hint: `Beim Auflösen von x${signed(b, 0)} = ${fmt(d, 0)} musst du ${fmt(b, 0)} auf die andere Seite bringen.` },
        ]),
      ],
      `Löse ${frac(fmt(a, 0), `x${signed(b, 0)}`)} = ${fmt(-c, 0)} durch Multiplikation mit dem Nenner.`,
      `${fmt(a, 0)} = ${fmt(-c, 0)} · (x${signed(b, 0)}) ⇒ x${signed(b, 0)} = ${fmt(d, 0)}.`,
      `x₀ = ${fmt(d, 0)}${signed(-b, 0)} = <strong>${fmt(x0, 0)}</strong> (gehört zu D, da ${fmt(x0, 0)} ≠ ${fmt(-b, 0)}).`,
      { a, b, c, d, x0 },
    );
  },
};

const exParamsFromGraph: ExerciseGenerator = {
  id: "gr-parameter-aus-graph",
  make(rng, level) {
    const xA = rng.int(-3, 3);
    const b = -xA;
    const c = rng.int(-3, 3);
    const dx = rng.pick([2, 3]);
    const xP = xA + dx;
    const k = rng.pick([-3, -2, 2, 3]);
    const a = k * dx;
    const yP = k + c;

    return task(
      level,
      `Eine Hyperbel f(x) = ${frac("a", "x + b")} + c besitzt die Asymptoten x = ${fmt(xA, 0)} und y = ${fmt(c, 0)} und verläuft durch P(${fmt(xP, 0)} | ${fmt(yP, 0)}). Bestimme b, c und a.`,
      `Aus dem Graphen einer gebrochen-rationalen Funktion liest du das Asymptotenkreuz (${fmt(xA, 0)} | ${fmt(c, 0)}) und den Gitterpunkt P(${fmt(xP, 0)} | ${fmt(yP, 0)}) ab. Ermittle den Term a/(x + b) + c.`,
      [
        intField("b =", b),
        intField("c =", c),
        intField("a =", a, [
          { value: k, hint: `Multipliziere ${fmt(yP - c, 0)} noch mit dem Nenner (${fmt(xP, 0)} ${MINUS} (${fmt(xA, 0)})) = ${fmt(dx, 0)}.` },
        ]),
      ],
      `Zuerst b = ${MINUS}x_A und c = y_A einsetzen, dann P(${fmt(xP, 0)} | ${fmt(yP, 0)}) zum Berechnen von a nutzen.`,
      `b = ${fmt(b, 0)}, c = ${fmt(c, 0)}. Einsetzen von P: ${fmt(yP, 0)} = a / ${fmt(dx, 0)}${c === 0 ? "" : signed(c, 0)} ⇒ ${fmt(k, 0)} = a / ${fmt(dx, 0)}.`,
      `a = ${fmt(k, 0)} · ${fmt(dx, 0)} = <strong>${fmt(a, 0)}</strong> (also <strong>b = ${fmt(b, 0)}, c = ${fmt(c, 0)}, a = ${fmt(a, 0)}</strong>).`,
      { xA, b, c, xP, yP, a },
    );
  },
};

const exPointOnHyperbola: ExerciseGenerator = {
  id: "gr-punkt-auf-hyperbel",
  make(rng, level) {
    const a = rng.pick([6, 12, 18]);
    const b = rng.pick([-2, -1, 1, 2]);
    const c = level === 1 ? 0 : rng.int(1, 3);
    const d = rng.pick([2, 3]);
    const xP = -b + d;
    const onCurve = rng.int(0, 1) === 1;
    const yExact = a / d + c;
    const yP = onCurve ? yExact : yExact + rng.pick([-1, 1]);

    return task(
      level,
      `Prüfe rechnerisch, ob der Punkt P(${fmt(xP, 0)} | ${fmt(yP, 0)}) auf dem Graphen von f(x) = ${hypHtml(a, b, c)} liegt.`,
      `Liegt der gemessene Punkt P(${fmt(xP, 0)} | ${fmt(yP, 0)}) exakt auf der Hyperbel f(x) = ${hypHtml(a, b, c)}? Berechne f(${fmt(xP, 0)}) und entscheide.`,
      [
        numberField(`f(${fmt(xP, 0)}) =`, yExact, "", 0),
        choiceField(
          "Punktprobe",
          onCurve ? ["Ja, P liegt auf dem Graphen", "Nein, P liegt nicht auf dem Graphen"] : ["Nein, P liegt nicht auf dem Graphen", "Ja, P liegt auf dem Graphen"],
          0,
        ),
      ],
      `Setze x = ${fmt(xP, 0)} in f(x) ein und vergleiche f(${fmt(xP, 0)}) mit y_P = ${fmt(yP, 0)}.`,
      `f(${fmt(xP, 0)}) = ${fmt(a, 0)} / ${fmt(d, 0)}${c === 0 ? "" : signed(c, 0)} = ${fmt(yExact, 0)}.`,
      `Vergleich mit y_P = ${fmt(yP, 0)}: <strong>${onCurve ? "Ja, P liegt auf dem Graphen" : "Nein, y_P weicht ab"}</strong>.`,
      { a, b, c, xP, yExact, yP },
    );
  },
};

const exInverseCalc: ExerciseGenerator = {
  id: "gr-indirekt-rechnen",
  make(rng, level) {
    const x1 = rng.pick([2, 3, 4, 5]);
    const y1 = rng.pick([6, 8, 9, 12]);
    const k = x1 * y1;
    const divisors = [2, 3, 4, 5, 6, 8, 9, 10, 12].filter((d) => k % d === 0 && d !== x1);
    const x2 = rng.pick(divisors);
    const y2 = k / x2;

    return task(
      level,
      `Zwei Größen x und y sind indirekt proportional (y = a / x). Zu x₁ = ${fmt(x1, 0)} gehört y₁ = ${fmt(y1, 0)}. Bestimme a = x · y und den Wert y₂ für x₂ = ${fmt(x2, 0)}.`,
      `Für eine bestimmte Baustelle benötigen ${fmt(x1, 0)} Pumpen genau ${fmt(y1, 0)} Stunden (gleiche Pumpleistung vorausgesetzt). Wie groß ist das konstante Produkt a, und wie lange brauchen ${fmt(x2, 0)} Pumpen?`,
      [
        intField("Produkt a =", k, [
          { value: y1 / x1, hint: `Bei indirekter Proportionalität gilt a = x · y (Produktgleichheit), nicht y / x.` },
        ]),
        intField(`y(${fmt(x2, 0)}) =`, y2, [
          { value: Math.round((y1 * x2) / x1), hint: `Mehr Pumpen brauchen WENIGER Zeit: teile a durch x₂ = ${fmt(x2, 0)}.` },
        ], level === 1 ? "" : "h"),
      ],
      `Produktgleichheit: x₁ · y₁ = x₂ · y₂ = a.`,
      `a = ${fmt(x1, 0)} · ${fmt(y1, 0)} = ${fmt(k, 0)}.`,
      `y₂ = ${fmt(k, 0)} / ${fmt(x2, 0)} = <strong>${fmt(y2, 0)}</strong> (bei Produkt <strong>a = ${fmt(k, 0)}</strong>).`,
      { x1, y1, k, x2, y2 },
    );
  },
};

const exDirectVsInverse: ExerciseGenerator = {
  id: "gr-direkt-vs-indirekt",
  make(rng, level) {
    const type = level === 1 ? rng.int(0, 2) : rng.int(0, 2);
    const x1 = 2;
    const x2 = 4;
    const x3 = 6;
    const k = 24;
    const yVals =
      type === 0
        ? [12, 6, 4] // indirect
        : type === 1
          ? [6, 12, 18] // direct
          : [5, 9, 13]; // neither (affine y = 2x + 1)

    const right =
      type === 0
        ? "indirekt proportional (x · y = 24 konstant)"
        : type === 1
          ? "direkt proportional (y / x = 3 konstant)"
          : "keines von beiden (weder y/x noch x·y konstant)";

    const opts = [
      "indirekt proportional (x · y = 24 konstant)",
      "direkt proportional (y / x = 3 konstant)",
      "keines von beiden (weder y/x noch x·y konstant)",
    ];
    const ordered = [right, ...opts.filter((o) => o !== right)];

    return task(
      level,
      `Prüfe die Tabelle (${fmt(x1, 0)} | ${fmt(yVals[0], 0)}), (${fmt(x2, 0)} | ${fmt(yVals[1], 0)}), (${fmt(x3, 0)} | ${fmt(yVals[2], 0)}): Welche Zuordnung liegt vor?`,
      `Im Labor wurden zu x = ${fmt(x1, 0)}; ${fmt(x2, 0)}; ${fmt(x3, 0)} die Werte y = ${fmt(yVals[0], 0)}; ${fmt(yVals[1], 0)}; ${fmt(yVals[2], 0)} gemessen. Prüfe Quotientengleichheit und Produktgleichheit.`,
      [choiceField("Art des Zusammenhangs", ordered, 0)],
      `Berechne für jedes Paar sowohl y / x als auch x · y.`,
      `Produkte x·y: ${fmt(x1 * yVals[0], 0)}, ${fmt(x2 * yVals[1], 0)}, ${fmt(x3 * yVals[2], 0)}; Quotienten y/x: ${fmt(yVals[0] / x1, 2)}, ${fmt(yVals[1] / x2, 2)}, ${fmt(yVals[2] / x3, 2)}.`,
      `Ergebnis: <strong>${right}</strong>.`,
      { type, k },
    );
  },
};

export const STAGE_3_LESSONS = makeLessons([
  {
    id: "gr-1-defmenge",
    section: "3",
    title: "Definitionsmenge und Polstellen",
    subtitle: "Welche Zahlen muss man bei f(x) = a/(x + b) + c ausschließen?",
    whyItMatters: "Durch null darf man niemals teilen — deshalb haben gebrochen-rationale Funktionen Lücken, an denen ihre Werte explodieren.",
    explanationHtml: `<p>Tritt die Variable x im Nenner eines Bruchs auf, spricht man von einer <strong>gebrochen-rationalen Funktion</strong> der Form f(x) = a/(x + b) + c (mit a ≠ 0).</p>
<p>Die <strong>maximale Definitionsmenge D</strong> umfasst alle rationalen Zahlen außer jenen, für die der Nenner null wird: x + b = 0 ⇔ x = −b, also <strong>D = ℚ \\ {−b}</strong>.</p>
${CONCEPT_DIAGRAMS.gr1}
<div class="example"><strong>Beispiel:</strong> f(x) = ${frac("4", "x − 2")} + 1.<br>Nenner gleich Null: x − 2 = 0 ⇒ x = 2.<br>Definitionsmenge: D = ℚ \\ {2}.<br>Für x = 4 gilt: f(4) = 4 / (4 − 2) + 1 = 2 + 1 = 3.</div>
<div class="merke"><strong>Merke:</strong> Für die Definitionsmenge prüfst du ausschließlich den Nenner. Ein Summand + c außerhalb des Bruchs verändert die Definitionslücke nicht.</div>`,
    formulas: [
      { name: "Elementare Hyperbel", html: `f(x) = ${frac("a", "x + b")} + c`, quantities: "a ≠ 0; Nenner x + b darf nicht 0 werden" },
      { name: "Maximale Definitionsmenge", html: "D = ℚ \\ {−b}", quantities: "Definitionslücke bei x = −b" },
    ],
    quiz: Q(
      "Welche Zahl gehört NICHT zur maximalen Definitionsmenge von f(x) = 5/(x + 7) − 3?",
      "x = −7",
      "x = 7",
      "x = −3",
      "Der Nenner x + 7 wird genau dann 0, wenn x = −7 ist.",
    ),
    lab: labHyperbolaDomain,
    exercises: [exHyperbolaDomain, exHyperbolaEval],
    celebrationMessage: "Du bestimmst maximale Definitionsmengen und Funktionswerte sicher.",
  },
  {
    id: "gr-2-verschieben",
    section: "3",
    title: "Asymptoten und Einfluss von b und c",
    subtitle: "Wie b und c den Graphen im Koordinatensystem verschieben",
    whyItMatters: "An den Asymptoten liest du sofort die Grenzwerte im Alltag ab – z. B. Sockeltemperatur oder Restkosten.",
    explanationHtml: `<p>Der Graph von f(x) = a/(x + b) + c ist eine <strong>Hyperbel</strong> mit zwei Ästen. Er nähert sich zwei Geraden immer enger an, ohne sie zu berühren – den <strong>Asymptoten</strong>:</p>
<ul><li><strong>Senkrechte Asymptote:</strong> x = −b (b &lt; 0 verschiebt nach rechts, b &gt; 0 nach links).</li><li><strong>Waagrechte Asymptote:</strong> y = c (c &gt; 0 verschiebt nach oben, c &lt; 0 nach unten).</li></ul>
${CONCEPT_DIAGRAMS.gr2}
<div class="example"><strong>Beispiel:</strong> f(x) = ${frac("2", "x − 2")} + 1.<br>Hier ist b = −2 und c = 1.<br>Der Graph ist gegenüber 2/x um 2 nach rechts und 1 nach oben verschoben. Die Asymptoten sind x = 2 und y = 1.</div>
<div class="merke"><strong>Merke:</strong> Das Asymptotenkreuz liegt immer bei (−b | c). Merke dir das umgekehrte Vorzeichen bei b (im Nenner) und das direkte Vorzeichen bei c!</div>`,
    formulas: [
      { name: "Senkrechte Asymptote", html: "x = −b", quantities: "Verschiebung um −b in x-Richtung" },
      { name: "Waagrechte Asymptote", html: "y = c", quantities: "Verschiebung um c in y-Richtung" },
    ],
    quiz: Q(
      "Welche Asymptoten hat f(x) = 3/(x + 4) − 2?",
      "x = −4 und y = −2",
      "x = 4 und y = −2",
      "x = −4 und y = 2",
      "Der Nenner x + 4 wird 0 bei x = −4 (senkrecht), und für große |x| nähert sich f(x) dem Wert c = −2 (waagrecht).",
    ),
    lab: labHyperbolaShift,
    exercises: [exAsymptotesRead, exShiftTerm],
    celebrationMessage: "Du verstehst die Rolle der Parameter b und c für beide Asymptoten.",
  },
  {
    id: "gr-3-achsen",
    section: "3",
    title: "Achsenschnittpunkte einer Hyperbel",
    subtitle: "Wann schneidet die Hyperbel die x- oder y-Achse?",
    whyItMatters: "Nicht jede Hyperbel hat Achsenschnittpunkte — die waagrechte Asymptote kann Nullstellen komplett verhindern.",
    explanationHtml: `<p>Auch bei f(x) = a/(x + b) + c gelten dieselben Regeln für Achsenschnittpunkte:</p>
<ul><li><strong>Schnittpunkt mit der y-Achse S<sub>y</sub>:</strong> x = 0 einsetzen (sofern 0 ∈ D, also b ≠ 0): y = a/b + c.</li><li><strong>Nullstelle N(x₀ | 0):</strong> f(x) = 0 lösen: a/(x + b) + c = 0 ⇔ a/(x + b) = −c. Für c = 0 gibt es <em>keine</em> Nullstelle!</li></ul>
${CONCEPT_DIAGRAMS.gr3}
<div class="example"><strong>Beispiel:</strong> f(x) = ${frac("6", "x + 2")} − 1.<br>• S<sub>y</sub>: f(0) = 6/2 − 1 = 2 → S<sub>y</sub>(0 | 2).<br>• Nullstelle: 6/(x + 2) − 1 = 0 ⇒ 6/(x + 2) = 1 ⇒ x + 2 = 6 ⇒ x₀ = 4 → N(4 | 0).</div>
<div class="merke"><strong>Merke:</strong> Liegt die senkrechte Asymptote auf x = 0 (b = 0), existiert kein S<sub>y</sub>. Liegt die waagrechte Asymptote auf y = 0 (c = 0), existiert keine Nullstelle.</div>`,
    formulas: [
      { name: "y-Achsenschnittpunkt", html: "S<sub>y</sub>(0 | a/b + c)", quantities: "nur falls b ≠ 0 (0 ∈ D)" },
      { name: "Nullstelle", html: "x₀ = −a/c − b", quantities: "nur falls c ≠ 0 (bei a ≠ 0)" },
    ],
    quiz: Q(
      "Wann besitzt f(x) = a/(x + b) + c (mit a ≠ 0) KEINE Nullstelle?",
      "Wenn c = 0 ist (waagrechte Asymptote ist die x-Achse).",
      "Wenn b = 0 ist (senkrechte Asymptote ist die y-Achse).",
      "Wenn a < 0 ist.",
      "Ist c = 0, nähert sich die Hyperbel der x-Achse beliebig nahe an, erreicht den Wert 0 aber nie.",
    ),
    lab: labHyperbolaAxes,
    exercises: [exHyperbolaYInt, exHyperbolaZero],
    celebrationMessage: "Du berechnest Achsenschnittpunkte von Hyperbeln sicher.",
  },
  {
    id: "gr-4-graph-parameter",
    section: "3",
    title: "Graphen zeichnen und Parameter aus Graphen ablesen",
    subtitle: "Vom Bild zur Gleichung f(x) = a/(x + b) + c — und zurück",
    whyItMatters: "Asymptotenkreuz plus ein einziger Punkt genügen, um jede elementare Hyperbel eindeutig festzulegen.",
    explanationHtml: `<p>Um aus einem gegebenen Hyperbelgraphen die Parameter <strong>a, b, c</strong> zu ermitteln, gehst du in drei Schritten vor:</p>
<ol class="steps"><li>Lies die senkrechte Asymptote x = x<sub>A</sub> ab → <strong>b = −x<sub>A</sub></strong>.</li><li>Lies die waagrechte Asymptote y = y<sub>A</sub> ab → <strong>c = y<sub>A</sub></strong>.</li><li>Wähle einen gut ablesbaren Punkt P(x<sub>P</sub> | y<sub>P</sub>) auf der Hyperbel und setze ihn ein: a = (y<sub>P</sub> − c) · (x<sub>P</sub> + b).</li></ol>
${CONCEPT_DIAGRAMS.gr4}
<div class="example"><strong>Beispiel:</strong> Asymptoten bei x = 1 und y = −2 → b = −1 und c = −2.<br>Punkt P(3 | 0) auf der Kurve: a = (0 − (−2)) · (3 − 1) = 2 · 2 = 4.<br>Funktionsgleichung: f(x) = ${frac("4", "x − 1")} − 2.</div>
<div class="merke"><strong>Merke:</strong> Zeichne beim Skizzieren einer Hyperbel immer zuerst beide Asymptoten gestrichelt ein — sie geben deinen beiden Hyperbelästen das feste Gerüst.</div>`,
    formulas: [
      { name: "Zähler a bestimmen", html: "a = (y<sub>P</sub> − c) · (x<sub>P</sub> + b)", quantities: "aus beliebigem Punkt P(x_P | y_P) auf dem Graphen" },
    ],
    quiz: Q(
      "Eine Hyperbel hat die Asymptoten x = 2 und y = 1 und geht durch (3 | 5). Welchen Wert hat a?",
      "a = 4",
      "a = 5",
      "a = 2",
      "Aus b = −2 und c = 1 folgt 5 = a/(3 − 2) + 1 ⇒ 4 = a/1 ⇒ a = 4.",
    ),
    lab: labHyperbolaFit,
    exercises: [exParamsFromGraph, exPointOnHyperbola],
    celebrationMessage: "Du liest a, b und c direkt aus dem Hyperbelgraphen ab.",
  },
  {
    id: "gr-5-indirekt",
    section: "3",
    title: "Indirekte Proportionalität y = a / x",
    subtitle: "Je mehr, desto weniger — Produktgleichheit im Alltag und in der Physik",
    whyItMatters: "Mehr Helfer verkürzen die Arbeitszeit, kleinere Kolbenvolumina erhöhen den Druck: Produktgleichheit begegnet dir überall.",
    explanationHtml: `<p>Für b = 0 und c = 0 erhält man den Spezialfall <strong>y = a / x</strong> (mit a &gt; 0 für positive Größen). Zwei Größen x und y sind genau dann <strong>indirekt proportional</strong> (umgekehrt proportional), wenn ihr <strong>Produkt x · y = a</strong> immer konstant bleibt.</p>
<p>Verdoppelt man x, halbiert sich y; verdreifacht man x, drittelt sich y. Der Graph ist eine Hyperbel im 1. Quadranten.</p>
${CONCEPT_DIAGRAMS.gr5}
<div class="example"><strong>Beispiel Rechtecke mit Fläche 12 cm²:</strong><br>Breite x = 2 cm → Höhe y = 6 cm (2 · 6 = 12).<br>Breite x = 4 cm → Höhe y = 3 cm (4 · 3 = 12).<br>Funktion: y = 12 / x.</div>
<div class="merke"><strong>Merke:</strong> Direkt proportional: Quotient y/x konstant (Ursprungsgerade). Indirekt proportional: Produkt x·y konstant (Hyperbel y = a/x).</div>`,
    formulas: [
      { name: "Indirekte Proportionalität", html: "y = a / x &nbsp;⇔&nbsp; x · y = a", quantities: "konstantes Produkt a (Produktgleichheit)" },
    ],
    quiz: Q(
      "6 Bagger heben eine Baugrube in 10 Tagen aus. Wie viele Tage benötigen 4 Bagger bei gleicher Leistung?",
      "15 Tage",
      "6,7 Tage",
      "24 Tage",
      "Die Arbeitsmenge ist x · y = 6 · 10 = 60 Baggertage. Für 4 Bagger ergibt sich 60 / 4 = 15 Tage.",
    ),
    lab: labInverseProportion,
    exercises: [exInverseCalc, exDirectVsInverse],
    celebrationMessage: "Etappe 3 geschafft: Du beherrschst Hyperbeln und indirekte Proportionalität!",
  },
]);
