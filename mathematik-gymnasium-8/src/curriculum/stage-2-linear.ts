import { fmt, linear, MINUS } from "../exercises/format";
import { CONCEPT_DIAGRAMS } from "./concept-diagrams";
import { Q, signed, task } from "./builders";
import { choiceField, intField, numberField } from "./helpers";
import {
  labDirectProportion,
  labLineIntersection,
  labLineMT,
  labLineReadGraph,
  labLineTwoPoints,
  labLineZeroPoint,
  labLinearInequality,
  labLinearTariffs,
} from "./labs-1-3";
import { makeLessons } from "./make";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators LB 2 ────────────────────────────────────────────────────────

const exInterpretParams: ExerciseGenerator = {
  id: "lf-parameter-deuten",
  make(rng, level) {
    const m = rng.pick([-3, -2, -1, 2, 3, 4]);
    const t = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== m));
    const dirIdx = m > 0 ? 0 : 1;

    return task(
      level,
      `Eine Gerade hat die Funktionsgleichung y = ${linear(m, t, 0)}. Gib die Steigung m, den y-Achsenabschnitt t und das Steigungsverhalten an.`,
      `Ein Wasserspeicher hat zu Beginn (x = 0 h) einen Füllstand von ${fmt(t + 10, 0)} Litern (modelliert verschoben als y = ${linear(m, t, 0)}). Bestimme Steigung m, Parameter t der Geraden y = m·x + t und ob der Graph steigt oder fällt.`,
      [
        intField("Steigung m", m, [
          { value: t, hint: `${fmt(t, 0)} ist der konstante Summand t (y-Achsenabschnitt), nicht der Faktor vor x.` },
          { value: -m, hint: `Prüfe das Vorzeichen direkt vor x.` },
        ]),
        intField("Abschnitt t", t, [
          { value: m, hint: `${fmt(m, 0)} ist der Faktor vor x (Steigung m).` },
        ]),
        choiceField(
          "Verlauf der Geraden",
          dirIdx === 0 ? ["steigend (m > 0)", "fallend (m < 0)", "waagrecht (m = 0)"] : ["fallend (m < 0)", "steigend (m > 0)", "waagrecht (m = 0)"],
          0,
        ),
      ],
      `In y = m·x + t steht m vor x und t als konstanter Summand.`,
      `Vergleich mit y = m·x + t liefert m = ${fmt(m, 0)} und t = ${fmt(t, 0)}.`,
      `Da m = ${fmt(m, 0)} ${m > 0 ? "> 0, steigt" : "< 0, fällt"} die Gerade: <strong>m = ${fmt(m, 0)}, t = ${fmt(t, 0)}</strong>.`,
      { m, t },
    );
  },
};

const exValueFromLine: ExerciseGenerator = {
  id: "lf-wert-aus-gleichung",
  make(rng, level) {
    const m = rng.pick([-2, -1, 2, 3]);
    const t = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const x = level === 1 ? rng.int(2, 5) : rng.int(-4, -1);
    const y = m * x + t;

    return task(
      level,
      `Berechne für die lineare Funktion y = ${linear(m, t, 0)} den Funktionswert an der Stelle x = ${fmt(x, 0)}.`,
      `Gegeben ist die Gerade g mit y = ${linear(m, t, 0)}. Welche y-Koordinate besitzt der Punkt P(${fmt(x, 0)} | y) auf g?`,
      [
        intField("y =", y, [
          { value: -m * x + t, hint: `Achte auf das Vorzeichen bei ${fmt(m, 0)} · (${fmt(x, 0)}).` },
          { value: m * x - t, hint: `Das Absolutglied ${signed(t, 0)} wird mit seinem eigenen Vorzeichen addiert.` },
        ]),
      ],
      `Setze x = ${fmt(x, 0)} in y = ${linear(m, t, 0)} ein.`,
      `y = ${fmt(m, 0)} · (${fmt(x, 0)})${signed(t, 0)}.`,
      `Ausgerechnet: y = ${fmt(m * x, 0)}${signed(t, 0)} = <strong>${fmt(y, 0)}</strong>.`,
      { m, t, x, y },
    );
  },
};

const exReadGraphMT: ExerciseGenerator = {
  id: "lf-graph-ablesen",
  make(rng, level) {
    const t = rng.int(-3, 5);
    const dx = rng.pick([2, 4, 5]);
    const dy = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const m = dy / dx;
    const yP = t + dy;

    return task(
      level,
      `Eine Gerade schneidet die y-Achse bei Sy(0 | ${fmt(t, 0)}) und verläuft durch P(${fmt(dx, 0)} | ${fmt(yP, 0)}). Lies t ab und berechne die Steigung m.`,
      `In einem Koordinatensystem erkennst du den Schnittpunkt mit der y-Achse Sy(0 | ${fmt(t, 0)}) und ein Steigungsdreieck um Δx = ${fmt(dx, 0)} nach rechts zum Punkt P(${fmt(dx, 0)} | ${fmt(yP, 0)}). Bestimme t und m der Geraden.`,
      [
        intField("t =", t, [
          { value: yP, hint: `${fmt(yP, 0)} ist der y-Wert bei x = ${fmt(dx, 0)}, gesucht ist der Wert bei x = 0.` },
        ]),
        numberField("m =", m, "", 2, {
          slips: [
            { value: dy, hint: `Teile Δy = ${fmt(dy, 0)} noch durch Δx = ${fmt(dx, 0)}.` },
            ...(Math.abs(dy) !== dx ? [{ value: dx / dy, hint: `Steigung ist Δy / Δx (Höhe durch Breite), nicht umgekehrt.` }] : []),
          ],
        }),
      ],
      `t ist die y-Koordinate bei x = 0; m = (y_P ${MINUS} t) / x_P.`,
      `Direkt abgelesen: t = ${fmt(t, 0)}. Höhenänderung Δy = ${fmt(yP, 0)} ${MINUS} (${fmt(t, 0)}) = ${fmt(dy, 0)}.`,
      `Steigung m = ${fmt(dy, 0)} / ${fmt(dx, 0)} = <strong>${fmt(m, 2)}</strong> und <strong>t = ${fmt(t, 0)}</strong>.`,
      { t, dx, dy, m, yP },
    );
  },
};

const exSlopeTriangleStep: ExerciseGenerator = {
  id: "lf-steigungsdreieck",
  make(rng, level) {
    const m = rng.pick([-1.5, -0.5, 0.5, 1.5, 2.5]);
    const t = rng.int(-3, 4);
    const dx = level === 1 ? 2 : rng.pick([4, 6]);
    const dy = m * dx;

    return task(
      level,
      `Gezeichnet werden soll die Gerade y = ${linear(m, t, 1)}. Du startest bei Sy(0 | ${fmt(t, 0)}) und gehst um Δx = ${fmt(dx, 0)} Einheiten nach rechts. Wie viele Einheiten Δy musst du nach oben (+) oder unten (−) gehen?`,
      `Für eine saubere Zeichnung der Geraden g: y = ${linear(m, t, 1)} nutzt du ab Sy(0 | ${fmt(t, 0)}) ein breites Steigungsdreieck mit Δx = ${fmt(dx, 0)}. Berechne die zugehörige Änderung Δy.`,
      [
        numberField("Δy =", dy, "", 1, {
          slips: [
            { value: m, hint: `m = ${fmt(m, 1)} gilt für Δx = 1; multipliziere mit Δx = ${fmt(dx, 0)}.` },
            { value: -dy, hint: `Prüfe das Vorzeichen der Steigung m = ${fmt(m, 1)}.` },
          ],
        }),
      ],
      `Δy = m · Δx`,
      `Setze m = ${fmt(m, 1)} und Δx = ${fmt(dx, 0)} ein.`,
      `Δy = ${fmt(m, 1)} · ${fmt(dx, 0)} = <strong>${fmt(dy, 1)}</strong>.`,
      { m, t, dx, dy },
    );
  },
};

const exPointSlopeLine: ExerciseGenerator = {
  id: "lf-punkt-steigung",
  make(rng, level) {
    const m = rng.pick([-3, -2, -1, 2, 3, 4]);
    const px = level === 1 ? rng.int(1, 3) : rng.int(-4, -1);
    const t = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const py = m * px + t;

    return task(
      level,
      `Eine Gerade besitzt die Steigung m = ${fmt(m, 0)} und verläuft durch P(${fmt(px, 0)} | ${fmt(py, 0)}). Berechne den y-Achsenabschnitt t.`,
      `Eine Dachschräge mit Gefälle bzw. Steigung m = ${fmt(m, 0)} verläuft durch den Messpunkt P(${fmt(px, 0)} | ${fmt(py, 0)}). Stelle die Geradengleichung auf, indem du den Parameter t bestimmst.`,
      [
        intField("t =", t, [
          { value: py + m * px, hint: `Beim Auflösen von ${fmt(py, 0)} = ${fmt(m, 0)} · (${fmt(px, 0)}) + t subtrahierst du m·x auf der anderen Seite.` },
          { value: py, hint: `${fmt(py, 0)} ist der Wert bei x = ${fmt(px, 0)}, nicht bei x = 0.` },
        ]),
      ],
      `Setze P(${fmt(px, 0)} | ${fmt(py, 0)}) und m = ${fmt(m, 0)} in y = m·x + t ein und löse nach t auf.`,
      `${fmt(py, 0)} = ${fmt(m, 0)} · (${fmt(px, 0)}) + t ⇒ ${fmt(py, 0)} = ${fmt(m * px, 0)} + t.`,
      `t = ${fmt(py, 0)} ${MINUS} (${fmt(m * px, 0)}) = <strong>${fmt(t, 0)}</strong> (Gerade: y = ${linear(m, t, 0)}).`,
      { m, px, py, t },
    );
  },
};

const exTwoPointsLine: ExerciseGenerator = {
  id: "lf-zwei-punkte",
  make(rng, level) {
    const m = rng.pick([-2, -1, 2, 3]);
    const t = rng.int(-4, 5);
    const x1 = level === 1 ? 1 : rng.int(-3, -1);
    const x2 = x1 + rng.int(2, 4);
    const y1 = m * x1 + t;
    const y2 = m * x2 + t;

    return task(
      level,
      `Bestimme für die Gerade durch P(${fmt(x1, 0)} | ${fmt(y1, 0)}) und Q(${fmt(x2, 0)} | ${fmt(y2, 0)}) die Steigung m und den y-Achsenabschnitt t.`,
      `Zwei Wegpunkte liegen im Koordinatensystem bei P(${fmt(x1, 0)} | ${fmt(y1, 0)}) und Q(${fmt(x2, 0)} | ${fmt(y2, 0)}). Berechne Steigung m und y-Achsenabschnitt t ihrer Verbindungsgeraden.`,
      [
        intField("m =", m, [
          { value: -m, hint: `Rechne (y₂ ${MINUS} y₁) / (x₂ ${MINUS} x₁) in derselben Punkt-Reihenfolge.` },
          { value: y2 - y1, hint: `Teile Δy = ${fmt(y2 - y1, 0)} noch durch Δx = ${fmt(x2 - x1, 0)}.` },
        ]),
        intField("t =", t, [
          { value: y1, hint: `Setze P(${fmt(x1, 0)} | ${fmt(y1, 0)}) in y = m·x + t ein, statt y₁ als t zu übernehmen.` },
        ]),
      ],
      `1. m = (y₂ ${MINUS} y₁) / (x₂ ${MINUS} x₁); 2. P in y = m·x + t einsetzen.`,
      `m = (${fmt(y2, 0)} ${MINUS} (${fmt(y1, 0)})) / (${fmt(x2, 0)} ${MINUS} (${fmt(x1, 0)})) = ${fmt(y2 - y1, 0)} / ${fmt(x2 - x1, 0)} = ${fmt(m, 0)}.`,
      `Einsetzen von P: ${fmt(y1, 0)} = ${fmt(m, 0)} · (${fmt(x1, 0)}) + t ⇒ t = <strong>${fmt(t, 0)}</strong> (und <strong>m = ${fmt(m, 0)}</strong>).`,
      { m, t, x1, y1, x2, y2 },
    );
  },
};

const exFindZero: ExerciseGenerator = {
  id: "lf-nullstelle-rechnen",
  make(rng, level) {
    const m = rng.pick([-4, -3, -2, 2, 3, 4, 5]);
    const x0 = level === 1 ? rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]) : rng.pick([-3.5, -2.5, -1.5, 1.5, 2.5, 3.5]);
    const t = -m * x0;

    return task(
      level,
      `Berechne die Nullstelle x₀ der linearen Funktion f(x) = ${linear(m, t, 1)}.`,
      `Der Pegelstand eines Behälters folgt der Gleichung h(t) = ${linear(m, t, 1)} (Zeit t als x). Wann erreicht der Graph die x-Achse (h = 0)?`,
      [
        numberField("Nullstelle x₀ =", x0, "", 1, {
          slips: [
            { value: -x0, hint: `Prüfe das Vorzeichen in x₀ = ${MINUS}t / m.` },
            { value: t, hint: `t = ${fmt(t, 1)} ist der y-Achsenabschnitt; setze f(x) = 0.` },
          ],
        }),
      ],
      `Setze f(x) = 0, also ${linear(m, t, 1)} = 0, und löse nach x auf.`,
      `${fmt(m, 0)}x = ${fmt(-t, 1)}.`,
      `x₀ = ${fmt(-t, 1)} / ${fmt(m, 0)} = <strong>${fmt(x0, 1)}</strong>.`,
      { m, t, x0 },
    );
  },
};

const exZeroFromParam: ExerciseGenerator = {
  id: "lf-nullstelle-parameter",
  make(rng, level) {
    const m = rng.pick([-3, -2, 2, 3, 4]);
    const x0 = rng.pick([-4, -3, -2, 2, 3, 4]);
    const t = -m * x0;

    return task(
      level,
      `Eine Gerade hat die Steigung m = ${fmt(m, 0)} und schneidet die x-Achse bei x₀ = ${fmt(x0, 0)}. Bestimme den y-Achsenabschnitt t.`,
      `Ein Flugzeug sinkt bzw. steigt entlang einer Geraden mit Steigung m = ${fmt(m, 0)} und Nullstelle N(${fmt(x0, 0)} | 0). Welchen y-Achsenabschnitt t besitzt die zugehörige Funktionsgleichung?`,
      [
        intField("t =", t, [
          { value: -t, hint: `Setze N(${fmt(x0, 0)} | 0) in 0 = m·x₀ + t ein → t = ${MINUS}m · x₀.` },
          ...(m + x0 !== t ? [{ value: m + x0, hint: `Multipliziere m und x₀, nicht addieren.` }] : []),
        ]),
      ],
      `Die Nullstelle ist der Punkt (${fmt(x0, 0)} | 0): Setze y = 0 und x = ${fmt(x0, 0)} ein.`,
      `0 = ${fmt(m, 0)} · (${fmt(x0, 0)}) + t ⇒ 0 = ${fmt(m * x0, 0)} + t.`,
      `t = <strong>${fmt(t, 0)}</strong> (also f(x) = ${linear(m, t, 0)}).`,
      { m, x0, t },
    );
  },
};

const exIntersectTwoLines: ExerciseGenerator = {
  id: "lf-schnittpunkt-rechnen",
  make(rng, level) {
    const xS = level === 1 ? rng.int(1, 5) : rng.int(-4, 4);
    const m1 = rng.pick([1, 2, 3]);
    let m2 = rng.pick([-2, -1, 0.5]);
    if (m1 === m2) m2 = -1;
    const yS = rng.int(-3, 6);
    const t1 = yS - m1 * xS;
    const t2 = yS - m2 * xS;

    return task(
      level,
      `Berechne den Schnittpunkt S(x | y) der beiden Geraden g: y = ${linear(m1, t1, 1)} und h: y = ${linear(m2, t2, 1)}.`,
      `Zwei Messreihen folgen g(x) = ${linear(m1, t1, 1)} und h(x) = ${linear(m2, t2, 1)}. Bei welchem Punkt S(x | y) nehmen beide Geraden denselben Wert an?`,
      [
        numberField("x =", xS, "", 1),
        numberField("y =", yS, "", 1),
      ],
      `Setze beide Gleichungen gleich: ${linear(m1, t1, 1)} = ${linear(m2, t2, 1)}.`,
      `${fmt(m1 - m2, 1)}x = ${fmt(t2 - t1, 1)} ⇒ x = ${fmt(xS, 1)}.`,
      `Einsetzen in g: y = ${fmt(m1, 1)} · (${fmt(xS, 1)})${signed(t1, 1)} = ${fmt(yS, 1)} → <strong>S(${fmt(xS, 1)} | ${fmt(yS, 1)})</strong>.`,
      { xS, yS, m1, t1, m2, t2 },
    );
  },
};

const exLinePositionCheck: ExerciseGenerator = {
  id: "lf-lage-pruefen",
  make(rng, level) {
    const m1 = rng.pick([-2, 1, 2, 3]);
    const t1 = rng.int(-4, 5);
    const kind = level === 1 ? rng.int(0, 2) : rng.int(0, 2);
    const m2 = kind === 2 ? m1 + 1 : m1;
    const t2 = kind === 0 ? t1 + 3 : kind === 1 ? t1 : t1 - 2;
    const right =
      kind === 0
        ? "echt parallel (kein Schnittpunkt)"
        : kind === 1
          ? "identisch (unendlich viele gemeinsame Punkte)"
          : "sie schneiden sich in genau einem Punkt";

    return task(
      level,
      `Vergleiche g: y = ${linear(m1, t1, 0)} und h: y = ${linear(m2, t2, 0)}. Wie liegen die beiden Geraden zueinander?`,
      `Zwei Geraden sind gegeben durch g: y = ${linear(m1, t1, 0)} und h: 2y = ${linear(2 * m2, 2 * t2, 0)}. Untersuche nach dem Umstellen von h auf y = m·x + t ihre Lagebeziehung.`,
      [
        choiceField(
          "Lagebeziehung",
          [
            right,
            ...(kind === 0
              ? ["identisch (unendlich viele gemeinsame Punkte)", "sie schneiden sich in genau einem Punkt"]
              : kind === 1
                ? ["echt parallel (kein Schnittpunkt)", "sie schneiden sich in genau einem Punkt"]
                : ["echt parallel (kein Schnittpunkt)", "identisch (unendlich viele gemeinsame Punkte)"]),
          ],
          0,
        ),
      ],
      `Vergleiche zuerst die Steigungen m₁ und m₂, dann bei gleicher Steigung t₁ und t₂.`,
      `g hat m₁ = ${fmt(m1, 0)}, t₁ = ${fmt(t1, 0)}; h hat m₂ = ${fmt(m2, 0)}, t₂ = ${fmt(t2, 0)}.`,
      `Ergebnis: <strong>${right}</strong>.`,
      { m1, t1, m2, t2, kind },
    );
  },
};

const exTariffModel: ExerciseGenerator = {
  id: "lf-tarif-modell",
  make(rng, level) {
    const baseA = rng.pick([10, 15, 20]);
    const baseB = baseA + rng.pick([10, 15]);
    const rateB = rng.pick([0.2, 0.25]);
    const rateA = rateB + 0.25;
    const xBreak = Math.round((baseB - baseA) / (rateA - rateB));
    const costAtBreak = baseA + rateA * xBreak;

    return task(
      level,
      `Tarif A kostet ${fmt(baseA, 0)} € Grundgebühr plus ${fmt(rateA, 2)} € je km; Tarif B kostet ${fmt(baseB, 0)} € Grundgebühr plus ${fmt(rateB, 2)} € je km. Ab wie vielen km x sind beide Tarife gleich teuer?`,
      `Für eine Fahrt werden zwei Leihwagen-Tarife verglichen: A (${fmt(baseA, 0)} € + ${fmt(rateA, 2)} €/km) und B (${fmt(baseB, 0)} € + ${fmt(rateB, 2)} €/km). Berechne die Gleichstands-Strecke x und den Preis an dieser Stelle.`,
      level === 1
        ? [
            intField("Gleichstand bei x =", xBreak, [
              { value: Math.round((baseB - baseA) / (rateA + rateB)), hint: `Subtrahiere die Kilometerpreise voneinander: ${fmt(rateA, 2)} ${MINUS} ${fmt(rateB, 2)}.` },
            ], "km"),
          ]
        : [
            intField("Strecke x =", xBreak, undefined, "km"),
            numberField("Preis dabei =", costAtBreak, "€", 2),
          ],
      `Setze ${fmt(baseA, 0)} + ${fmt(rateA, 2)}x = ${fmt(baseB, 0)} + ${fmt(rateB, 2)}x.`,
      `${fmt(rateA - rateB, 2)}x = ${fmt(baseB - baseA, 0)} ⇒ x = ${fmt(xBreak, 0)} km.`,
      `Beide Tarife kosten bei <strong>${fmt(xBreak, 0)} km</strong> genau <strong>${fmt(costAtBreak, 2)} €</strong>.`,
      { baseA, rateA, baseB, rateB, xBreak, costAtBreak },
    );
  },
};

const exMotionStory: ExerciseGenerator = {
  id: "lf-bewegung-fuellen",
  make(rng, level) {
    const start = rng.int(120, 300);
    const rate = rng.pick([15, 20, 25, 30]);
    const tEnd = start / rate;
    const tQuery = rng.int(2, Math.max(2, Math.floor(tEnd) - 1));
    const yQuery = start - rate * tQuery;

    return task(
      level,
      `Ein Tank enthält ${fmt(start, 0)} l Wasser und wird gleichmäßig um ${fmt(rate, 0)} l/min geleert: V(t) = ${fmt(start, 0)} ${MINUS} ${fmt(rate, 0)}t. Wie viel Wasser ist nach ${fmt(tQuery, 0)} min noch im Tank, und nach wie vielen Minuten ist er leer?`,
      `Ein Akku hat ${fmt(start, 0)} Wh und verliert pro Stunde konstant ${fmt(rate, 0)} Wh. Bestimme die Restenergie nach ${fmt(tQuery, 0)} Stunden und die gesamte Laufzeit bis 0 Wh.`,
      [
        intField("Restmenge", yQuery, undefined, level === 1 ? "l" : "Wh"),
        numberField("Leer nach", tEnd, level === 1 ? "min" : "h", 1),
      ],
      `Restmenge = ${fmt(start, 0)} ${MINUS} ${fmt(rate, 0)} · ${fmt(tQuery, 0)}; leer bedeutet V(t) = 0.`,
      `Nach ${fmt(tQuery, 0)}: ${fmt(start, 0)} ${MINUS} ${fmt(rate * tQuery, 0)} = ${fmt(yQuery, 0)}.`,
      `Nullstelle: ${fmt(start, 0)} / ${fmt(rate, 0)} = ${fmt(tEnd, 1)} → Rest <strong>${fmt(yQuery, 0)}</strong>, leer nach <strong>${fmt(tEnd, 1)}</strong>.`,
      { start, rate, tQuery, yQuery, tEnd },
    );
  },
};

const exInequalitySolve: ExerciseGenerator = {
  id: "lf-ungleichung-rechnen",
  make(rng, level) {
    const a = level === 1 ? rng.pick([2, 3, 4]) : rng.pick([-4, -3, -2]);
    const bound = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const b = rng.int(-5, 6);
    const rhs = a * bound + b;
    const isLess = rng.int(0, 1) === 0;
    const opStr = isLess ? "<" : "≥";
    // If a > 0, sign keeps: < stays <, >= stays >=
    // If a < 0, sign flips: < becomes >, >= becomes <=
    const resDir = a > 0 ? (isLess ? "<" : "≥") : (isLess ? ">" : "≤");
    const expectedInterval =
      resDir === "<"
        ? `]${MINUS}∞; ${fmt(bound, 0)}[`
        : resDir === "≤"
          ? `]${MINUS}∞; ${fmt(bound, 0)}]`
          : resDir === ">"
            ? `]${fmt(bound, 0)}; ∞[`
            : `[${fmt(bound, 0)}; ∞[`;

    const wrongFlipped =
      resDir === "<" || resDir === "≤"
        ? `[${fmt(bound, 0)}; ∞[`
        : `]${MINUS}∞; ${fmt(bound, 0)}[`;
    const wrongBracket =
      resDir === "<"
        ? `]${MINUS}∞; ${fmt(bound, 0)}]`
        : resDir === "≤"
          ? `]${MINUS}∞; ${fmt(bound, 0)}[`
          : resDir === ">"
            ? `[${fmt(bound, 0)}; ∞[`
            : `]${fmt(bound, 0)}; ∞[`;

    return task(
      level,
      `Löse die lineare Ungleichung ${linear(a, b, 0)} ${opStr} ${fmt(rhs, 0)} und gib die Grenze sowie das Lösungsintervall an.`,
      `Für welche x-Werte liegt der Graph von f(x) = ${linear(a, b, 0)} ${isLess ? "echt unterhalb von" : "auf oder über"} y = ${fmt(rhs, 0)}? Löse rechnerisch in Intervallschreibweise.`,
      [
        intField("Grenze x =", bound, [
          { value: -bound, hint: `Prüfe das Vorzeichen beim Teilen durch ${fmt(a, 0)}.` },
        ]),
        choiceField("Lösungsintervall", [expectedInterval, wrongFlipped, wrongBracket], 0),
      ],
      `Bringe ${signed(b, 0)} auf die andere Seite und teile durch ${fmt(a, 0)}${a < 0 ? " (Achtung: Zeichen umdrehen!)" : ""}.`,
      `${fmt(a, 0)}x ${opStr} ${fmt(rhs - b, 0)} ⇒ x ${resDir} ${fmt(bound, 0)}.`,
      `Grenze <strong>${fmt(bound, 0)}</strong>, Intervall: <strong>${expectedInterval}</strong>.`,
      { a, b, rhs, bound },
    );
  },
};

const exIntervalMatch: ExerciseGenerator = {
  id: "lf-intervall-grafik",
  make(rng, level) {
    const bound = rng.int(-3, 4);
    const closed = level === 2 ? rng.int(0, 1) === 1 : true;
    const rightRay = rng.int(0, 1) === 1;
    const interval = rightRay
      ? `${closed ? "[" : "]"}${fmt(bound, 0)}; ∞[`
      : `]${MINUS}∞; ${fmt(bound, 0)}${closed ? "]" : "["}`;

    const wrong1 = rightRay
      ? `${closed ? "]" : "["}${fmt(bound, 0)}; ∞[`
      : `]${MINUS}∞; ${fmt(bound, 0)}${closed ? "[" : "]"}`;
    const wrong2 = rightRay
      ? `]${MINUS}∞; ${fmt(bound, 0)}${closed ? "]" : "["}`
      : `${closed ? "[" : "]"}${fmt(bound, 0)}; ∞[`;

    const desc = rightRay
      ? `Alle Zahlen ${closed ? "größer oder gleich" : "echt größer als"} ${fmt(bound, 0)}`
      : `Alle Zahlen ${closed ? "kleiner oder gleich" : "echt kleiner als"} ${fmt(bound, 0)}`;

    return task(
      level,
      `Wie schreibt man die Lösungsmenge „${desc}“ in Intervallschreibweise?`,
      `Am Zahlenstrahl zeigt ein Strahl von ${fmt(bound, 0)} nach ${rightRay ? "rechts" : "links"} mit einem ${closed ? "ausgefüllten" : "offenen"} Kreis bei ${fmt(bound, 0)}. Wähle das zugehörige Lösungsintervall.`,
      [choiceField("Passendes Intervall", [interval, wrong1, wrong2], 0)],
      `Offene Klammer nach außen bedeutet: Randwert gehört nicht dazu; ∞ trägt immer eine offene Klammer.`,
      `${closed ? "Ausgefüllter Kreis → Rand gehört dazu (Klammer nach innen)" : "Offener Kreis → Rand gehört nicht dazu (Klammer nach außen)"}.`,
      `Richtige Intervallschreibweise: <strong>${interval}</strong>.`,
      { bound },
    );
  },
};

const exPropFactor: ExerciseGenerator = {
  id: "lf-prop-faktor",
  make(rng, level) {
    const a = rng.pick([1.5, 2, 2.5, 3, 4]);
    const x1 = rng.int(2, 5);
    const y1 = a * x1;
    const x2 = level === 1 ? x1 * 2 : rng.int(6, 9);
    const y2 = a * x2;

    return task(
      level,
      `Die Größen x und y sind direkt proportional mit dem Wertepaar (${fmt(x1, 0)} | ${fmt(y1, 1)}). Bestimme den Proportionalitätsfaktor a und den Wert y für x = ${fmt(x2, 0)}.`,
      `In einem Physik-Experiment ist die Gewichtskraft bzw. Verlängerung direkt proportional zur Masse: Bei ${fmt(x1, 0)} kg misst man ${fmt(y1, 1)} N. Wie groß ist der Proportionalitätsfaktor a, und welchen Wert erwartet man bei ${fmt(x2, 0)} kg?`,
      [
        numberField("Faktor a =", a, "", 2, {
          slips: [{ value: x1 / y1, hint: `Der Faktor in y = a·x lautet a = y / x, nicht x / y.` }],
        }),
        numberField(`y(${fmt(x2, 0)}) =`, y2, level === 1 ? "" : "N", 1),
      ],
      `Bei direkter Proportionalität gilt y = a · x, also a = y / x.`,
      `a = ${fmt(y1, 1)} / ${fmt(x1, 0)} = ${fmt(a, 2)}.`,
      `Damit: y(${fmt(x2, 0)}) = ${fmt(a, 2)} · ${fmt(x2, 0)} = <strong>${fmt(y2, 1)}</strong> (<strong>a = ${fmt(a, 2)}</strong>).`,
      { a, x1, y1, x2, y2 },
    );
  },
};

const exPropCheckTable: ExerciseGenerator = {
  id: "lf-prop-pruefen",
  make(rng, level) {
    const a = rng.pick([2, 3, 4]);
    const prop = level === 1 ? rng.int(0, 1) === 1 : rng.int(0, 1) === 1;
    const t = prop ? 0 : rng.int(2, 6);
    const x1 = 2;
    const x2 = 5;
    const y1 = a * x1 + t;
    const y2 = a * x2 + t;

    return task(
      level,
      `Gegeben sind die Wertepaare (${fmt(x1, 0)} | ${fmt(y1, 0)}) und (${fmt(x2, 0)} | ${fmt(y2, 0)}) einer linearen Zuordnung. Prüfe rechnerisch anhand der Quotienten y/x, ob direkte Proportionalität vorliegt.`,
      `Aus einem Labor stammen zwei Messpunkte: (${fmt(x1, 0)} | ${fmt(y1, 0)}) und (${fmt(x2, 0)} | ${fmt(y2, 0)}). Entscheide mithilfe der Quotienten y/x (Ursprungsgerade y = a·x?), ob beide Größen direkt proportional sind.`,
      [
        choiceField(
          "Direkte Proportionalität?",
          prop
            ? ["Ja, beide Quotienten y/x sind gleich (Ursprungsgerade)", "Nein, y/x unterscheidet sich (t ≠ 0)"]
            : ["Nein, y/x unterscheidet sich (t ≠ 0)", "Ja, beide Quotienten y/x sind gleich (Ursprungsgerade)"],
          0,
        ),
      ],
      `Teile bei beiden Paaren y durch x und prüfe, ob derselbe Wert entsteht.`,
      `${fmt(y1, 0)} / ${fmt(x1, 0)} = ${fmt(y1 / x1, 2)} und ${fmt(y2, 0)} / ${fmt(x2, 0)} = ${fmt(y2 / x2, 2)}.`,
      prop
        ? `Beide Quotienten sind gleich (${fmt(a, 0)}): <strong>Ja, direkt proportional (y = ${fmt(a, 0)}x)</strong>.`
        : `Die Quotienten ${fmt(y1 / x1, 2)} ≠ ${fmt(y2 / x2, 2)} weichen ab (t = ${fmt(t, 0)} ≠ 0): <strong>Nein</strong>.`,
      { a, t, x1, y1, x2, y2 },
    );
  },
};

export const STAGE_2_LESSONS = makeLessons([
  {
    id: "lf-1-parameter",
    section: "2",
    title: "Geradengleichung y = m·x + t verstehen",
    subtitle: "Die Bedeutung der Parameter m (Steigung) und t (y-Achsenabschnitt)",
    whyItMatters: "Jede gleichmäßige Änderung – von Fahrpreisen bis zu Bewegungsabläufen – folgt einer Geraden y = m·x + t.",
    explanationHtml: `<p>Eine Funktion mit der Gleichung <strong>y = m · x + t</strong> heißt <strong>lineare Funktion</strong>. Ihr Graph ist stets eine Gerade.</p>
<ul><li><strong>m</strong> gibt die <strong>Steigung</strong> an: Geht man um 1 Einheit nach rechts, ändert sich y um m (m &gt; 0 steigend, m &lt; 0 fallend, m = 0 waagrecht).</li><li><strong>t</strong> gibt den <strong>y-Achsenabschnitt</strong> an: Die Gerade schneidet die y-Achse im Punkt S<sub>y</sub>(0 | t).</li></ul>
${CONCEPT_DIAGRAMS.lf1}
<div class="example"><strong>Beispiel:</strong> y = 1,5 · x + 1.<br>Bei x = 0 ergibt sich y = 1, also S<sub>y</sub>(0 | 1) und t = 1.<br>Geht man um Δx = 2 nach rechts, steigt die Gerade um Δy = 3 nach oben: m = 3 / 2 = 1,5.</div>
<div class="merke"><strong>Merke:</strong> In y = m · x + t bestimmt m die Richtung und Steilheit (Steigungsdreieck) und t die Höhe auf der y-Achse.</div>`,
    formulas: [
      { name: "Lineare Funktion", html: "y = m · x + t", quantities: "m Steigung, t y-Achsenabschnitt" },
      { name: "Steigungsformel", html: "m = Δy / Δx", quantities: "Höhenänderung pro Rechts-Schritt" },
    ],
    quiz: Q(
      "Wie verläuft der Graph der linearen Funktion y = −2x + 5?",
      "Er fällt nach rechts ab und schneidet die y-Achse bei S_y(0 | 5).",
      "Er steigt nach rechts an und schneidet die y-Achse bei S_y(0 | −2).",
      "Er verläuft waagrecht in Höhe y = −2.",
      "Die Steigung m = −2 ist negativ (fallend), und der y-Achsenabschnitt ist t = 5.",
    ),
    lab: labLineMT,
    exercises: [exInterpretParams, exValueFromLine],
    celebrationMessage: "Du deutest m und t jeder Geraden sicher.",
  },
  {
    id: "lf-2-zeichnen-ablesen",
    section: "2",
    title: "Geraden zeichnen und aus dem Graphen ablesen",
    subtitle: "Mit y-Achsenabschnitt und Steigungsdreieck arbeiten",
    whyItMatters: "Anstatt mühsam viele Punkte zu rechnen, genügen S_y und ein einziges Steigungsdreieck.",
    explanationHtml: `<p><strong>Zeichnen von y = m·x + t:</strong> Markiere zuerst S<sub>y</sub>(0 | t) auf der y-Achse. Wähle dann eine geschickte Schrittweite Δx nach rechts (bei Brüchen m = p/q am besten Δx = q), trage Δy = m · Δx nach oben oder unten ab und verbinde.</p>
<p><strong>Ablesen am Graphen:</strong> Lies S<sub>y</sub>(0 | t) ab, suche einen zweiten gut ablesbaren Gitterpunkt auf der Geraden und bestimme m = Δy / Δx.</p>
${CONCEPT_DIAGRAMS.lf2}
<div class="example"><strong>Beispiel Ablesen:</strong> Die Gerade schneidet die y-Achse bei S<sub>y</sub>(0 | 3) → t = 3.<br>Geht man 2 Einheiten nach rechts, sinkt sie um 1 Einheit → m = −1 / 2 = −0,5.<br>Gleichung: y = −0,5x + 3.</div>
<div class="merke"><strong>Merke:</strong> Für das Steigungsdreieck gilt immer: erst Δx nach rechts, dann Δy nach oben (+) oder unten (−), schließlich m = Δy / Δx.</div>`,
    formulas: [
      { name: "Steigungsdreieck", html: "m = Δy / Δx", quantities: "bei m = p/q: q nach rechts, p nach oben/unten" },
    ],
    quiz: Q(
      "Eine Gerade schneidet die y-Achse bei (0 | −1) und geht durch (3 | 5). Wie lautet m?",
      "m = 2",
      "m = 0,5",
      "m = −1",
      "Von (0 | −1) bis (3 | 5) beträgt Δx = 3 und Δy = 5 − (−1) = 6, also m = 6 / 3 = 2.",
    ),
    lab: labLineReadGraph,
    exercises: [exReadGraphMT, exSlopeTriangleStep],
    celebrationMessage: "Du zeichnest Geraden und liest m und t sicher aus Graphen ab.",
  },
  {
    id: "lf-3-aufstellen",
    section: "2",
    title: "Geradengleichungen rechnerisch aufstellen",
    subtitle: "Aus zwei Punkten P und Q zur Funktionsgleichung y = m·x + t",
    whyItMatters: "Aus zwei bekannten Messpunkten gewinnst du sofort das lineare Modell für Zwischenwerte und Vorhersagen.",
    explanationHtml: `<p>Sind zwei Punkte P(x₁ | y₁) und Q(x₂ | y₂) mit x₁ ≠ x₂ gegeben, bestimmst du die Geradengleichung in zwei festen Schritten:</p>
<ol class="steps"><li><strong>Steigung m berechnen:</strong> m = (y₂ − y₁) / (x₂ − x₁).</li><li><strong>t bestimmen:</strong> Setze m und die Koordinaten eines Punktes (z. B. P) in y = m·x + t ein und löse nach t auf.</li></ol>
${CONCEPT_DIAGRAMS.lf3}
<div class="example"><strong>Beispiel:</strong> P(1 | 2) und Q(4 | 8).<br>Schritt 1: m = (8 − 2) / (4 − 1) = 6 / 3 = 2.<br>Schritt 2: P einsetzen: 2 = 2 · 1 + t ⇒ t = 0.<br>Ergebnis: y = 2x.</div>
<div class="merke"><strong>Merke:</strong> Subtrahiere im Zähler und Nenner immer in derselben Reihenfolge: Q minus P oder P minus Q – beides liefert dasselbe m.</div>`,
    formulas: [
      { name: "Zweipunkt-Steigung", html: "m = (y₂ − y₁) / (x₂ − x₁)", quantities: "x₁ ≠ x₂ erforderlich" },
      { name: "Punkt einsetzen", html: "t = y₁ − m · x₁", quantities: "liefert den y-Achsenabschnitt" },
    ],
    quiz: Q(
      "Welche Steigung besitzt die Gerade durch A(2 | 7) und B(5 | 1)?",
      "m = −2",
      "m = 2",
      "m = −0,5",
      "m = (1 − 7) / (5 − 2) = −6 / 3 = −2.",
    ),
    lab: labLineTwoPoints,
    exercises: [exPointSlopeLine, exTwoPointsLine],
    celebrationMessage: "Du stellst jede Geradengleichung sicher rechnerisch auf.",
  },
  {
    id: "lf-4-nullstellen",
    section: "2",
    title: "Nullstellen linearer Funktionen",
    subtitle: "Wo schneidet die Gerade die x-Achse?",
    whyItMatters: "Die Nullstelle zeigt, wann ein Tank leer ist, wann Schulden abgezahlt sind oder ab wann ein Projekt Gewinn macht.",
    explanationHtml: `<p>Die <strong>Nullstelle</strong> x₀ ist der x-Wert, an dem die Funktion den Wert 0 annimmt: f(x₀) = 0.</p>
<p>Für eine Gerade y = m·x + t mit m ≠ 0 löst du die lineare Gleichung m · x₀ + t = 0 und erhältst <strong>x₀ = −t / m</strong>. Bei m = 0 (waagrechte Gerade) gibt es bei t ≠ 0 keine Nullstelle.</p>
${CONCEPT_DIAGRAMS.lf4}
<div class="example"><strong>Beispiel:</strong> f(x) = 2x − 6.<br>Ansatz: 2x − 6 = 0 | + 6 ⇒ 2x = 6 | : 2 ⇒ x₀ = 3.<br>Der Schnittpunkt mit der x-Achse lautet N(3 | 0).</div>
<div class="merke"><strong>Merke:</strong> Nullstelle x₀ ist eine Zahl (x₀ = 3), der Achsenschnittpunkt ein Punkt N(3 | 0).</div>`,
    formulas: [
      { name: "Nullstellenansatz", html: "m · x₀ + t = 0 ⇒ x₀ = −t / m", quantities: "für m ≠ 0 genau eine Nullstelle N(x₀ | 0)" },
    ],
    quiz: Q(
      "Welche lineare Funktion besitzt KEINE Nullstelle?",
      "y = 4",
      "y = 4x",
      "y = −4x + 8",
      "y = 4 hat Steigung m = 0 und verläuft parallel zur x-Achse in Höhe 4, schneidet sie also nie.",
    ),
    lab: labLineZeroPoint,
    exercises: [exFindZero, exZeroFromParam],
    celebrationMessage: "Du berechnest Nullstellen linearer Funktionen zuverlässig.",
  },
  {
    id: "lf-5-schnittpunkt",
    section: "2",
    title: "Schnittpunkt zweier Geraden",
    subtitle: "Gleichsetzen und Lagebeziehungen erkennen",
    whyItMatters: "Der Schnittpunkt zeigt, wann zwei Verträge, Wege oder Temperaturen exakt übereinstimmen.",
    explanationHtml: `<p>Am gemeinsamen Schnittpunkt S(x | y) zweier Geraden g: y = m₁x + t₁ und h: y = m₂x + t₂ stimmen beide y-Werte überein. Man setzt daher die Terme gleich: <strong>m₁x + t₁ = m₂x + t₂</strong>.</p>
<ul><li><strong>m₁ ≠ m₂:</strong> Genau ein Schnittpunkt S.</li><li><strong>m₁ = m₂ und t₁ ≠ t₂:</strong> Echt parallele Geraden (kein Schnittpunkt).</li><li><strong>m₁ = m₂ und t₁ = t₂:</strong> Identische Geraden (unendlich viele gemeinsame Punkte).</li></ul>
${CONCEPT_DIAGRAMS.lf5}
<div class="example"><strong>Beispiel:</strong> g: y = x + 1 und h: y = −0,5x + 4.<br>Gleichsetzen: x + 1 = −0,5x + 4 ⇒ 1,5x = 3 ⇒ x = 2.<br>Einsetzen in g: y = 2 + 1 = 3 → Schnittpunkt S(2 | 3).</div>
<div class="merke"><strong>Merke:</strong> Nach dem Berechnen von x immer in eine der Ausgangsgleichungen einsetzen, um die y-Koordinate von S zu erhalten (und in die zweite zur Probe!).</div>`,
    formulas: [
      { name: "Schnittpunktansatz", html: "m₁x + t₁ = m₂x + t₂", quantities: "liefert x-Koordinate von S (falls m₁ ≠ m₂)" },
    ],
    quiz: Q(
      "Was gilt für g: y = 3x + 1 und h: y = 3x − 4?",
      "Sie sind echt parallel und haben keinen Schnittpunkt.",
      "Sie schneiden sich bei x = 1.",
      "Sie sind identisch.",
      "Beide Geraden haben dieselbe Steigung m = 3, aber verschiedene y-Achsenabschnitte (1 ≠ −4).",
    ),
    lab: labLineIntersection,
    exercises: [exIntersectTwoLines, exLinePositionCheck],
    celebrationMessage: "Du findest Schnittpunkte und erkennst parallele sowie identische Geraden.",
  },
  {
    id: "lf-6-sachkontext",
    section: "2",
    title: "Lineare Funktionen im Sachzusammenhang",
    subtitle: "Texte modellieren und Graphen sachgerecht deuten",
    whyItMatters: "Hier übersetzt du reale Kosten, Strecken oder Füllmengen in Gleichungen und liest Empfehlungen direkt am Graphen ab.",
    explanationHtml: `<p>In Sachaufgaben trägt die Steigung m eine Einheit (z. B. €/min, l/h oder km/h) und bedeutet die <strong>Änderungsrate pro Einheit</strong>. Der Parameter t gibt den <strong>Startwert</strong> bei x = 0 an (Grundgebühr, Anfangsbestand).</p>
${CONCEPT_DIAGRAMS.lf6}
<div class="example"><strong>Beispiel Tarifvergleich:</strong> Tarif A: 10 + 0,50 · x, Tarif B: 20 + 0,25 · x.<br>Gleichsetzen: 10 + 0,50x = 20 + 0,25x ⇒ 0,25x = 10 ⇒ x = 40 min (30 €).<br>Unter 40 min liegt der Graph von A tiefer (günstiger), darüber liegt B tiefer.</div>
<div class="merke"><strong>Merke:</strong> Überlege im Sachkontext immer, welche Werte für x sinnvoll sind (z. B. x ≥ 0 bei Zeiten oder Mengen) und nenne beim Deuten die Einheiten!</div>`,
    formulas: [
      { name: "Sachmodell", html: "Größe(x) = Änderungsrate · x + Startwert", quantities: "Steigung m mit Einheit „y-Einheit pro x-Einheit“" },
    ],
    quiz: Q(
      "Ein Mietwagen kostet 35 € Grundgebühr plus 0,20 € pro km. Wofür steht 0,20 in K(x) = 0,20x + 35?",
      "Für die Zusatzkosten pro gefahrenem Kilometer",
      "Für die gefahrene Gesamtstrecke in km",
      "Für die einmalige Kaution beim Abholen",
      "Der Faktor vor x ist die Steigung und gibt den Zuwachs je 1 km an.",
    ),
    lab: labLinearTariffs,
    exercises: [exTariffModel, exMotionStory],
    celebrationMessage: "Du wendest lineare Funktionen sicher auf Sachsituationen an.",
  },
  {
    id: "lf-7-ungleichungen",
    section: "2",
    title: "Lineare Ungleichungen und Intervallschreibweise",
    subtitle: "Graphisch und rechnerisch lösen — inklusive Vorzeichenregel",
    whyItMatters: "Wann ist Tarif A billiger als B? Wann bleibt ein Budget unter 100 €? Das sind genau lineare Ungleichungen.",
    explanationHtml: `<p>Eine lineare Ungleichung wie −2x + 4 &lt; 10 löst man wie eine Gleichung durch Äquivalenzumformungen — mit <strong>einer wichtigen Zusatzregel</strong>:</p>
<p>Multipliziert oder dividiert man beide Seiten mit einer <strong>negativen Zahl</strong>, <strong>dreht sich das Ungleichheitszeichen um</strong> (&lt; wird zu &gt;, ≤ wird zu ≥).</p>
<p><strong>Intervallschreibweise:</strong> Gehört der Randwert dazu (≤, ≥), zeigt die eckige Klammer zum Intervall hin (z. B. [2; ∞[). Gehört er nicht dazu (&lt;, &gt;), zeigt die Klammer nach außen (z. B. ]−3; ∞[). Unendlich (±∞) trägt immer eine offene Klammer.</p>
${CONCEPT_DIAGRAMS.lf7}
<div class="example"><strong>Beispiel:</strong> −2x + 4 &lt; 10 | −4 ⇒ −2x &lt; 6 | : (−2) ⇒ x &gt; −3.<br>Lösungsmenge: L = ]−3; ∞[.<br>Graphisch: Für alle x rechts von −3 verläuft y = −2x + 4 unterhalb von y = 10.</div>
<div class="merke"><strong>Merke:</strong> Teilen durch oder Malnehmen mit einer negativen Zahl dreht das Relationszeichen um! Klammer nach innen = Rand inklusive, nach außen = Rand exklusive.</div>`,
    formulas: [
      { name: "Inversionsregel", html: "−a · x &lt; b &nbsp;⇔&nbsp; x &gt; −b / a &nbsp;(a &gt; 0)", quantities: "Relationszeichen dreht bei Multiplikation/Division mit negativer Zahl um" },
      { name: "Intervalle", html: "[a; ∞[ bzw. ]−∞; a[", quantities: "Klammer nach innen: eingeschlossen; nach außen: ausgeschlossen" },
    ],
    quiz: Q(
      "Welche Lösungsmenge gehört zu −3x ≥ 12?",
      "L = ]−∞; −4]",
      "L = [−4; ∞[",
      "L = ]−∞; −4[",
      "Beim Teilen durch −3 dreht sich ≥ zu ≤ um: x ≤ −4, also ]−∞; −4] mit −4 eingeschlossen.",
    ),
    lab: labLinearInequality,
    exercises: [exInequalitySolve, exIntervalMatch],
    celebrationMessage: "Du beherrschst lineare Ungleichungen und die Intervallschreibweise.",
  },
  {
    id: "lf-8-proportional",
    section: "2",
    title: "Ursprungsgerade und direkte Proportionalität",
    subtitle: "Der Spezialfall y = a · x aus Mathematik und Physik",
    whyItMatters: "Masse und Gewichtskraft, Stromstärke und Spannung bei festem Widerstand (Physik 8): Alles dahinter ist y = a · x.",
    explanationHtml: `<p>Für t = 0 entsteht aus y = m·x + t der Spezialfall <strong>y = a · x</strong>. Der Graph ist eine <strong>Ursprungsgerade</strong> durch (0 | 0).</p>
<p>Zwei Größen x und y sind genau dann <strong>direkt proportional</strong> zueinander, wenn ihr Verhältnis (Quotient) <strong>y / x = a</strong> für alle Wertepaare (mit x ≠ 0) konstant bleibt: Verdoppelt man x, verdoppelt sich auch y.</p>
${CONCEPT_DIAGRAMS.lf8}
<div class="example"><strong>Beispiel:</strong> Ein Draht hat den Widerstand R = 2,5 Ω.<br>Spannung U = 2,5 · I: Bei I = 2 A ist U = 5 V (U/I = 2,5), bei I = 4 A ist U = 10 V (U/I = 2,5).<br>Der Graph geht durch (0 | 0) → direkt proportional!</div>
<div class="merke"><strong>Merke:</strong> Direkte Proportionalität ⇔ Ursprungsgerade y = a · x ⇔ Quotientengleichheit y / x = a (konstant). Sobald t ≠ 0 ist, liegt keine direkte Proportionalität mehr vor.</div>`,
    formulas: [
      { name: "Direkte Proportionalität", html: "y = a · x &nbsp;⇔&nbsp; y / x = a", quantities: "Graph ist stets eine Gerade durch den Ursprung (0 | 0)" },
    ],
    quiz: Q(
      "Welche Funktionsgleichung beschreibt zueinander direkt proportionale Größen?",
      "y = 0,8 · x",
      "y = 0,8 · x + 2",
      "y = 8 / x",
      "Nur y = a · x ohne konstanten Summanden t ≠ 0 ergibt eine Ursprungsgerade mit konstantem Quotienten y / x = 0,8.",
    ),
    lab: labDirectProportion,
    exercises: [exPropFactor, exPropCheckTable],
    celebrationMessage: "Etappe 2 geschafft: Du bist sicher bei linearen Funktionen!",
  },
]);
