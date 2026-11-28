import { fmt, frac, linear, MINUS } from "../exercises/format";
import { CONCEPT_DIAGRAMS } from "./concept-diagrams";
import { Q, signed, task } from "./builders";
import { choiceField, intField, numberField } from "./helpers";
import {
  labFormulaRearranger,
  labFracEqGraph,
  labFracEqSolver,
  labIntPowersLab,
  labRationalAddSub,
  labRationalMulDiv,
  labRationalSimplify,
} from "./labs-4-7";
import { makeLessons } from "./make";
import { intPower } from "./math";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators LB 4 ────────────────────────────────────────────────────────

const exSimplifyFactor: ExerciseGenerator = {
  id: "bt-kuerzen-ausklammern",
  make(rng, level) {
    const k = rng.int(2, 5);
    const a = rng.pick([2, 3, 4]);
    const xVal = a + rng.pick([1, 2, 3]);
    const ans = k / (xVal - a);

    return task(
      level,
      `Kürze den Bruchterm T(x) = ${frac(`${fmt(k, 0)}x + ${fmt(k * a, 0)}`, `x² ${MINUS} ${fmt(a * a, 0)}`)} durch Ausklammern und Anwendung der 3. binomischen Formel und berechne T(${fmt(xVal, 0)}).`,
      `Ein Bruchterm lautet T(x) = ${frac(`${fmt(k, 0)}x + ${fmt(k * a, 0)}`, `x² ${MINUS} ${fmt(a * a, 0)}`)}. Bestimme die Definitionslücken, vereinfache T(x) vollständig und berechne den Wert für x = ${fmt(xVal, 0)}.`,
      [
        choiceField(
          "Vollständig gekürzter Term",
          [
            `${fmt(k, 0)} / (x ${MINUS} ${fmt(a, 0)})`,
            `${fmt(k, 0)} / (x + ${fmt(a, 0)})`,
            `${fmt(k, 0)}x / (x ${MINUS} ${fmt(a, 0)})`,
          ],
          0,
        ),
        numberField(`T(${fmt(xVal, 0)}) =`, ans, "", 2, {
          slips: [{ value: k / (xVal + a), hint: `Im Nenner bleibt (x ${MINUS} ${fmt(a, 0)}) stehen, da (x + ${fmt(a, 0)}) gekürzt wurde.` }],
        }),
      ],
      `Zähler = ${fmt(k, 0)}·(x + ${fmt(a, 0)}), Nenner = (x ${MINUS} ${fmt(a, 0)})(x + ${fmt(a, 0)}).`,
      `Kürzen mit (x + ${fmt(a, 0)}) ergibt T(x) = ${fmt(k, 0)} / (x ${MINUS} ${fmt(a, 0)}) für D = ℚ \\ {${MINUS}${fmt(a, 0)}; ${fmt(a, 0)}}.`,
      `T(${fmt(xVal, 0)}) = ${fmt(k, 0)} / (${fmt(xVal, 0)} ${MINUS} ${fmt(a, 0)}) = <strong>${fmt(ans, 2)}</strong>.`,
      { k, a, xVal, ans },
    );
  },
};

const exExpandCheck: ExerciseGenerator = {
  id: "bt-erweitern-pruefen",
  make(rng, level) {
    const k = rng.int(2, 5);
    const a = rng.pick([-3, -2, 2, 3]);
    const b = rng.pick([2, 3, 4]);
    const aTerm = a > 0 ? `x + ${fmt(a, 0)}` : `x ${MINUS} ${fmt(-a, 0)}`;
    const xVal = Math.abs(a) + 2;
    const expandedVal = (k * xVal + k * b) / (xVal + a);
    const expandedNumCoeff = k;
    const expandedNumConst = k * b;

    return task(
      level,
      `Erweitere den Bruchterm ${frac(fmt(k, 0), aTerm)} mit dem Faktor (x + ${fmt(b, 0)}). Welcher Term steht danach im Zähler?`,
      `Um ${frac(fmt(k, 0), aTerm)} auf den Hauptnenner (${aTerm})(x + ${fmt(b, 0)}) zu erweitern, multiplizierst du Zähler und Nenner mit (x + ${fmt(b, 0)}). Gib den neuen Zählerterm an und berechne den Termwert bei x = ${fmt(xVal, 0)}.`,
      [
        choiceField(
          "Neuer Zählerterm",
          [
            `${fmt(expandedNumCoeff, 0)}x + ${fmt(expandedNumConst, 0)}`,
            `${fmt(expandedNumCoeff, 0)}x + ${fmt(b, 0)}`,
            `${fmt(k, 0)} + x + ${fmt(b, 0)}`,
          ],
          0,
        ),
        ...(level === 2 ? [numberField(`Wert bei x = ${fmt(xVal, 0)}`, expandedVal, "", 2)] : []),
      ],
      `Zähler und Nenner mit derselben Klammer (x + ${fmt(b, 0)}) multiplizieren: ${fmt(k, 0)} · (x + ${fmt(b, 0)}).`,
      `Ausmultiplizieren des Zählers: ${fmt(k, 0)} · x + ${fmt(k, 0)} · ${fmt(b, 0)}.`,
      `Der neue Zähler lautet <strong>${fmt(expandedNumCoeff, 0)}x + ${fmt(expandedNumConst, 0)}</strong>.`,
      { k, a, b, xVal },
    );
  },
};

const exCommonDenomAdd: ExerciseGenerator = {
  id: "bt-hauptnenner-add",
  make(rng, level) {
    const c1 = rng.int(2, 5);
    const c2 = rng.int(1, 4);
    const a = rng.pick([1, 2, 3]);
    const xVal = a + rng.pick([2, 3]);
    const val = c1 / (xVal - a) + c2 / (xVal + a);
    const numX = c1 + c2;
    const numConst = (c1 - c2) * a;

    return task(
      level,
      `Fasse ${frac(fmt(c1, 0), `x ${MINUS} ${fmt(a, 0)}`)} + ${frac(fmt(c2, 0), `x + ${fmt(a, 0)}`)} auf dem Hauptnenner (x ${MINUS} ${fmt(a, 0)})(x + ${fmt(a, 0)}) zusammen und berechne den Wert bei x = ${fmt(xVal, 0)}.`,
      `Addiere die beiden Bruchterme ${frac(fmt(c1, 0), `x ${MINUS} ${fmt(a, 0)}`)} + ${frac(fmt(c2, 0), `x + ${fmt(a, 0)}`)} vollständig zu einem einzigen Bruchterm und werte ihn für x = ${fmt(xVal, 0)} aus.`,
      [
        choiceField(
          "Zusammengefasster Zähler",
          [
            linear(numX, numConst, 0),
            linear(numX, (c1 + c2) * a, 0),
            `${fmt(c1 + c2, 0)}`,
          ],
          0,
        ),
        numberField(`Wert bei x = ${fmt(xVal, 0)}`, val, "", 2),
      ],
      `Erweitere den 1. Bruch mit (x + ${fmt(a, 0)}), den 2. Bruch mit (x ${MINUS} ${fmt(a, 0)}).`,
      `Zähler = ${fmt(c1, 0)}(x + ${fmt(a, 0)}) + ${fmt(c2, 0)}(x ${MINUS} ${fmt(a, 0)}) = ${linear(numX, numConst, 0)}.`,
      `Ergebnis: (${linear(numX, numConst, 0)}) / (x² ${MINUS} ${fmt(a * a, 0)}), Wert bei x = ${fmt(xVal, 0)} ist <strong>${fmt(val, 2)}</strong>.`,
      { c1, c2, a, xVal, val },
    );
  },
};

const exSubSignTrap: ExerciseGenerator = {
  id: "bt-subtraktion-vorzeichen",
  make(rng, level) {
    const a = rng.int(3, 6);
    const b = rng.int(1, 4);
    const c = rng.int(2, 5);
    const d = level === 1 ? 1 : rng.int(2, 4);
    const k = rng.int(2, 4);
    // ((a*x + b) - (c*x - d)) / (x + k) = ((a-c)*x + (b+d)) / (x + k)
    const diffX = a - c;
    const sumConst = b + d;
    const xVal = 2;
    const val = (diffX * xVal + sumConst) / (xVal + k);

    return task(
      level,
      `Subtrahiere auf gleichem Nenner: ${frac(`${fmt(a, 0)}x + ${fmt(b, 0)}`, `x + ${fmt(k, 0)}`)} ${MINUS} ${frac(`${fmt(c, 0)}x ${MINUS} ${fmt(d, 0)}`, `x + ${fmt(k, 0)}`)}. Achte auf die Minusklammer im Zähler!`,
      `Vereinfache die Differenz ${frac(`${fmt(a, 0)}x + ${fmt(b, 0)}`, `x + ${fmt(k, 0)}`)} ${MINUS} ${frac(`${fmt(c, 0)}x ${MINUS} ${fmt(d, 0)}`, `x + ${fmt(k, 0)}`)} und berechne den Termwert bei x = ${fmt(xVal, 0)}.`,
      [
        choiceField(
          "Richtiger neuer Zähler",
          [
            linear(diffX, sumConst, 0),
            linear(diffX, b - d, 0),
            linear(a + c, b + d, 0),
          ],
          0,
        ),
        numberField(`Wert bei x = ${fmt(xVal, 0)}`, val, "", 2, {
          slips: [
            { value: (diffX * xVal + (b - d)) / (xVal + k), hint: `Das Minus vor dem Bruch dreht auch das Vorzeichen von ${MINUS}${fmt(d, 0)} um: ${MINUS}(${MINUS}${fmt(d, 0)}) = +${fmt(d, 0)}.` },
          ],
        }),
      ],
      `Schreibe den Zähler des zweiten Bruchs in Klammern: (${fmt(a, 0)}x + ${fmt(b, 0)}) ${MINUS} (${fmt(c, 0)}x ${MINUS} ${fmt(d, 0)}).`,
      `Auflösen der Minusklammer: ${fmt(a, 0)}x + ${fmt(b, 0)} ${MINUS} ${fmt(c, 0)}x + ${fmt(d, 0)} = ${linear(diffX, sumConst, 0)}.`,
      `Wert bei x = ${fmt(xVal, 0)}: <strong>${fmt(val, 2)}</strong>.`,
      { a, b, c, d, k, val },
    );
  },
};

const exMulFrac: ExerciseGenerator = {
  id: "bt-multiplizieren",
  make(rng, level) {
    const p = rng.pick([2, 3, 4, 6]);
    const a = rng.int(3, 5);
    const xVal = level === 1 ? 3 : rng.pick([4, 5]);
    const q = level === 1 ? rng.pick([2, 4, 5]) : rng.pick([2, 3]);
    const ans = (p * xVal) / q;

    return task(
      level,
      `Multipliziere und kürze vollständig: ${frac(`${fmt(p, 0)}x`, `x + ${fmt(a, 0)}`)} · ${frac(`x + ${fmt(a, 0)}`, fmt(q, 0))}. Berechne anschließend den Termwert für x = ${fmt(xVal, 0)}.`,
      `Ein Produkt zweier Bruchterme lautet ${frac(`${fmt(p, 0)}x`, `x + ${fmt(a, 0)}`)} · ${frac(`x + ${fmt(a, 0)}`, fmt(q, 0))}. Vereinfache den Term auf D = ℚ \\ {${MINUS}${fmt(a, 0)}} und werte bei x = ${fmt(xVal, 0)} aus.`,
      [
        numberField(`Wert bei x = ${fmt(xVal, 0)}`, ans, "", 2, {
          slips: [{ value: (p * q * xVal) / ((xVal + a) * (xVal + a)), hint: `Multipliziere Zähler mal Zähler und Nenner mal Nenner (nicht den Kehrwert nehmen).` }],
        }),
      ],
      `Kürze die gemeinsame Klammer (x + ${fmt(a, 0)}) über Kreuz.`,
      `Nach dem Kürzen bleibt ${frac(`${fmt(p, 0)}x`, fmt(q, 0))}.`,
      `Für x = ${fmt(xVal, 0)} ergibt sich (${fmt(p, 0)} · ${fmt(xVal, 0)}) / ${fmt(q, 0)} = <strong>${fmt(ans, 2)}</strong>.`,
      { p, q, a, xVal, ans },
    );
  },
};

const exDivReciprocal: ExerciseGenerator = {
  id: "bt-dividieren-kehrbruch",
  make(rng, level) {
    const p = rng.pick([3, 4, 6, 8]);
    const q = rng.pick([2, 3, 4]);
    const k = rng.int(1, 3);
    const xVal = level === 1 ? 3 : rng.int(4, 6);
    const ans = (p * (xVal + k)) / q;

    return task(
      level,
      `Dividiere und kürze vollständig: ${frac(`${fmt(p, 0)}x`, fmt(q, 0))} : ${frac("x", `x + ${fmt(k, 0)}`)}. Berechne den Wert bei x = ${fmt(xVal, 0)}.`,
      `Berechne den Quotienten ${frac(`${fmt(p, 0)}x`, fmt(q, 0))} : ${frac("x", `x + ${fmt(k, 0)}`)} (für x ≠ 0, x ≠ ${MINUS}${fmt(k, 0)}) mithilfe des Kehrwerts und setze x = ${fmt(xVal, 0)} ein.`,
      [
        numberField(`Wert bei x = ${fmt(xVal, 0)}`, ans, "", 2, {
          slips: [{ value: (p * xVal * xVal) / (q * (xVal + k)), hint: `Bei der Division mit dem Kehrwert des zweiten Bruchs malnehmen: · (x + ${fmt(k, 0)}) / x.` }],
        }),
      ],
      `„Durch einen Bruch dividieren = mit seinem Kehrwert multiplizieren“: dann kürzt sich x weg!`,
      `(${fmt(p, 0)}x / ${fmt(q, 0)}) · ((x + ${fmt(k, 0)}) / x) = ${fmt(p, 0)}·(x + ${fmt(k, 0)}) / ${fmt(q, 0)}.`,
      `Für x = ${fmt(xVal, 0)}: ${fmt(p, 0)} · ${fmt(xVal + k, 0)} / ${fmt(q, 0)} = <strong>${fmt(ans, 2)}</strong>.`,
      { p, q, k, xVal, ans },
    );
  },
};

const exNegExponent: ExerciseGenerator = {
  id: "bt-neg-exponent",
  make(rng, level) {
    const base = rng.pick([2, 3, 4, 5, 10]);
    const e = level === 1 ? rng.pick([-1, -2]) : rng.pick([-2, -3]);
    const ans = intPower(base, e);
    const denom = base ** -e;

    return task(
      level,
      `Berechne die Potenz mit negativem Exponenten: ${fmt(base, 0)}^(${fmt(e, 0)}).`,
      `In der Wissenschaft schreibt man kleine Größen mit negativen Exponenten: Berechne ${fmt(base, 0)}^(${fmt(e, 0)}) als Bruch oder Dezimalzahl.`,
      [
        numberField(`${fmt(base, 0)}^(${fmt(e, 0)}) =`, ans, "", 4, {
          slips: [
            { value: -(base ** -e), hint: `Ein negatives Vorzeichen im Exponenten bildet den Kehrwert 1 / a^k, macht die Zahl aber nicht negativ!` },
            { value: base * e, hint: `Eine Potenz multipliziert die Basis mit sich selbst, nicht mit dem Exponenten.` },
          ],
        }),
      ],
      `Kehrwertregel: a^(−k) = 1 / a^k.`,
      `${fmt(base, 0)}^(${fmt(e, 0)}) = 1 / ${fmt(base, 0)}^${fmt(-e, 0)} = 1 / ${fmt(denom, 0)}.`,
      `Als Dezimalzahl: <strong>${fmt(ans, 4)}</strong> (oder 1/${fmt(denom, 0)}).`,
      { base, e, denom, ans },
    );
  },
};

const exIntPowerLaw: ExerciseGenerator = {
  id: "bt-potenzgesetz-z",
  make(rng, level) {
    const base = rng.pick([2, 3, 5]);
    const m = rng.int(2, 5);
    const n = level === 1 ? rng.int(-4, -1) : rng.int(-6, -2);
    const sum = m + n;
    const ans = intPower(base, sum);

    return task(
      level,
      `Fasse zuerst zu einer einzigen Potenz zusammen und berechne dann den Zahlenwert: ${fmt(base, 0)}^${fmt(m, 0)} · ${fmt(base, 0)}^(${fmt(n, 0)}).`,
      `Wende die Potenzgesetze für ganzzahlige Exponenten auf ${fmt(base, 0)}^${fmt(m, 0)} · ${fmt(base, 0)}^(${fmt(n, 0)}) an und gib den zusammengefassten Exponenten sowie den Zahlenwert an.`,
      [
        intField("Neuer Exponent", sum, [
          { value: m - n, hint: `Beim Multiplizieren mit gleicher Basis werden die Exponenten addiert: ${fmt(m, 0)} + (${fmt(n, 0)}).` },
        ]),
        numberField("Zahlenwert =", ans, "", 4),
      ],
      `Gleiche Basis beim Malnehmen: Exponenten addieren: a^m · a^n = a^(m+n).`,
      `Exponent: ${fmt(m, 0)} + (${fmt(n, 0)}) = ${fmt(sum, 0)}.`,
      `${fmt(base, 0)}^(${fmt(sum, 0)}) = <strong>${fmt(ans, 4)}</strong>.`,
      { base, m, n, sum, ans },
    );
  },
};

const exFracEqSolve: ExerciseGenerator = {
  id: "bt-bruchgl-loesen",
  make(rng, level) {
    const k = rng.pick([2, 3]);
    const x = level === 1 ? rng.int(2, 6) : rng.pick([-3, -2, 3, 4, 5]);
    const bVal = 1;
    const stepD = x + bVal;
    const den1 = rng.pick([2, 3, 4]);
    const den2 = den1 * k;
    const b1 = den1 - x;
    const b2 = den2 - x;
    const num1 = rng.pick([3, 4, 5]);
    const num2 = num1 * k;
    const fmtD = (b0: number) => (b0 === 0 ? "x" : b0 > 0 ? `x + ${fmt(b0, 0)}` : `x ${MINUS} ${fmt(-b0, 0)}`);

    return task(
      level,
      `Löse die Bruchgleichung ${frac(fmt(num1, 0), fmtD(b1))} = ${frac(fmt(num2, 0), fmtD(b2))} nach x auf (Definitionslücken beachten!).`,
      `Bestimme zuerst die Definitionsmenge D der Bruchgleichung ${frac(fmt(num1, 0), fmtD(b1))} = ${frac(fmt(num2, 0), fmtD(b2))} und berechne dann ihre Lösung x.`,
      [
        intField("x =", x, [
          { value: -x, hint: `Prüfe die Vorzeichen nach dem Ausmultiplizieren über Kreuz.` },
        ]),
      ],
      `Mit dem Hauptnenner (${fmtD(b1)})(${fmtD(b2)}) multiplizieren: ${fmt(num1, 0)}·(${fmtD(b2)}) = ${fmt(num2, 0)}·(${fmtD(b1)}).`,
      `Gleichung auflösen: ${fmt(num1, 0)}x${signed(num1 * b2, 0)} = ${fmt(num2, 0)}x${signed(num2 * b1, 0)} ⇒ ${fmt(num2 - num1, 0)}x = ${fmt(num1 * b2 - num2 * b1, 0)}.`,
      `Ergebnis: x = <strong>${fmt(x, 0)}</strong> (Einsetzprobe: beide Seiten ergeben ${fmt(num1, 0)}/${fmt(den1, 0)}, und x ∈ D).`,
      { num1, b1, num2, b2, x, stepD },
    );
  },
};

const exExtraneousRoot: ExerciseGenerator = {
  id: "bt-scheinloesung",
  make(rng, level) {
    const gap = rng.pick([2, 3, 4, -2]);
    const b = -gap;
    const a = rng.int(2, 5);
    const c = a + rng.int(1, 4);
    const dStr = b > 0 ? `x + ${fmt(b, 0)}` : `x ${MINUS} ${fmt(-b, 0)}`;
    const isExtraneous = level === 1 ? true : rng.int(0, 1) === 0;

    if (isExtraneous) {
      return task(
        level,
        `Prüfe die Bruchgleichung ${frac(fmt(a, 0), dStr)} = ${frac(fmt(c, 0), dStr)}. Welche Lösungsmenge ergibt sich?`,
        `Beim Auflösen der Bruchgleichung ${frac(`x + ${fmt(a, 0)}`, dStr)} = ${frac(`${fmt(gap + a, 0)}`, dStr)} erhält man rechnerisch x = ${fmt(gap, 0)}. Warum zählt dieser Wert NICHT zur Lösungsmenge?`,
        [
          choiceField(
            "Lösungsmenge",
            [
              `L = ∅ (x = ${fmt(gap, 0)} ist Definitionslücke / Scheinlösung)`,
              `L = {${fmt(gap, 0)}}`,
              `L = D`,
            ],
            0,
          ),
        ],
        `Prüfe stets, ob das gefundene x zur Definitionsmenge D = ℚ \\ {${fmt(gap, 0)}} gehört.`,
        `Bei x = ${fmt(gap, 0)} wird der Nenner (${dStr}) gleich Null.`,
        `Die Zahl ${fmt(gap, 0)} ist ausgeschlossen (Scheinlösung) → <strong>L = ∅</strong>.`,
        { gap, a, c },
      );
    }

    const ans = gap + 2;
    return task(
      level,
      "",
      `Bei ${frac("2", dStr)} = ${frac("4", `${b + 2 >= 0 ? `x + ${fmt(b + 2, 0)}` : `x ${MINUS} ${fmt(-(b + 2), 0)}`}`)} erhält man rechnerisch x = ${fmt(ans, 0)}. Gehört diese Zahl zur Definitionsmenge D?`,
      [
        choiceField(
          "Ist x = " + fmt(ans, 0) + " eine gültige Lösung?",
          [
            `Ja, weder (${dStr}) noch der rechte Nenner werden 0 → L = {${fmt(ans, 0)}}`,
            `Nein, x = ${fmt(ans, 0)} ist eine Scheinlösung`,
            `Es gibt unendlich viele Lösungen`,
          ],
          0,
        ),
      ],
      "",
      `Einsetzen von x = ${fmt(ans, 0)}: linker Nenner = 2 ≠ 0, rechter Nenner = 4 ≠ 0.`,
      `<strong>Ja</strong>, x = ${fmt(ans, 0)} liegt in D und erfüllt die Gleichung.`,
      { gap, ans },
    );
  },
};

const exFracGraphCut: ExerciseGenerator = {
  id: "bt-graph-schnitt",
  make(rng, level) {
    // 6/(x + b) = c has solution x = 6/c - b; OR a/(x - s) = x - s with a = k^2 -> x - s = +-k
    const k = rng.pick([2, 3]);
    const a = k * k;
    const s = level === 1 ? 0 : rng.pick([1, 2, -1]);
    const x1 = s - k;
    const x2 = s + k;
    const sStr = s === 0 ? "x" : s > 0 ? `x ${MINUS} ${fmt(s, 0)}` : `x + ${fmt(-s, 0)}`;

    return task(
      level,
      `Die Bruchgleichung ${frac(fmt(a, 0), sStr)} = ${sStr} wird graphisch als Schnitt der Hyperbel f(x) = ${frac(fmt(a, 0), sStr)} mit der Geraden g(x) = ${sStr} gedeutet. Bestimme beide Schnittstellen x₁ und x₂.`,
      `Bestimme die beiden x-Koordinaten der Schnittpunkte von Hyperbel f(x) = ${frac(fmt(a, 0), sStr)} und Gerade g(x) = ${sStr}, indem du beide Funktionsterme gleichsetzt.`,
      [
        intField("x₁ =", x1),
        intField("x₂ =", x2),
      ],
      `Mit (${sStr}) multiplizieren ergibt (${sStr})² = ${fmt(a, 0)}, also ${sStr} = +${fmt(k, 0)} oder ${MINUS}${fmt(k, 0)}.`,
      `1. Fall: ${sStr} = ${fmt(k, 0)} ⇒ x = ${fmt(x2, 0)}. 2. Fall: ${sStr} = ${MINUS}${fmt(k, 0)} ⇒ x = ${fmt(x1, 0)}.`,
      `Die Schnittstellen sind <strong>${fmt(x1, 0)}</strong> und <strong>${fmt(x2, 0)}</strong> (in beliebiger Reihenfolge).`,
      { k, a, s, x1, x2 },
      { anyOrder: [0, 1] },
    );
  },
};

const exEqFromGraphs: ExerciseGenerator = {
  id: "bt-gleichung-zu-graph",
  make(rng, level) {
    const a = rng.pick([3, 4, 6]);
    const b = rng.pick([-2, -1, 1, 2]);
    const m = level === 1 ? 1 : 2;
    const t = rng.int(-2, 3);
    const bText = b > 0 ? `x + ${fmt(b, 0)}` : `x ${MINUS} ${fmt(-b, 0)}`;
    const right = `${frac(fmt(a, 0), bText)} = ${linear(m, t, 0)}`;

    return task(
      level,
      `Du suchst die Schnittpunkte der Hyperbel f(x) = ${frac(fmt(a, 0), bText)} und der Geraden g(x) = ${linear(m, t, 0)}. Welche Bruchgleichung gehört dazu?`,
      `Im Funktionsplotter siehst du f(x) = ${frac(fmt(a, 0), bText)} und g(x) = ${linear(m, t, 0)}. Stelle die Bruchgleichung auf, die die x-Koordinaten der Schnittpunkte liefert.`,
      [
        choiceField(
          "Zugehörige Bruchgleichung",
          [
            right,
            `${frac(fmt(a, 0), bText)} + ${linear(m, t, 0)} = 0`,
            `${fmt(a, 0)} · (${bText}) = ${linear(m, t, 0)}`,
          ],
          0,
        ),
      ],
      `Ein Schnittpunkt erfüllt f(x) = g(x).`,
      `Man setzt den Funktionsterm der Hyperbel gleich dem Funktionsterm der Geraden.`,
      `Gesuchte Bruchgleichung: <strong>${right}</strong>.`,
      { a, b, m, t },
    );
  },
};

const exPhysicsFormula: ExerciseGenerator = {
  id: "bt-formel-physik",
  make(rng, level) {
    const scenario = level === 1 ? 0 : rng.int(0, 1);
    if (scenario === 0) {
      const U = rng.pick([12, 18, 24, 36]);
      const R = rng.pick([3, 4, 6]);
      const I = U / R;
      return task(
        level,
        `Löse das Ohmsche Gesetz R = ${frac("U", "I")} nach der Stromstärke I auf und berechne I für U = ${fmt(U, 0)} V und R = ${fmt(R, 0)} Ω.`,
        `In einem Stromkreis beträgt die Spannung U = ${fmt(U, 0)} V und der Widerstand R = ${fmt(R, 0)} Ω. Stelle R = ${frac("U", "I")} nach I um und berechne die Stromstärke.`,
        [
          choiceField("Umgeformte Formel", ["I = U / R", "I = R / U", "I = U · R"], 0),
          numberField("I =", I, "A", 1, {
            slips: [{ value: R / U, hint: `Erst mit I multiplizieren (R·I = U), dann durch R teilen: I = U / R.` }],
          }),
        ],
        `Multipliziere beide Seiten mit dem Nenner I und teile durch R.`,
        `R · I = U ⇒ I = U / R.`,
        `Einsetzen: I = ${fmt(U, 0)} / ${fmt(R, 0)} = <strong>${fmt(I, 1)} A</strong>.`,
        { U, R, I },
      );
    }

    const s = rng.pick([120, 150, 180, 240]);
    const v = rng.pick([30, 40, 60]);
    const t = s / v;
    return task(
      level,
      "",
      `Aus der Bewegungslehre kennst du v = ${frac("s", "t")}. Löse die Formel nach der benötigten Zeit t auf und berechne t für s = ${fmt(s, 0)} km und v = ${fmt(v, 0)} km/h.`,
      [
        choiceField("Umgeformte Formel", ["t = s / v", "t = v / s", "t = v · s"], 0),
        numberField("t =", t, "h", 1),
      ],
      "",
      `Beide Seiten mit t multiplizieren (v · t = s), dann durch v teilen → t = s / v.`,
      `t = ${fmt(s, 0)} / ${fmt(v, 0)} = <strong>${fmt(t, 1)} h</strong>.`,
      { s, v, t },
    );
  },
};

const exFormulaWithFrac: ExerciseGenerator = {
  id: "bt-formel-bruch",
  make(rng, level) {
    // Lens/parallel resistor or triangle area A = g*h/2 -> h = 2A/g, or Trapezoid/density rho = m/V
    const g = rng.pick([4, 6, 8, 10]);
    const h = rng.pick([3, 4, 5, 6, 7]);
    const A = (g * h) / 2;
    const mode = level === 1 ? 0 : 1;

    if (mode === 0) {
      return task(
        level,
        `Löse die Dreiecksformel A = ${frac("g · h", "2")} nach der Höhe h auf und berechne h für A = ${fmt(A, 0)} cm² und g = ${fmt(g, 0)} cm.`,
        "",
        [
          choiceField("Formel nach h", ["h = 2A / g", "h = A / (2g)", "h = 2g / A"], 0),
          intField("h =", h, [
            { value: Math.round(A / g), hint: `Vergiss nicht, die Gleichung zuerst mit dem Nenner 2 zu multiplizieren: 2A = g · h.` },
          ], "cm"),
        ],
        `Zuerst beide Seiten mit 2 multiplizieren (2A = g · h), dann durch g teilen.`,
        `2A = g · h ⇒ h = 2A / g.`,
        `h = (2 · ${fmt(A, 0)}) / ${fmt(g, 0)} = <strong>${fmt(h, 0)} cm</strong>.`,
        { g, h, A },
      );
    }

    // Level 2: f = 1 / T or a = (v - v0) / t -> v = v0 + a*t
    const v0 = rng.int(4, 12);
    const aAcc = rng.int(2, 4);
    const t = rng.int(3, 6);
    const vEnd = v0 + aAcc * t;
    return task(
      level,
      "",
      `Für gleichmäßig beschleunigte Bewegung gilt a = ${frac("v − v₀", "t")}. Löse nach v auf und berechne die Endgeschwindigkeit v für v₀ = ${fmt(v0, 0)} m/s, a = ${fmt(aAcc, 0)} m/s² und t = ${fmt(t, 0)} s.`,
      [
        choiceField("Formel nach v", ["v = v₀ + a · t", "v = a · t − v₀", "v = (a / t) + v₀"], 0),
        intField("v =", vEnd, [
          { value: aAcc * t - v0, hint: `Beim Auflösen von a·t = v ${MINUS} v₀ addierst du v₀ auf beiden Seiten.` },
        ], "m/s"),
      ],
      "",
      `Erst mit t multiplizieren: a · t = v ${MINUS} v₀, dann + v₀ rechnen: v = v₀ + a · t.`,
      `v = ${fmt(v0, 0)} + ${fmt(aAcc, 0)} · ${fmt(t, 0)} = <strong>${fmt(vEnd, 0)} m/s</strong>.`,
      { v0, aAcc, t, vEnd },
    );
  },
};

export const STAGE_4_LESSONS = makeLessons([
  {
    id: "bt-1-erweitern-kuerzen",
    section: "4",
    title: "Bruchterme erweitern und kürzen",
    subtitle: "Faktorisieren mit Distributivgesetz und binomischen Formeln",
    whyItMatters: "Nur wer erst ausklammert und faktorisiert, sieht gemeinsame Faktoren und vereinfacht komplizierte Formeln sicher.",
    explanationHtml: `<p>Ein <strong>Bruchterm</strong> enthält mindestens eine Variable im Nenner. Genau wie bei Zahlenbrüchen aus Klasse 6 darf man Zähler und Nenner mit demselben Term (≠ 0) <strong>erweitern</strong> oder durch einen gemeinsamen Faktor <strong>kürzen</strong>.</p>
<p><strong>Goldene Regel:</strong> Aus Summen und Differenzen darf man niemals einzelne Glieder kürzen! Du musst Zähler und Nenner zuerst durch <strong>Ausklammern</strong> oder die <strong>binomischen Formeln</strong> in Produkte zerlegen.</p>
${CONCEPT_DIAGRAMS.bt1}
<div class="example"><strong>Beispiel:</strong> ${frac("2x + 4", "x² − 4")}<br>1. Definitionsmenge vor dem Kürzen bestimmen: x² − 4 = 0 ⇒ x = −2 oder x = 2 → D = ℚ \\ {−2; 2}.<br>2. Faktorisieren: Zähler = 2·(x + 2), Nenner = (x − 2)(x + 2).<br>3. Gemeinsamen Faktor (x + 2) kürzen → ${frac("2", "x − 2")}.</div>
<div class="merke"><strong>Merke:</strong> Bestimme die Definitionsmenge immer am ungekürzten Ausgangsterm! Nur gemeinsame <em>Faktoren</em> lassen sich kürzen.</div>`,
    formulas: [
      { name: "Kürzen nach Faktorisierung", html: `${frac("A · C", "B · C")} = ${frac("A", "B")}`, quantities: "für B ≠ 0 und C ≠ 0; C muss gemeinsamer Faktor sein" },
    ],
    quiz: Q(
      "Warum darf man bei (x + 3) / (x + 5) das x NICHT kürzen?",
      "Weil x in Zähler und Nenner ein Summand und kein gemeinsamer Faktor ist.",
      "Weil x niemals gleich 0 sein darf.",
      "Weil man Variablen grundsätzlich nie kürzen darf.",
      "Nur gemeinsame Faktoren eines Produkts dürfen gekürzt werden, niemals einzelne Summanden aus einer Summe.",
    ),
    lab: labRationalSimplify,
    exercises: [exSimplifyFactor, exExpandCheck],
    celebrationMessage: "Du faktorisierst und kürzt Bruchterme fehlerfrei.",
  },
  {
    id: "bt-2-add-sub",
    section: "4",
    title: "Bruchterme addieren und subtrahieren",
    subtitle: "Hauptnenner finden, erweitern und Minusklammern beachten",
    whyItMatters: "Parallele Widerstände in der Physik oder kombinierte Arbeitsraten werden genau durch Addieren von Bruchtermen berechnet.",
    explanationHtml: `<p>Wie bei normalen Brüchen gilt auch für Bruchterme: Addieren und Subtrahieren funktioniert nur bei <strong>gleichem Nenner</strong>.</p>
<ol class="steps"><li>Alle Nenner faktorisieren und den kleinsten gemeinsamen <strong>Hauptnenner</strong> bilden.</li><li>Jeden Bruchterm auf den Hauptnenner erweitern.</li><li>Zähler unter Beachtung von Vorzeichen (Minusklammer!) zusammenfassen, gemeinsamen Nenner beibehalten.</li></ol>
${CONCEPT_DIAGRAMS.bt2}
<div class="example"><strong>Beispiel:</strong> ${frac("3", "x − 1")} + ${frac("2", "x + 1")}.<br>Hauptnenner: (x − 1)(x + 1) für D = ℚ \\ {−1; 1}.<br>Erweitern: ${frac("3(x + 1) + 2(x − 1)", "(x − 1)(x + 1)")} = ${frac("3x + 3 + 2x − 2", "x² − 1")} = ${frac("5x + 1", "x² − 1")}.</div>
<div class="merke"><strong>Merke:</strong> Bei einer Subtraktion wie − (2x − 1)/(x + 1) steht der gesamte zweite Zähler gedanklich in einer Minusklammer!</div>`,
    formulas: [
      { name: "Gleichnamig machen", html: `${frac("A", "B")} ± ${frac("C", "D")} = ${frac("A·D ± C·B", "B · D")}`, quantities: "bei gemeinsamen Faktoren genügt ein kleinerer Hauptnenner" },
    ],
    quiz: Q(
      "Welcher Hauptnenner eignet sich für 1/(x² − 9) + 2/(x + 3)?",
      "(x − 3)(x + 3)",
      "(x² − 9)(x + 3)",
      "x + 3",
      "Da x² − 9 = (x − 3)(x + 3) ist, enthält x² − 9 den Faktor (x + 3) bereits.",
    ),
    lab: labRationalAddSub,
    exercises: [exCommonDenomAdd, exSubSignTrap],
    celebrationMessage: "Du bringst Bruchterme souverän auf den Hauptnenner.",
  },
  {
    id: "bt-3-mul-div",
    section: "4",
    title: "Bruchterme multiplizieren und dividieren",
    subtitle: "Über Kreuz kürzen und die Kehrwertregel anwenden",
    whyItMatters: "Bei Geschwindigkeits- oder Dichte-Umrechnungen kürzen sich Produkte und Kehrwerte elegant zusammen.",
    explanationHtml: `<p>Beim <strong>Multiplizieren</strong> von Bruchtermen gilt wie bei Zahlbrüchen: Zähler mal Zähler, Nenner mal Nenner — zuvor lohnt sich immer das <strong>Kürzen über Kreuz</strong> (nach Faktorisierung).</p>
<p>Beim <strong>Dividieren</strong> multiplizierst du den ersten Bruchterm mit dem <strong>Kehrwert</strong> des zweiten Bruchterms (Divisors). Beachte für die Definitionsmenge: Auch der Zähler des Divisors darf nicht Null werden!</p>
${CONCEPT_DIAGRAMS.bt3}
<div class="example"><strong>Beispiel:</strong> ${frac("4x", "x + 2")} : ${frac("2x", "x² − 4")}<br>= ${frac("4x", "x + 2")} · ${frac("(x − 2)(x + 2)", "2x")}<br>Über Kreuz 2x und (x + 2) kürzen → 2 · (x − 2) (für x ∉ {−2; 0; 2}).</div>
<div class="merke"><strong>Merke:</strong> Vor dem Multiplizieren oder Kehrwert-Kürzen erst faktorisieren; beim Teilen nie auf die Nullstellen des Divisors vergessen.</div>`,
    formulas: [
      { name: "Produkt", html: `${frac("A", "B")} · ${frac("C", "D")} = ${frac("A · C", "B · D")}`, quantities: "B ≠ 0, D ≠ 0" },
      { name: "Quotient (Kehrwert)", html: `${frac("A", "B")} : ${frac("C", "D")} = ${frac("A", "B")} · ${frac("D", "C")}`, quantities: "B ≠ 0, D ≠ 0 und zusätzlich C ≠ 0" },
    ],
    quiz: Q(
      "Wie vereinfacht man den Quotienten (x/3) : (x/9) für x ≠ 0?",
      "Zu 3",
      "Zu x²/27",
      "Zu 1/3",
      "Mit dem Kehrwert multiplizieren: (x/3) · (9/x) = 9/3 = 3.",
    ),
    lab: labRationalMulDiv,
    exercises: [exMulFrac, exDivReciprocal],
    celebrationMessage: "Du multiplizierst und dividierst Bruchterme mit Kehrwert und Kürzen.",
  },
  {
    id: "bt-4-potenzen-z",
    section: "4",
    title: "Potenzen mit ganzzahligen Exponenten",
    subtitle: "Die Bedeutung von a⁰ = 1 und a⁻ⁿ = 1/aⁿ samt Rechengesetzen",
    whyItMatters: "Von Nanometern (10⁻⁹ m) bis zu Bruchtermen: Negative Exponenten schreiben Kehrwerte kompakt als Potenzen.",
    explanationHtml: `<p>Erweitert man die in Klasse 7 gelernten Potenzgesetze auf die ganzen Zahlen ℤ (Permanenzprinzip: jeder Schritt im Exponenten um −1 teilt durch die Basis a ≠ 0), so erhält man:</p>
<ul><li><strong>a⁰ = 1</strong> (für a ≠ 0)</li><li><strong>a⁻ⁿ = 1 / aⁿ</strong> (für a ≠ 0, n ∈ ℕ)</li></ul>
<p>Alle bekannten Potenzgesetze gelten nun auch für beliebige ganze Exponenten m, n ∈ ℤ: aᵐ · aⁿ = aᵐ⁺ⁿ, aᵐ : aⁿ = aᵐ⁻ⁿ und (aᵐ)ⁿ = aᵐ·ⁿ.</p>
${CONCEPT_DIAGRAMS.bt4}
<div class="example"><strong>Beispiel:</strong> 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2 = 0,5, 2⁻² = 1/4 = 0,25, 2⁻³ = 1/8 = 0,125.<br>Rechnen: 3⁴ · 3⁻⁶ = 3⁴⁺⁽⁻⁶⁾ = 3⁻² = 1/9.</div>
<div class="merke"><strong>Merke:</strong> Ein negativer Exponent macht das Ergebnis <em>nicht</em> negativ, sondern bildet den Kehrwert!</div>`,
    formulas: [
      { name: "Negativer Exponent", html: `a<sup>−n</sup> = ${frac("1", "a<sup>n</sup>")}`, quantities: "a ≠ 0; a⁰ = 1" },
      { name: "Multiplikation / Division", html: "a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup> &nbsp;|&nbsp; a<sup>m</sup> : a<sup>n</sup> = a<sup>m−n</sup>", quantities: "gilt für alle m, n ∈ ℤ (bei a ≠ 0)" },
    ],
    quiz: Q(
      "Welchen Wert hat 5⁻²?",
      "1/25 (= 0,04)",
      "−25",
      "−10",
      "5⁻² = 1 / 5² = 1/25 = 0,04. Das Minus im Exponenten bedeutet Kehrwert, nicht Vorzeichenwechsel.",
    ),
    lab: labIntPowersLab,
    exercises: [exNegExponent, exIntPowerLaw],
    celebrationMessage: "Du wendest Potenzgesetze sicher auf ganzzahlige Exponenten an.",
  },
  {
    id: "bt-5-bruchgleichungen",
    section: "4",
    title: "Bruchgleichungen rechnerisch lösen",
    subtitle: "Definitionsmenge, Hauptnenner-Multiplikation und Probe gegen Scheinlösungen",
    whyItMatters: "Wer beim Bruchgleichung-Lösen die Definitionsmenge vergisst, akzeptiert womöglich eine Scheinlösung, die durch 0 teilt.",
    explanationHtml: `<p>Bei einer <strong>Bruchgleichung</strong> steht die Unbekannte x in mindestens einem Nenner. So löst du sie zuverlässig:</p>
<ol class="steps"><li><strong>Definitionsmenge D</strong> festlegen (alle Nullstellen aller Nenner ausschließen).</li><li>Beide Seiten mit dem <strong>Hauptnenner</strong> multiplizieren, sodass alle Nenner wegfallen.</li><li>Entstehende Gleichung lösen.</li><li><strong>Prüfen:</strong> Liegt die gefundene Zahl in D? Wenn nein, ist sie eine <em>Scheinlösung</em> und entfällt!</li></ol>
${CONCEPT_DIAGRAMS.bt5}
<div class="example"><strong>Beispiel:</strong> ${frac("6", "x − 1")} = ${frac("4", "x + 1")}, D = ℚ \\ {−1; 1}.<br>Überkreuz multiplizieren: 6(x + 1) = 4(x − 1) ⇒ 6x + 6 = 4x − 4 ⇒ 2x = −10 ⇒ x = −5.<br>Da −5 ∈ D und Probe 6/(−6) = 4/(−4) = −1 stimmt, gilt L = {−5}.</div>
<div class="merke"><strong>Merke:</strong> Die Multiplikation mit einem x-haltigen Hauptnenner ist nur für x ∈ D eine Äquivalenzumformung — prüfe das Ergebnis immer gegen D!</div>`,
    formulas: [
      { name: "Verhältnisgleichung", html: `${frac("a", "b")} = ${frac("c", "d")} &nbsp;⇒&nbsp; a · d = c · b`, quantities: "gilt für b ≠ 0 und d ≠ 0 (Überkreuz-Regel)" },
    ],
    quiz: Q(
      "Bei der Bruchgleichung (x + 1)/(x − 2) = 3/(x − 2) liefert das Umformen x + 1 = 3, also x = 2. Was ist die Lösungsmenge L?",
      "L = ∅, da x = 2 den Nenner x − 2 zu 0 macht (Scheinlösung).",
      "L = {2}",
      "L = ℚ",
      "x = 2 gehört nicht zur Definitionsmenge D = ℚ \\ {2}; daher gibt es keine Lösung.",
    ),
    lab: labFracEqSolver,
    exercises: [exFracEqSolve, exExtraneousRoot],
    celebrationMessage: "Du löst Bruchgleichungen und entlarvst jede Scheinlösung.",
  },
  {
    id: "bt-6-schnittproblem",
    section: "4",
    title: "Bruchgleichungen als Schnittproblem deuten",
    subtitle: "Linke und rechte Seite als Funktionsgraphen verstehen",
    whyItMatters: "Jede Gleichung f(x) = g(x) lässt sich graphisch durch die Schnittpunkte von G_f und G_g lösen und überprüfen.",
    explanationHtml: `<p>Jede Gleichung <strong>Linksterm(x) = Rechtsterm(x)</strong> lässt sich als Frage nach den gemeinsamen Punkten zweier Funktionsgraphen deuten: f(x) = Linksterm(x) und g(x) = Rechtsterm(x).</p>
<p>Die x-Koordinaten der <strong>Schnittpunkte</strong> von G<sub>f</sub> und G<sub>g</sub> sind genau die Lösungen der Gleichung. Schneiden sich die Graphen nirgends, hat die Gleichung keine Lösung (L = ∅).</p>
${CONCEPT_DIAGRAMS.bt6}
<div class="example"><strong>Beispiel:</strong> ${frac("4", "x − 1")} = x − 1.<br>Linke Seite: Hyperbel f(x) = ${frac("4", "x − 1")}. Rechte Seite: Gerade g(x) = x − 1.<br>Schnittpunkte im Graphen: S₁(−1 | −2) und S₂(3 | 2) → L = {−1; 3}.</div>
<div class="merke"><strong>Merke:</strong> Graphisches Lösen verrät sofort die Anzahl der Lösungen und liefert gute Näherungs- und Kontrollwerte für die Rechnung.</div>`,
    formulas: [
      { name: "Schnittdeutung", html: "f(x) = g(x) &nbsp;⇔&nbsp; Schnittpunkte von G<sub>f</sub> und G<sub>g</sub>", quantities: "x-Koordinate des Schnittpunkts = Lösung" },
    ],
    quiz: Q(
      "Die Hyperbel f(x) = 3/x und die Gerade g(x) = −x schneiden sich nirgends. Was bedeutet das für 3/x = −x?",
      "Die Bruchgleichung hat keine Lösung (L = ∅).",
      "Die Gleichung hat unendlich viele Lösungen.",
      "Die Lösung ist x = 0.",
      "Ohne gemeinsamen Schnittpunkt zweier Graphen existiert kein x ∈ D mit f(x) = g(x).",
    ),
    lab: labFracEqGraph,
    exercises: [exFracGraphCut, exEqFromGraphs],
    celebrationMessage: "Du verbindest algebraische Bruchgleichungen mit Graphenschnitten.",
  },
  {
    id: "bt-7-formeln",
    section: "4",
    title: "Formeln nach einer Variablen auflösen",
    subtitle: "Naturwissenschaftliche Gleichungen gezielt umstellen",
    whyItMatters: "In Physik, Chemie und Technik ist selten genau die Größe isoliert, die gerade gesucht ist – Umstellen macht eine einzige Formel für alle Aufgaben nutzbar.",
    explanationHtml: `<p>Viele Gesetze aus den Naturwissenschaften (z. B. R = U/I, v = s/t, ρ = m/V, A = g·h/2) enthalten Brüche. Um nach einer gewünschten Variablen aufzulösen, nutzt du Schritt für Schritt Äquivalenzumformungen:</p>
<ol class="steps"><li>Steht die gesuchte Variable im <strong>Nenner</strong>, multipliziere zuerst beide Seiten mit diesem Nenner.</li><li>Bringe alle anderen Faktoren oder Summanden durch Gegenoperationen auf die andere Seite.</li></ol>
${CONCEPT_DIAGRAMS.bt7}
<div class="example"><strong>Beispiel Ohmsches Gesetz:</strong> R = ${frac("U", "I")}.<br>• Nach U auflösen (· I): U = R · I.<br>• Nach I auflösen (erst · I, dann : R): I = ${frac("U", "R")}.</div>
<div class="merke"><strong>Merke:</strong> Steht die gesuchte Größe im Nenner, hole sie immer zuerst durch Multiplikation in den Zähler — niemals durch bloßes Umdrehen eines Faktors!</div>`,
    formulas: [
      { name: "Ohmsches Gesetz", html: `R = ${frac("U", "I")} &nbsp;⇔&nbsp; U = R · I &nbsp;⇔&nbsp; I = ${frac("U", "R")}`, quantities: "U Spannung, I Stromstärke, R Widerstand" },
      { name: "Geschwindigkeit", html: `v = ${frac("s", "t")} &nbsp;⇔&nbsp; s = v · t &nbsp;⇔&nbsp; t = ${frac("s", "v")}`, quantities: "s Weg, t Zeit, v Geschwindigkeit" },
    ],
    quiz: Q(
      "Wie lautet die Gleichung ρ = m / V korrekt nach dem Volumen V aufgelöst?",
      "V = m / ρ",
      "V = ρ / m",
      "V = m · ρ",
      "Zuerst mit V multiplizieren liefert ρ · V = m, anschließend durch ρ teilen ergibt V = m / ρ.",
    ),
    lab: labFormulaRearranger,
    exercises: [exPhysicsFormula, exFormulaWithFrac],
    celebrationMessage: "Etappe 4 geschafft: Du rechnest sicher mit Bruchtermen, Potenzen und Formeln!",
  },
]);
