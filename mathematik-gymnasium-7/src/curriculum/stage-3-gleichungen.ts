import { choiceField, intField, numberField } from "./helpers";
import { countPhrase, Q, signed, task } from "./builders";
import { makeLessons } from "./make";
import {
  labBalanceScale,
  labChainPercent,
  labClaimAudit,
  labEqCases,
  labEquationModel,
  labEqVsTrial,
  labPercentEquation,
} from "./labs";
import { percentAfter, percentChainPercent, roundTo } from "./math";
import { fmt, fmtUnit, frac, MINUS, term } from "../exercises/format";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators 3.1 (Gleichungen aufstellen & Invarianzprinzip) ───────────────

const exInvarianceEq: ExerciseGenerator = {
  id: "gleichung-invarianz",
  make(rng, level) {
    if (level === 1) {
      const n = rng.int(8, 18);
      const diff = rng.int(4, 10);
      // Total stays invariant when swapping / splitting: x + (x + diff) = 2*n + diff
      const total = 2 * n + diff;
      return task(
        level,
        `Invarianzprinzip beim Aufteilen: Anna und Ben besitzen zusammen ${total} € (ihre Gesamtsumme bleibt beim Umverteilen gleich). Ben hat genau ${diff} € mehr als Anna (x €). Stelle gedanklich die Gleichung auf und berechne Annas Betrag x.`,
        "",
        [
          intField("Annas Betrag x", n, [
            {
              value: Math.floor(total / 2),
              hint: `Du darfst nicht einfach halbieren – Ben hat ${diff} € mehr als Anna: x + (x + ${diff}) = ${total}.`,
            },
          ], "€"),
        ],
        `Gleichung aufstellen: x + (x + ${diff}) = ${total}, also 2x + ${diff} = ${total}.`,
        `2x + ${diff} = ${total} liefert 2x = ${total - diff}.`,
        `x = <strong>${fmtUnit(n, "€", 0)}</strong> (Probe: ${n} + ${n + diff} = ${total} ✓).`,
        { n, diff, total },
      );
    }

    // Level 2: invariant age difference
    const childNow = rng.int(8, 14);
    const parentNow = rng.int(32, 46);
    // Want parent + x = 2 * (child + x) => x = parent - 2*child. Ensure positive x!
    const xYears = parentNow - 2 * childNow;
    const childAdj = xYears >= 2 ? childNow : 11;
    const parentAdj = xYears >= 2 ? parentNow : 36;
    const years = parentAdj - 2 * childAdj;
    const ageDiff = parentAdj - childAdj;
    return task(
      level,
      "",
      `Altersrätsel (Invarianz des Altersunterschieds): Eine Mutter ist heute ${parentAdj} Jahre alt, ihr Sohn ${childAdj} Jahre. Der Altersunterschied bleibt in jedem Jahr derselbe! In x Jahren wird die Mutter genau doppelt so alt sein wie ihr Sohn. Berechne x und wähle die passende Gleichung.`,
      [
        intField("Anzahl Jahre x", years, [
          {
            value: ageDiff,
            hint: `${ageDiff} Jahre ist der bleibende Altersunterschied – in x Jahren gilt ${parentAdj} + x = 2 · (${childAdj} + x)!`,
          },
        ], "Jahre"),
        choiceField(
          "Passende Gleichung",
          [
            `${parentAdj} + x = 2 · (${childAdj} + x)`,
            `${parentAdj} + x = 2 · ${childAdj} + x`,
            `${parentAdj} = 2 · (${childAdj} + x)`,
          ],
          0,
        ),
      ],
      "",
      `Beide altern pro Jahr um 1 Jahr: ${parentAdj} + x = 2 · (${childAdj} + x) = ${2 * childAdj} + 2x.`,
      `Umstellen: ${parentAdj} ${MINUS} ${2 * childAdj} = 2x ${MINUS} x → x = <strong>${countPhrase(years, "Jahr", "Jahre")}</strong>.`,
      { parentAdj, childAdj, years },
    );
  },
};

const exBalanceEqSetupClean: ExerciseGenerator = {
  id: "gleichung-aufstellen",
  make(rng, level) {
    const x = rng.int(4, 15);
    const b = rng.int(3, 11);

    if (level === 1) {
      const perimeter = 2 * (x + b);
      return task(
        level,
        `Ein rechteckiges Gehege hat den Umfang ${perimeter} cm und die feste Breite ${b} cm. Die Länge sei x cm, also gilt 2 · x + 2 · ${b} = ${perimeter}. Berechne die Länge x.`,
        "",
        [
          intField("Länge x", x, [
            { value: x + b, hint: `Vergiss nicht: Im Umfang kommt die Breite 2-mal vor (2 · ${b} = ${2 * b}).` },
          ], "cm"),
        ],
        `Gleichung lösen: 2x + ${2 * b} = ${perimeter} | − ${2 * b}, dann | : 2.`,
        `2x = ${perimeter} ${MINUS} ${2 * b} = ${2 * x}.`,
        `x = <strong>${fmtUnit(x, "cm", 0)}</strong> (Probe: 2 · ${x} + 2 · ${b} = ${perimeter} ✓).`,
        { x, b, perimeter },
      );
    }

    const c1 = rng.int(4, 7);
    const c2 = rng.int(1, 3); // strictly c1 > c2 so no zero difference!
    const rhsConst = c1 * x + b - c2 * x;
    return task(
      level,
      "",
      `Das ${c1}-Fache einer gesuchten Zahl x vermehrt um ${b} ergibt genau denselben Wert wie das ${c2}-Fache dieser Zahl vermehrt um ${fmt(rhsConst, 0)}. Bestimme die passende Gleichung und berechne x.`,
      [
        intField("Lösung x", x, [
          {
            value: -x,
            hint: `Prüfe die Vorzeichen beim Hinüberholen von ${c2}x und ${b}!`,
          },
        ]),
        choiceField(
          "Passende Gleichung",
          [
            `${c1}x + ${b} = ${c2 === 1 ? "x" : `${c2}x`}${signed(rhsConst, 0)}`,
            `${c1}(x + ${b}) = ${c2 === 1 ? "x" : `${c2}x`}${signed(rhsConst, 0)}`,
            `${c1}x ${MINUS} ${b} = ${c2 === 1 ? "x" : `${c2}x`}${signed(rhsConst, 0)}`,
          ],
          0,
        ),
      ],
      "",
      `${c1}x + ${b} = ${c2 === 1 ? "x" : `${c2}x`}${signed(rhsConst, 0)} → ${c1 - c2}x = ${fmt(rhsConst - b, 0)}.`,
      `Division durch ${c1 - c2} liefert x = <strong>${fmt(x, 0)}</strong>.`,
      { c1, c2, x, b, rhsConst },
    );
  },
};

// ─── Generators 3.2 (Äquivalenzumformungen & Lösungsmenge) ───────────────────

const exSolveLinearEq: ExerciseGenerator = {
  id: "aequivalenzumformung",
  make(rng, level) {
    if (level === 1) {
      const a = rng.int(2, 7);
      const x = rng.int(-6, 9);
      const b = rng.int(-10, 12);
      const safeB = b === 0 ? 4 : b;
      const c = a * x + safeB;

      return task(
        level,
        `Löse die lineare Gleichung durch gezielte Äquivalenzumformungen und mache gedanklich die Einsetzprobe: ${a}x${signed(safeB, 0)} = ${fmt(c, 0)}.`,
        "",
        [
          intField("Lösung x", x, [
            {
              value: x + 2 * Math.round(safeB / a),
              hint: safeB > 0
                ? `Um +${safeB} auf der linken Seite zu beseitigen, musst du beidseitig ${MINUS} ${safeB} rechnen.`
                : `Um ${MINUS} ${Math.abs(safeB)} auf der linken Seite zu beseitigen, addierst du +${Math.abs(safeB)}.`,
            },
            {
              value: c - safeB,
              hint: `Du hast den Faktor ${a} vor x noch nicht weggeteilt (| : ${a})!`,
            },
          ].filter((s) => s.value !== x)),
        ],
        `Erst Strichumformung (${safeB > 0 ? `${MINUS} ${safeB}` : `+ ${Math.abs(safeB)}`}), dann Punktuell teilen (| : ${a}).`,
        `${a}x${signed(safeB, 0)} = ${fmt(c, 0)} | ${safeB > 0 ? `${MINUS} ${safeB}` : `+ ${Math.abs(safeB)}`} → ${a}x = ${fmt(c - safeB, 0)}.`,
        `| : ${a} → x = <strong>${fmt(x, 0)}</strong>, also L = { ${fmt(x, 0)} } (Probe: ${a} · (${fmt(x, 0)})${signed(safeB, 0)} = ${fmt(c, 0)} ✓).`,
        { a, safeB, c, x },
      );
    }

    // Level 2: ax + b = cx + d with x on both sides (possible .5 solution!)
    const a = rng.int(4, 8);
    const c = rng.int(-3, 2); // a - c >= 2
    const xNumerator = rng.pick([-5, -3, -2, -1, 1, 2, 3, 5, 7]);
    const halfStep = (rng.sign() > 0) ? 1 : 2; // divide by 2 or whole
    const xVal = halfStep === 2 ? xNumerator / 2 : xNumerator;
    // Let (a - c) * xVal = d - b
    // To keep integers clean on both sides, require (a - c) even when halfStep === 2!
    const diff = a - c;
    const adjA = halfStep === 2 && diff % 2 !== 0 ? a + 1 : a;
    const b = rng.int(-8, 8) || 3;
    const d = Math.round((adjA - c) * xVal + b);
    const trueX = (d - b) / (adjA - c);
    const probeVal = roundTo(adjA * trueX + b, 4);

    return task(
      level,
      "",
      `Löse die lineare Gleichung formal über Äquivalenzumformungen und prüfe durch Einsetzen: ${adjA}x${signed(b, 0)} = ${c === 0 ? "" : c === 1 ? "x" : c === -1 ? `${MINUS}x` : `${fmt(c, 0)}x`}${c === 0 ? fmt(d, 0) : signed(d, 0)}. Gib die Lösung x und den gemeinsamen Termwert bei der Einsetzprobe an.`,
      [
        numberField("Lösung x", trueX, "", 2, {
          absTolerance: 0.01,
          slips: [
            {
              value: (d + b) / (adjA - c),
              hint: `Vorzeichenfehler beim Hinüberbringen von ${signed(b, 0)} auf die andere Seite!`,
            },
            {
              value: (d - b) / (adjA + c),
              hint: `Achte beim Sortieren der x-Glieder auf das Vorzeichen von ${fmt(c, 0)}x!`,
            },
          ].filter((s) => Math.abs(s.value - trueX) > 0.05),
        }),
        numberField("Probenwert (linke = rechte Seite)", probeVal, "", 2, { absTolerance: 0.01 }),
      ],
      "",
      `x-Glieder sammeln (${c < 0 ? `+ ${Math.abs(c)}x` : `${MINUS} ${c}x`}) und Konstante (${b > 0 ? `${MINUS} ${b}` : `+ ${Math.abs(b)}`}) isolieren: ${adjA - c}x = ${fmt(d - b, 0)}.`,
      `| : ${adjA - c} → x = <strong>${fmt(trueX, 2)}</strong> (L = { ${fmt(trueX, 2)} }). Probe auf beiden Seiten: jeweils <strong>${fmt(probeVal, 2)}</strong>.`,
      { adjA, c, b, d, trueX, probeVal },
    );
  },
};

const exFormalEquivStep: ExerciseGenerator = {
  id: "aequivalenz-begruenden",
  make(rng, level) {
    const k = rng.int(2, 6);
    const x = rng.int(2, 8);
    const rhs = k * x;

    return task(
      level,
      `Bei der Gleichung ${k}x = ${rhs} teilst du auf beiden Seiten durch ${k} (| : ${k}). Warum bleibt dabei die Lösungsmenge exakt gleich, und welche Zahl für eine Division auf beiden Seiten ist verboten?`,
      `Untersuche zwei Umformungen ausgehend von ${k}x = ${rhs}: (A) Beidseitiges Multiplizieren mit 0 ergibt 0 = 0. (B) Beidseitiges Teilen durch ${k} liefert x = ${x}. Welche Umformung ändert die Lösungsmenge (keine Äquivalenzumformung!) und wie groß ist die eindeutige Lösung x?`,
      [
        intField("Eindeutige Lösung x", x),
        choiceField(
          level === 1 ? "Begründung & erlaubte Operation" : "Bewertung von (A) und (B)",
          level === 1
            ? [
                `Division durch ${k} ist umkehrbar (| · ${k}); nur Division/Multiplikation mit 0 zerstört die Äquivalenz`,
                "Teilen durch 0 ist erlaubt und macht jede Gleichung kürzer",
                "Man darf links durch 2 teilen und rechts nicht",
              ]
            : [
                "(A) ist KEINE Äquivalenzumformung (Macht L = ℚ statt {" + x + "}); (B) bewahrt L exakt",
                "Beide Schritte (A) und (B) sind gleichwertige Äquivalenzumformungen",
                "(B) verdoppelt die Lösungsmenge auf zwei Zahlen",
              ],
          0,
        ),
      ],
      `Eine Äquivalenzumformung muss sich eindeutig wieder rückgängig machen lassen (beidseitig +/− term oder ·/÷ c mit c ≠ 0).`,
      `Multiplikation oder Division mit 0 lässt sich nicht eindeutig umkehren und ändert die Lösungsmenge!`,
      `Die Lösungsmenge lautet L = { <strong>${x}</strong> }; alle Umformungen mit c ≠ 0 bleiben eindeutig umkehrbar.`,
      { k, x, rhs },
    );
  },
};

// ─── Generators 3.3 (Klammergleichungen & systematisches Probieren) ──────────

const exBracketEq: ExerciseGenerator = {
  id: "klammergleichung",
  make(rng, level) {
    const a = rng.int(2, 5);
    const b = rng.int(1, 5);
    const x = rng.int(-3, 7);

    if (level === 1) {
      const rhs = a * (x + b);
      return task(
        level,
        `Löse die Klammergleichung durch Ausmultiplizieren und anschließendes Umformen: ${a} · (x + ${b}) = ${fmt(rhs, 0)}.`,
        "",
        [
          intField("Lösung x", x, [
            {
              value: Math.round((rhs - b) / a),
              hint: `Du hast den Faktor ${a} vergessen mit +${b} in der Klammer zu multiplizieren (${a} · ${b} = ${a * b})!`,
            },
          ].filter((s) => s.value !== x)),
        ],
        `Zuerst beide Seiten vereinfachen: ${a} · (x + ${b}) = ${a}x + ${a * b}.`,
        `${a}x + ${a * b} = ${fmt(rhs, 0)} | ${MINUS} ${a * b} → ${a}x = ${fmt(rhs - a * b, 0)}.`,
        `| : ${a} → x = <strong>${fmt(x, 0)}</strong> (Probe: ${a} · (${fmt(x, 0)} + ${b}) = ${fmt(rhs, 0)} ✓).`,
        { a, b, rhs, x },
      );
    }

    const c = rng.int(2, 4);
    const d = rng.int(1, 4);
    const leftVal = a * (x - b) - c;
    // Pick right side: d * x + rhsConst = leftVal => ensure a !== d!
    const dSafe = d === a ? d + 1 : d;
    const rhsConst = leftVal - dSafe * x;
    return task(
      level,
      "",
      `Vereinfache zuerst beide Seiten und löse dann durch Äquivalenzumformungen: ${a} · (x ${MINUS} ${b}) ${MINUS} ${c} = ${dSafe === 1 ? "x" : `${dSafe}x`}${signed(rhsConst, 0)}.`,
      [
        intField("Lösung x", x, [
          {
            value: Math.round((rhsConst + c - b) / (a - dSafe)),
            hint: `Multipliziere ${a} sowohl mit x als auch mit ${MINUS}${b}: ${a}x ${MINUS} ${a * b}.`,
          },
        ].filter((s) => s.value !== x)),
      ],
      "",
      `Linke Seite ausmultiplizieren & zusammenfassen: ${a}x ${MINUS} ${a * b} ${MINUS} ${c} = ${a}x ${MINUS} ${a * b + c}.`,
      `${a}x ${MINUS} ${a * b + c} = ${dSafe === 1 ? "x" : `${dSafe}x`}${signed(rhsConst, 0)} → ${term(a - dSafe, "x", true)} = ${fmt(rhsConst + a * b + c, 0)} → x = <strong>${fmt(x, 0)}</strong>.`,
      { a, b, c, dSafe, rhsConst, x },
    );
  },
};

const exCompareTrialVsEq: ExerciseGenerator = {
  id: "verfahren-vergleich",
  make(rng, level) {
    const a = rng.int(2, 5);
    const num = rng.pick([1, 3, 5]);
    const xExact = num / 2; // decimal .5 -> difficult to stumble onto quickly by integer trial!
    const b = rng.int(1, 6);
    const rhs = a * xExact + b;

    return task(
      level,
      `Bei ${a}x + ${b} = ${fmt(rhs, 1)} testet Leo ganze Zahlen: x = 1 ergibt ${a + b}, x = 2 ergibt ${2 * a + b}. Zwischen welchen zwei ganzen Zahlen liegt x, oder berechne direkt mit Äquivalenzumformungen den genauen Wert von x.`,
      `Vergleiche systematisches Probieren mit Äquivalenzumformungen an ${a}x + ${b} = ${fmt(rhs, 1)}: Berechne exakt x (als Dezimalzahl) und begründe, warum Äquivalenzumformungen dem reinen Probieren hier überlegen sind.`,
      [
        numberField("Exakte Lösung x", xExact, "", 1, {
          absTolerance: 0.05,
          slips: [
            { value: Math.floor(xExact), hint: `Bei einer Komma- oder Bruchlösung triffst du mit ganzzahligem Raten nur die Umgebung – löse exakt um!` },
          ],
        }),
        choiceField(
          "Vorteil der Äquivalenzumformungen gegenüber Probieren",
          [
            "Sie liefern systematisch jede rationale Lösung (auch negative oder gebrochene) ohne Raten",
            "Man braucht die Probe überhaupt nicht mehr zu kennen",
            "Systematisches Probieren funktioniert bei ganzen Zahlen niemals",
          ],
          0,
        ),
      ],
      `Löse ${a}x + ${b} = ${fmt(rhs, 1)} mit | ${MINUS} ${b} und | : ${a}.`,
      `${a}x = ${fmt(rhs - b, 1)} → x = ${fmt(rhs - b, 1)} : ${a} = ${fmt(xExact, 1)}.`,
      `Exakte Lösung: <strong>${fmt(xExact, 1)}</strong>. Bei nicht-ganzzahligen oder großen Lösungen sparen Äquivalenzumformungen langwieriges Suchen.`,
      { a, b, rhs, xExact },
    );
  },
};

// ─── Generators 3.4 (Lösungsfälle & Sachkontext prüfen) ───────────────────────

const exSpecialCasesEq: ExerciseGenerator = {
  id: "sonderfaelle-gleichung",
  make(rng, level) {
    const k = rng.int(2, 5);
    const a = rng.int(2, 6);
    const kind = level === 1 ? rng.int(0, 1) : rng.int(0, 2); // 0: L=Q, 1: L={}, 2: unique

    if (kind === 0) {
      const rhs = k * a;
      return task(
        level,
        `Untersuche die Lösungsmenge von ${k} · (x + ${a}) = ${k}x + ${rhs}. Welche Lösungsmenge entsteht nach dem Sortieren?`,
        `Vereinfache ${k} · (x + ${a}) ${MINUS} 1 = ${k}x + ${rhs - 1}. Wie viele Lösungen hat die Gleichung in ℚ, und was bleibt beim Subtrahieren von ${k}x stehen?`,
        [
          intField("Restzahl links (gleich Restzahl rechts)", level === 1 ? rhs : rhs - 1),
          choiceField(
            "Lösungsmenge L",
            [
              "L = ℚ (allgemeingültig, unendlich viele Lösungen)",
              "L = { } (keine Lösung)",
              "L = { 0 } (genau eine Lösung)",
            ],
            0,
          ),
        ],
        `Multipliziere links aus und bringe ${k}x auf beiden Seiten weg.`,
        `Beide Seiten lauten vereinfacht ${k}x + ${level === 1 ? rhs : rhs - 1}. Nach | ${MINUS} ${k}x steht dort eine wahre Aussage (${level === 1 ? rhs : rhs - 1} = ${level === 1 ? rhs : rhs - 1}).`,
        `Die Aussage ist immer wahr → <strong>L = ℚ</strong>.`,
        { k, a, rhs },
      );
    }

    if (kind === 1) {
      const rhs = k * a + rng.int(2, 5);
      const diff = rhs - k * a;
      return task(
        level,
        `Bestimme den Lösungsfall für ${k} · (x + ${a}) = ${k}x + ${rhs}.`,
        `Löse ${k} · (x + ${a}) = ${k}x + ${rhs}. Welche falsche Aussage entsteht nach dem Kürzen von ${k}x (Differenz rechts minus links), und wie lautet L?`,
        [
          intField("Abstand zwischen rechter und linker Zahl", diff),
          choiceField(
            "Lösungsmenge L",
            [
              "L = { } (unerfüllbar, keine Lösung)",
              "L = ℚ (alle Zahlen erfüllen sie)",
              "L = { " + diff + " }",
            ],
            0,
          ),
        ],
        `Multipliziere links aus und ziehe ${k}x beiderseits ab.`,
        `${k}x + ${k * a} = ${k}x + ${rhs} | ${MINUS} ${k}x → ${k * a} = ${rhs} (falsche Aussage, Differenz ${diff}).`,
        `Keine Zahl kann einen Widerspruch erfüllen → <strong>L = { }</strong> (leere Menge).`,
        { k, a, rhs, diff },
      );
    }

    const sol = rng.int(2, 7);
    const rhs = (k + 1) * sol + k * a - sol * 0;
    return task(
      level,
      "",
      `Prüfe durch genaues Ausmultiplizieren, ob ein Sonderfall vorliegt: ${k} · (x + ${a}) + x = ${fmt(rhs, 0)}. Bestimme die Lösungsmenge.`,
      [
        intField("Lösungswert (wenn eindeutig)", sol),
        choiceField(
          "Art der Lösungsmenge",
          [
            `Eindeutige Lösung L = { ${sol} }`,
            "L = ℚ (unendlich viele Lösungen)",
            "L = { } (keine Lösung)",
          ],
          0,
        ),
      ],
      "",
      `Links zusammengefasst: ${k}x + ${k * a} + x = ${k + 1}x + ${k * a} = ${fmt(rhs, 0)}.`,
      `${k + 1}x = ${(k + 1) * sol} → eindeutige Lösung <strong>L = { ${sol} }</strong>.`,
      { k, a, sol, rhs },
    );
  },
};

const exContextReflect: ExerciseGenerator = {
  id: "sachkontext-pruefen",
  make(rng, level) {
    const scenario = (rng.sign() > 0);
    if (scenario) {
      // Negative/impossible piece count in story
      const perTicket = rng.int(6, 12);
      const extra = rng.int(3, 6) * perTicket;
      // e.g. perTicket * x + extra = lowerTotal -> negative x!
      const lower = extra - 2 * perTicket;
      return task(
        level,
        `Ein Schüler stellt für die Anzahl x von Kinotickets folgende Gleichung auf: ${perTicket}x + ${extra} = ${lower}. Berechne die rechnerische Lösung x und bewerte sie im Sachzusammenhang.`,
        `In einem Text zur Klassenfahrt soll x die Anzahl mitgenommener Busse sein; das Modell liefert ${perTicket}x + ${extra} = ${lower}. Bestimme die rechnerische Lösung x und entscheide, was sie für die Aufgabe bedeutet.`,
        [
          intField("Rechnerisches x", -2, [
            { value: 2, hint: `${lower} ${MINUS} ${extra} = ${fmt(lower - extra, 0)} (negativ!), also ist x negativ.` },
          ]),
          choiceField(
            "Bewertung im Sachkontext",
            [
              "Mathematisch x = −2, als Anzahl aber sinnlos (im Sachkontext nicht sinnvoll / Ansatz prüfen!)",
              "Man kauft einfach minus zwei Stück",
              "Die Gleichung hat deshalb unendlich viele Lösungen",
            ],
            0,
          ),
        ],
        `Rechne formal aus: ${perTicket}x = ${lower} ${MINUS} ${extra} = ${fmt(lower - extra, 0)}. Prüfe anschließend die Bedeutung von x!`,
        `Äquivalenzumformung: ${perTicket}x = ${MINUS}${2 * perTicket} → x = ${MINUS}2.`,
        `Rechnerisch <strong>x = ${MINUS}2</strong>, aber eine negative Stückzahl existiert im Alltag nicht – der Ansatz muss verworfen oder korrigiert werden.`,
        { perTicket, extra, lower },
      );
    }

    // Half-person or fractional whole-item trap vs genuine valid price
    const unitPrice = rng.int(3, 8);
    const persons = rng.int(2, 5);
    const total = unitPrice * persons + Math.floor(unitPrice / 2);
    const xRaw = roundTo(total / unitPrice, 2);
    return task(
      level,
      `Ein Rezept/Einkauf teilt ${total} Würstchen auf Packungen zu je ${unitPrice} Stück auf (${unitPrice}x = ${total}, falls man ganze Packungen zählen möchte). Wie lautet die genaue Kommalösung x, und ist diese Zahl als Anzahl ungeöffneter Packungen zulässig?`,
      `Für ein Klassenfest kostet eine volle Kiste ${unitPrice} Flaschen; benötigt werden genau ${total} Flaschen (${unitPrice}x = ${total}). Berechne die exakte Lösung der Gleichung und entscheide, wie viele ganze Kisten mindestens gekauft werden müssen.`,
      [
        numberField(
          level === 1 ? "Rechnerisches x" : "Mindestens nötige ganze Kisten",
          level === 1 ? xRaw : persons + 1,
          "",
          2,
          { absTolerance: 0.05 },
        ),
        choiceField(
          "Interpretation im Sachkontext",
          [
            `Rechnerisch nicht ganzzahlig → nur ganze Packungen/Kisten kaufbar (aufrunden auf ${persons + 1})`,
            `Man kauft exakt eine halbe Kiste im Supermarkt`,
            `Die Gleichung ist mathematisch falsch`,
          ],
          0,
        ),
      ],
      `Teile ${total} : ${unitPrice} und überprüfe, ob eine Kommazahl als Packungs-/Kistenanzahl sinnvoll ist.`,
      `${total} : ${unitPrice} = ${fmt(xRaw, 2)} (keine ganze Zahl).`,
      `${level === 1 ? `Rechnerisch x = <strong>${fmt(xRaw, 2)}</strong>` : `Man muss <strong>${persons + 1}</strong> ganze Kisten kaufen`} – mathematische Lösung und Sachkontext sinnvoll aufeinander abstimmen!`,
      { unitPrice, persons, total, xRaw },
    );
  },
};

// ─── Generators 3.5 (Prozentaufgaben mit Gleichungen) ─────────────────────────

const exPercentInverseEq: ExerciseGenerator = {
  id: "prozent-gleichung",
  make(rng, level) {
    const p = level === 1 ? rng.pick([10, 20, 25]) : rng.pick([15, 19, 25, 30]);
    const isDiscount = (rng.sign() > 0);
    const g = level === 1 ? rng.pick([80, 120, 200, 300]) : rng.pick([100, 200, 250, 400]);
    const factor = isDiscount ? 1 - p / 100 : 1 + p / 100;
    const finalPrice = roundTo(g * factor, 2);

    return task(
      level,
      isDiscount
        ? `Im Schlussverkauf wurde eine Jacke um ${p} % reduziert und kostet jetzt ${fmtUnit(finalPrice, "€", 2)}. Stelle die lineare Gleichung für den alten Grundwert G auf und berechne G.`
        : `Ein Nettopreis G erhöht sich um ${p} % (Aufschlag/Steuer) auf ${fmtUnit(finalPrice, "€", 2)}. Berechne mithilfe einer Gleichung den ursprünglichen Preis G.`,
      isDiscount
        ? `Ein Fahrrad wird nach ${p} % Rabatt zum Aktionspreis von ${fmtUnit(finalPrice, "€", 2)} angeboten. Warum darf man NICHT einfach ${p} % von ${fmt(finalPrice, 2)} € addieren? Stelle die Gleichung mit dem Veränderungsfaktor auf und berechne den alten Grundwert G.`
        : `Einschließlich ${p} % Mehrwertsteuer (bzw. Preiserhöhung) bezahlt ein Betrieb ${fmtUnit(finalPrice, "€", 2)}. Löse die zugehörige Gleichung nach dem Netto-Grundwert G auf.`,
      [
        numberField("Ursprünglicher Grundwert G", g, "€", 2, {
          absTolerance: 0.05,
          slips: [
            {
              value: roundTo(finalPrice * (isDiscount ? 1 + p / 100 : 1 - p / 100), 2),
              hint: `Fehler beim Grundwert: Die ${p} % beziehen sich auf den ALTEN Preis G, nicht auf den Endpreis ${fmt(finalPrice, 2)} €! Teile durch ${fmt(factor, 2)}.`,
            },
          ],
        }),
      ],
      isDiscount
        ? `Nach ${p} % Rabatt bleiben noch ${100 - p} % übrig: ${fmt(factor, 2)} · G = ${fmt(finalPrice, 2)}.`
        : `Nach +${p} % liegen ${100 + p} % vor: ${fmt(factor, 2)} · G = ${fmt(finalPrice, 2)}.`,
      `Gleichung: ${fmt(factor, 2)} · G = ${fmt(finalPrice, 2)} | : ${fmt(factor, 2)}.`,
      `G = ${fmt(finalPrice, 2)} : ${fmt(factor, 2)} = <strong>${fmtUnit(g, "€", 0)}</strong>.`,
      { p, g, finalPrice, factor },
    );
  },
};

const exPercentMultiPartEq: ExerciseGenerator = {
  id: "prozent-teilsummen",
  make(rng, level) {
    const pRate = rng.pick([20, 25, 40]);
    const fix = rng.int(15, 45);
    const x = rng.pick([50, 80, 100, 120, 160]);
    const total = roundTo((pRate / 100) * x + fix, 2);

    return task(
      level,
      `Vom Budget x einer Klasse fließen ${pRate} % in Technik; außerdem fallen ${fix} € feste Versandkosten an. Insgesamt werden ${fmtUnit(total, "€", 2)} ausgegeben (${fmt(pRate / 100, 2)} · x + ${fix} = ${fmt(total, 2)}). Berechne das Budget x.`,
      `Ein Online-Shop berechnet ${pRate} % des Warenwerts x als Zoll/Gebühr plus ${fix} € Pauschale. Zusammen zahlt man genau ${fmtUnit(total, "€", 2)} für diese Zusatzkosten. Stelle die Gleichung auf und bestimme den Warenwert x.`,
      [
        intField("Budget bzw. Warenwert x", x, [
          {
            value: Math.round((total / (pRate / 100))),
            hint: `Ziehe zuerst die feste Pauschale (${fix} €) von ${fmt(total, 2)} € ab, erst dann durch ${fmt(pRate / 100, 2)} teilen!`,
          },
        ], "€"),
      ],
      `Gleichung: ${fmt(pRate / 100, 2)} · x + ${fix} = ${fmt(total, 2)}.`,
      `| ${MINUS} ${fix} → ${fmt(pRate / 100, 2)} · x = ${fmt(total - fix, 2)}.`,
      `x = ${fmt(total - fix, 2)} : ${fmt(pRate / 100, 2)} = <strong>${fmtUnit(x, "€", 0)}</strong>.`,
      { pRate, fix, x, total },
    );
  },
};

// ─── Generators 3.6 (Mehrfache Prozentänderungen) ────────────────────────────

const exChainedPercent: ExerciseGenerator = {
  id: "prozent-verkettet",
  make(rng, level) {
    const p1 = rng.pick([10, 20, 25]);
    const p2 = level === 1 ? rng.pick([10, 20]) : rng.pick([-20, -10]);
    const start = rng.pick([100, 200, 400]);
    const endVal = roundTo(percentAfter(percentAfter(start, p1), p2), 2);
    const totalPct = roundTo(percentChainPercent(p1, p2), 2);
    const naiveSum = p1 + p2;

    return task(
      level,
      `Ein Produktpreis von ${start} € steigt zuerst um ${p1} % und danach noch einmal um ${p2} %. Berechne den neuen Preis und die tatsächliche prozentuale Gesamtänderung.`,
      `Ein Lieferpreis von ${start} € steigt wegen höherer Energiekosten zuerst um +${p1} % und sinkt im Folgejahr um ${Math.abs(p2)} %. Berechne den Endpreis und die gesamte prozentuale Veränderung (nicht einfach Prozentzahlen addieren!).`,
      [
        numberField("Endpreis", endVal, "€", 2, { absTolerance: 0.05 }),
        numberField("Gesamtänderung in %", totalPct, "%", 2, {
          absTolerance: 0.05,
          slips: [
            {
              value: naiveSum,
              hint: `Prozentsätze bei aufeinanderfolgenden Änderungen darf man NICHT addieren (${p1} ${p2 >= 0 ? `+ ${p2}` : `${MINUS} ${Math.abs(p2)}`} = ${naiveSum} %), weil der zweite Prozentwert auf dem veränderten Grundwert basiert!`,
            },
          ],
        }),
      ],
      `Multipliziere die beiden Veränderungsfaktoren q₁ = ${fmt(1 + p1 / 100, 2)} und q₂ = ${fmt(1 + p2 / 100, 2)}.`,
      `Gesamtfaktor: q = ${fmt(1 + p1 / 100, 2)} · ${fmt(1 + p2 / 100, 2)} = ${fmt(1 + totalPct / 100, 4)}; Endpreis = ${start} · ${fmt(1 + totalPct / 100, 4)} = ${fmt(endVal, 2)} €.`,
      `Endpreis: <strong>${fmtUnit(endVal, "€", 2)}</strong>; gesamte Änderung: <strong>${fmt(totalPct, 2)} %</strong>.`,
      { start, p1, p2, endVal, totalPct },
    );
  },
};

const exChainReverse: ExerciseGenerator = {
  id: "prozent-gegenaenderung",
  make(rng, level) {
    const start = rng.pick([100, 200, 500]);
    // Pair +25% and -20% (cancels to 1.00) vs +20% and -20% (-4%) vs +10% and -10% (-1%)
    const same = rng.pick([10, 20, 30]);
    const netPct = percentChainPercent(same, -same); // always -(same^2)/100, e.g. -1, -4, -9
    const endVal = roundTo(percentAfter(percentAfter(start, same), -same), 2);

    return task(
      level,
      `Ein Ticketpreis von ${start} € steigt um ${same} % und sinkt ein Jahr später wieder um ${same} %. Wie viel kostet das Ticket am Ende?`,
      `„Zuerst +${same} % mehr CO₂-Einsparung, dann leider ${MINUS}${same} % Rückgang – damit sind wir wieder genau bei null!“ Prüfe diese Behauptung für einen Startwert von ${start} Einheiten und gib die echte prozentuale Gesamtänderung an.`,
      [
        numberField(level === 1 ? "Endpreis" : "Endwert nach beiden Schritten", endVal, "", 2, {
          absTolerance: 0.05,
          slips: [
            {
              value: start,
              hint: `Bei gleichem Prozentsatz +${same} % und ${MINUS}${same} % sinkst du vom HÖHEREN Zwischenwert aus, deshalb landest du UNTER dem Startwert ${start}!`,
            },
          ],
        }),
        ...(level === 2
          ? [
              numberField("Gesamtänderung (mit Vorzeichen)", netPct, "%", 2, {
                absTolerance: 0.05,
                slips: [
                  {
                    value: 0,
                    hint: `1,${same === 10 ? "1" : same === 20 ? "2" : "3"} · 0,${same === 10 ? "9" : same === 20 ? "8" : "7"} = ${fmt(1 + netPct / 100, 2)}, also ${fmt(netPct, 2)} %!`,
                  },
                ],
              }),
            ]
          : []),
      ],
      `Faktor rauf: ${fmt(1 + same / 100, 2)}, Faktor runter: ${fmt(1 - same / 100, 2)}. Multipliziere beide!`,
      `Zwischenwert: ${start} · ${fmt(1 + same / 100, 2)} = ${roundTo(start * (1 + same / 100), 2)}; danach · ${fmt(1 - same / 100, 2)} = ${fmt(endVal, 2)}.`,
      `Ergebnis: <strong>${fmt(endVal, 2)}</strong>${level === 2 ? ` (Gesamtänderung: <strong>${fmt(netPct, 2)} %</strong> – niemals null!)` : ""}.`,
      { start, same, endVal, netPct },
    );
  },
};

// ─── Generators 3.7 (Prozentaussagen kritisch prüfen & bewerten) ───────────────

const exPercentPointsTrap: ExerciseGenerator = {
  id: "prozentpunkte-pruefen",
  make(rng, level) {
    const oldRate = rng.pick([10, 20, 25]);
    const pp = rng.pick([5, 10, 15]);
    const newRate = oldRate + pp;
    const relIncrease = roundTo((pp / oldRate) * 100, 1);

    return task(
      level,
      `Der Anteil erneuerbarer Energien in einer Gemeinde steigt von ${oldRate} % auf ${newRate} %. Eine Zeitung schreibt fälschlich: „Anstieg um ${pp} Prozent!“. Wie viele Prozentpunkte beträgt der Zuwachs, und um wie viel Prozent ist der Anteil relativ wirklich gestiegen?`,
      `In einer Diskussion zur Globalisierung stieg der Exportanteil von ${oldRate} % auf ${newRate} %. Prüfe die Aussage „Das ist nur ein Anstieg um ${pp} %“: Gib sowohl den Anstieg in Prozentpunkten als auch die tatsächliche relative Veränderung in % an.`,
      [
        intField("Zuwachs in Prozentpunkten", pp, undefined, "Prozentpunkte"),
        numberField("Tatsächliche relative Steigerung", relIncrease, "%", 1, {
          absTolerance: 0.1,
          slips: [
            {
              value: pp,
              hint: `${pp} ist die Differenz in Prozentpunkten (${newRate} ${MINUS} ${oldRate}). Die RELATIVE Steigerung teilt ${pp} durch den alten Anteil ${oldRate}!`,
            },
          ],
        }),
      ],
      `Prozentpunkte = Differenz der Prozentwerte (${newRate} ${MINUS} ${oldRate}). Relative Veränderung = Differenz : alter Wert · 100 %.`,
      `Unterschied: ${newRate} % ${MINUS} ${oldRate} % = ${pp} Prozentpunkte; relativ zum alten Anteil ${oldRate} % sind das ${pp} : ${oldRate} = ${fmt(pp / oldRate, 2)} = ${fmt(relIncrease, 1)} %.`,
      `Anstieg um <strong>${pp} Prozentpunkte</strong> entspricht relativ sogar <strong>+${fmt(relIncrease, 1)} %</strong>!`,
      { oldRate, pp, newRate, relIncrease },
    );
  },
};

const exClaimSeparation: ExerciseGenerator = {
  id: "aussage-bewerten",
  make(rng, level) {
    const budget = rng.pick([200, 400, 500]);
    const share = rng.pick([20, 25, 30]);
    const wrongClaimFactor = rng.int(1, 2);
    const trueAmount = roundTo((budget * share) / 100, 0);

    return task(
      level,
      `Eine Gemeinde hat ${budget} Tsd. € Etat und gibt ${share} % für Klimaschutz aus. Berechne diesen exakten Betrag und trenne die mathematische Prüfung von einer politischen Wertung.`,
      `In einer Debatte zur nachhaltigen Entwicklung fallen zwei Sätze über einen ${budget}-Mio.-€-Etat mit ${share} % Bildungsanteil: (1) „Das sind exakt ${trueAmount + wrongClaimFactor * 15} Mio. €.“ (2) „Dieser Anteil sollte künftig noch höher priorisiert werden.“ Berechne den wahren Betrag und ordne beide Sätze fachlich ein.`,
      [
        intField(
          level === 1 ? "Ausgaben in Tsd. €" : "Wahrer Bildungsanteil in Mio. €",
          trueAmount,
          [
            {
              value: budget - trueAmount,
              hint: `Gefragt ist der Anteil von ${share} %, nicht der Restbetrag ${100 - share} %!`,
            },
          ],
        ),
        choiceField(
          "Mathematische Fakten vs. außerfachliche Wertung",
          level === 1
            ? [
                "Rechnerisch sind es exakt " + trueAmount + " Tsd. €; ob das „genug“ ist, ist eine politische Wertungsfrage",
                "Die Mathematik legt selbst fest, ob 20 % moralisch gut oder schlecht sind",
                "Prozentwerte lassen sich grundsätzlich nicht überprüfen",
              ]
            : [
                "(1) ist mathematisch falsch (" + trueAmount + " Mio. € ≠ " + (trueAmount + wrongClaimFactor * 15) + " Mio. €); (2) ist eine außerfachliche Wertung",
                "Beide Aussagen lassen sich rein mit einer Gleichung als wahr beweisen",
                "(1) ist eine politische Meinung und (2) ist ein Rechenfehler",
              ],
          0,
        ),
      ],
      `Mathematik prüft Anteile, Grundwerte und Zahlenrechnung auf Korrektheit – Bewertungen wie „gerecht“ oder „wichtig“ sind außerfachlich.`,
      `${share} % von ${budget} = ${fmt(share / 100, 2)} · ${budget} = ${trueAmount}.`,
      `Wahrer Betrag: <strong>${trueAmount}</strong>. ${level === 1 ? "Mathematik klärt die Rechnung, Politik/Ethik bewertet Prioritäten." : "Aussage (1) enthält einen Rechenfehler, Aussage (2) ist eine politische Zielbewertung."}`,
      { budget, share, trueAmount },
    );
  },
};

// ─── Stage 3 Lessons (7 Lektionen) ────────────────────────────────────────────

export const STAGE_3_LESSONS = makeLessons([
  {
    id: "gl-1-aufstellen",
    section: "3",
    title: "3.1 Gleichungen aufstellen & Invarianzprinzip",
    subtitle: "Sachprobleme mithilfe unveränderlicher Größen in Gleichungen übersetzen",
    whyItMatters:
      "Fast jedes Anwendungsrätsel lässt sich knacken, sobald du erkennst, welche Größe auf beiden Seiten gleich bleibt (= Waage im Gleichgewicht).",
    explanationHtml: `
      <p>Eine <strong>Gleichung</strong> entsteht, wenn du zwei Terme durch ein Gleichheitszeichen verbindest: <code>T₁(x) = T₂(x)</code>. Gesucht sind genau diejenigen Zahlen für <em>x</em>, die aus der Gleichung eine wahre Aussage machen.</p>
      <p><strong>Das Invarianzprinzip als Denkhilfe:</strong> Oft verändert sich in einer Geschichte etwas (Geld wandert von Anna zu Ben, oder Jahre vergehen), doch eine bestimmte Größe bleibt <strong>unverändert (invariant)</strong> – etwa die Gesamtsumme, der Umfang oder der Altersunterschied!</p>
      <div class="example">
        <strong>Beispiel – Invarianz beim Altersunterschied:</strong><br>
        Mutter (38) und Tochter (12) haben heute einen Altersunterschied von <code>38 − 12 = 26</code> Jahren.<br>
        In <em>x</em> Jahren ist die Mutter <code>38 + x</code> und die Tochter <code>12 + x</code>. Wann ist die Mutter doppelt so alt?<br>
        Gleichung: <code>38 + x = 2 · (12 + x)</code> → <code>38 + x = 24 + 2x</code> → <code>x = 14</code> Jahre (Probe: 52 = 2 · 26 ✓).
      </div>
      <div class="merke">
        <strong>Merke:</strong> Lege zuerst klar fest, wofür <em>x</em> steht (mit Einheit!), suche zwei verschiedene Beschreibungen derselben Gesamtgröße (= Invarianz!) und verbinde sie mit <code>=</code>.
      </div>
    `,
    formulas: [
      {
        name: "Gleichungsansatz über Invarianz",
        html: "Linke Beschreibung(x) = Rechte Beschreibung(x)",
        quantities: "Beide Seiten beschreiben dieselbe unveränderliche Gesamtgröße (oder Gleichgewicht)",
      },
    ],
    quiz: Q(
      "Leo und Mia haben zusammen 50 €. Mia hat 8 € mehr als Leo (x €). Welche Gleichung beschreibt die gleichbleibende Gesamtsumme richtig?",
      "x + (x + 8) = 50",
      "x + 8 = 50",
      "2x − 8 = 50 + 8",
      "Leos Betrag ist x, Mias Betrag ist x + 8. Beide zusammen sind invariant gleich 50 €: x + (x + 8) = 50.",
    ),
    lab: labEquationModel,
    exercises: [exInvarianceEq, exBalanceEqSetupClean],
    celebrationMessage:
      "Klasse aufgestellt! Mit dem Invarianzprinzip übersetzt du Texträtsel direkt in passende Gleichungen.",
  },
  {
    id: "gl-2-aequivalenz",
    section: "3",
    title: "3.2 Äquivalenzumformungen & Lösungsmenge",
    subtitle: "Umformungen sauber notieren, erhalten der Lösungsmenge begründen und Probe machen",
    whyItMatters:
      "Wie bei einer Balkenwaage muss jeder Schritt auf beiden Seiten gleich wirken und eindeutig umkehrbar sein – sonst schmuggelst du falsche Scheinlösungen hinein.",
    explanationHtml: `
      <p>Eine Umformung heißt <strong>Äquivalenzumformung</strong> (notiert mit <code>⇔</code>), wenn sie die <strong>Lösungsmenge L</strong> exakt unverändert lässt. Erlaubt sind:</p>
      <ul>
        <li>Addieren oder Subtrahieren desselben Terms auf beiden Seiten (<code>| + T</code> oder <code>| − T</code>),</li>
        <li>Multiplizieren oder Dividieren beider Seiten mit derselben Zahl <strong>ungleich null</strong> (<code>| · c</code> oder <code>| : c</code> mit <code>c ≠ 0</code>).</li>
      </ul>
      <p><strong>Warum bleibt L erhalten?</strong> Weil zu jedem solchen Schritt die umgekehrte Operation existiert (z. B. macht <code>| · 3</code> das <code>| : 3</code> wieder rückgängig). <em>Verboten</em> als Äquivalenzumformung ist dagegen <code>| · 0</code>: Aus <code>x = 5</code> würde <code>0 = 0</code> (L würde fälschlich zu ℚ)!</p>
      <div class="example">
        <strong>Beispiel – formale Schreibweise und Einsetzprobe:</strong><br>
        <code>5x − 4 = 2x + 11</code> &nbsp;|&nbsp; <code>− 2x</code><br>
        <code>⇔ 3x − 4 = 11</code> &nbsp;|&nbsp; <code>+ 4</code><br>
        <code>⇔ 3x = 15</code> &nbsp;|&nbsp; <code>: 3</code><br>
        <code>⇔ x = 5</code> → <code>L = { 5 }</code>.<br>
        <strong>Probe:</strong> Links <code>5 · 5 − 4 = 21</code>, rechts <code>2 · 5 + 11 = 21</code> ✓.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Jede Äquivalenzumformung wirkt auf die <em>ganze</em> linke und die <em>ganze</em> rechte Seite, und die abschließende <strong>Probe durch Einsetzen</strong> deckt jeden Rechenfehler sofort auf!
      </div>
    `,
    formulas: [
      {
        name: "Erlaubte Äquivalenzumformungen",
        html: "A = B &nbsp;⇔&nbsp; A ± T = B ± T, &nbsp;&nbsp; A = B &nbsp;⇔&nbsp; A · c = B · c &nbsp;(c ≠ 0)",
        quantities: "Umkehrbarkeit sichert, dass die Lösungsmenge L exakt erhalten bleibt",
      },
    ],
    quiz: Q(
      "Warum darfst du eine Gleichung als Äquivalenzumformung niemals auf beiden Seiten mit 0 multiplizieren?",
      "Weil die Lösungsmenge sich dabei verändert (aus einer Zahlengleichung wird 0 = 0 für alle x)",
      "Weil Multiplikation mit 0 grundsätzlich nicht definiert ist",
      "Weil sich dadurch nur das Vorzeichen umkehrt",
      "Bei | · 0 geht die Gleichung unwiederbringlich in 0 = 0 über; es existiert keine Rückumkehrung (: 0 ist verboten)!",
    ),
    lab: labBalanceScale,
    exercises: [exSolveLinearEq, exFormalEquivStep],
    celebrationMessage:
      "Sehr sauber! Du dokumentierst jeden Äquivalenzschritt formal korrekt und überprüfst dein Ergebnis per Probe.",
  },
  {
    id: "gl-3-klammern",
    section: "3",
    title: "3.3 Klammergleichungen & systematisches Probieren",
    subtitle: "Erst Seiten vereinfachen, dann umformen – und mit Probierverfahren vergleichen",
    whyItMatters:
      "Systematisches Probieren hilft zur ersten Orientierung, versagt aber bei krummen Dezimal- oder Bruchlösungen. Hier erlebst du genau die Stärke exakter Umformungen.",
    explanationHtml: `
      <p>Tauchen in einer linearen Gleichung Klammern oder viele x-Glieder auf, gehst du immer nach demselben Fahrplan vor:</p>
      <ol>
        <li><strong>Beide Seiten einzeln vereinfachen</strong> (Klammern ausmultiplizieren, Minusklammern beachten, gleichartige Glieder zusammenfassen).</li>
        <li><strong>x-Glieder sammeln, Konstanten trennen</strong> (Äquivalenzumformungen).</li>
        <li><strong>Durch den x-Koeffizienten teilen</strong> und die <strong>Probe</strong> rechnen.</li>
      </ol>
      <div class="example">
        <strong>Vergleich: Systematisches Probieren vs. Äquivalenzumformung:</strong><br>
        Betrachte <code>4x + 3 = 13</code>:<br>
        • <em>Systematisches Probieren:</em> <code>x = 2 → 11</code> (zu klein), <code>x = 3 → 15</code> (zu groß), <code>x = 2,5 → 13</code> ✓.<br>
        • <em>Äquivalenzumformung:</em> <code>4x = 10</code> → <code>x = 2,5</code> in zwei sicheren Schritten! Bei Bruchlösungen wie <code>7x + 1 = 3</code> (<code>x = ${frac(2, 7)}</code>) wäre Probieren mühsam und ungenau.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Erst jede Seite durch Termumformung ordnen, dann über die Grenze des Gleichheitszeichens hinweg äquivalent umformen!
      </div>
    `,
    formulas: [
      {
        name: "Lösungsstrategie für lineare Gleichungen",
        html: "1. Klammern lösen &amp; zusammenfassen → 2. x ordnen → 3. teilen → 4. Probe",
        quantities: "Findet auch beliebige rationale Lösungen exakt ohne langes Raten",
      },
    ],
    quiz: Q(
      "Wann stößt „systematisches Probieren“ im Vergleich zu Äquivalenzumformungen schnell an seine Grenzen?",
      "Wenn die Lösung eine negative Zahl, ein Bruch oder ein ungenaues Dezimalergebnis (z. B. 2/7) ist",
      "Wenn die Lösung zwischen 1 und 5 als ganze Zahl liegt",
      "Wenn auf beiden Seiten nur ein x steht",
      "Bei ganzen Zahlen nah bei 0 gelingt Probieren rasch; exakte Bruchlösungen wie 2/7 liefern Äquivalenzumformungen sofort und zuverlässig.",
    ),
    lab: labEqVsTrial,
    exercises: [exBracketEq, exCompareTrialVsEq],
    celebrationMessage:
      "Stark umgeformt! Klammern und Vorzeichen stoppen deine Gleichungslösungen nicht mehr.",
  },
  {
    id: "gl-4-sonderfaelle",
    section: "3",
    title: "3.4 Lösungsfälle & Ergebnisse im Sachkontext prüfen",
    subtitle: "Eindeutig, allgemeingültig oder unerfüllbar – und ob die Zahl in der Realität passt",
    whyItMatters:
      "Eine Gleichung kann „keine Lösung“ oder „alle Zahlen“ liefern – und selbst eine rechnerisch korrekte Zahl kann als Stückzahl −2 im Alltag sinnlos sein.",
    explanationHtml: `
      <p>Nach dem Vereinfachen erreicht jede lineare Gleichung die Form <code>a · x = b</code>. Dabei treten genau drei Fälle auf:</p>
      <ul>
        <li><strong>a ≠ 0:</strong> genau eine Lösung → <code>L = { ${frac("b", "a")} }</code>.</li>
        <li><strong>0 · x = 0:</strong> wahre Aussage für jedes <em>x</em> → <strong>allgemeingültig</strong>, <code>L = ℚ</code>.</li>
        <li><strong>0 · x = b (mit b ≠ 0):</strong> falsche Aussage (z. B. <code>3 = 7</code>) → <strong>unerfüllbar</strong>, <code>L = { }</code>.</li>
      </ul>
      <div class="example">
        <strong>Beispiel – mathematische Lösung vs. Sachzusammenhang:</strong><br>
        1. In einem Rezept ergeben sich <code>x = −3</code> Eier → mathematisch Lösung der Gleichung, als Stückzahl aber <em>unmöglich</em>!<br>
        2. Bei der Anzahl nötiger Busse ergibt <code>40x = 95</code> den Wert <code>x = 2,375</code> → da es keine 0,375 Busse gibt, braucht man <strong>3 Busse</strong>.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Vergleiche das rechnerische Ergebnis immer mit der Wirklichkeit: Ist eine negative Zahl, ein Bruch oder überhaupt eine freie Wahl sinnvoll?
      </div>
    `,
    formulas: [
      {
        name: "Die drei Lösungsfälle von a · x = b",
        html: "a ≠ 0 ⇒ L = {b : a} &nbsp;|&nbsp; 0·x = 0 ⇒ L = ℚ &nbsp;|&nbsp; 0·x = b (b ≠ 0) ⇒ L = { }",
        quantities: "Zusätzlich im Sachkontext: Sinnprüfung (ganzzahlig? nicht-negativ?)",
      },
    ],
    quiz: Q(
      "Nach korrektem Umformen erhältst du 2x + 5 = 2x + 9, also 5 = 9. Was bedeutet das?",
      "Die Gleichung hat keine Lösung: L = { }",
      "Es gibt zwei Lösungen: 5 und 9",
      "Jede beliebige rationale Zahl ist Lösung: L = ℚ",
      "5 = 9 ist unabhängig von x immer falsch; keine Zahl x kann sie erfüllen → L = { }.",
    ),
    lab: labEqCases,
    exercises: [exSpecialCasesEq, exContextReflect],
    celebrationMessage:
      "Perfekt reflektiert! Du erkennst alle drei Lösungsfälle und prüfst Ergebnisse kritisch am Sachkontext.",
  },
  {
    id: "pr-1-gleichung",
    section: "3",
    title: "3.5 Prozentaufgaben mit Gleichungen lösen",
    subtitle: "Grundwerte, Rabatte und Zuschläge sicher über Veränderungsfaktoren bestimmen",
    whyItMatters:
      "Nach einem Rabatt von 20 % darf man auf den neuen Preis nicht einfach wieder 20 % addieren! Lineare Gleichungen schützen dich zuverlässig vor der Grundwert-Falle.",
    explanationHtml: `
      <p>Aus Klasse 6 kennst du <code>Prozentwert = Prozentsatz · Grundwert</code>. Mit <strong>linearen Gleichungen</strong> löst du jetzt auch Rückwärts- und gemischte Aufgaben mühelos mithilfe des <strong>Veränderungsfaktors q</strong>:</p>
      <ul>
        <li>Erhöhung um <em>p</em> %: <code>q = 1 + ${frac("p", 100)}</code> → <code>G<sub>neu</sub> = q · G</code>.</li>
        <li>Senkung / Rabatt um <em>p</em> %: <code>q = 1 − ${frac("p", 100)}</code> → <code>G<sub>neu</sub> = q · G</code>.</li>
      </ul>
      <div class="example">
        <strong>Beispiel – alten Preis vor 20 % Rabatt bestimmen:</strong><br>
        Eine Winterjacke kostet nach <code>20 %</code> Rabatt noch <code>96 €</code>. Was kostete sie ursprünglich (<code>G</code>)?<br>
        Nach 20 % Rabatt bleiben <code>80 % = 0,80</code> übrig:<br>
        <code>0,80 · G = 96</code> &nbsp;|&nbsp; <code>: 0,80</code> → <code>G = 96 : 0,80 = 120 €</code>.<br>
        <em>Kontrollfehler vermieden:</em> <code>96 · 1,20 = 115,20 €</code> wäre falsch gewesen!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Stelle bei unbekanntem Grundwert immer die Gleichung <code>Veränderungsfaktor · G = neuer Wert</code> auf und teile durch den Faktor!
      </div>
    `,
    formulas: [
      {
        name: "Prozentrechnung mit Veränderungsfaktor q",
        html: `G<sub>neu</sub> = (1 ± ${frac("p", 100)}) · G`,
        quantities: "G alter Grundwert, p Änderung in %; nach G auflösen durch Division durch q",
      },
    ],
    quiz: Q(
      "Ein Laptop kostet inklusive 19 % Mehrwertsteuer 1190 €. Wie berechnest du den Nettopreis x (ohne Steuer)?",
      "1,19 · x = 1190 → x = 1190 : 1,19 = 1000 €",
      "x = 1190 · 0,81 = 963,90 €",
      "x = 1190 − 19 = 1171 €",
      "Die 19 % beziehen sich auf den unbekannten Nettopreis x, also 1,19 · x = 1190 → x = 1000 €.",
    ),
    lab: labPercentEquation,
    exercises: [exPercentInverseEq, exPercentMultiPartEq],
    celebrationMessage:
      "Sehr stark! Mit Gleichungen fällst du nie wieder auf verwechselte Grundwerte herein.",
  },
  {
    id: "pr-2-wachstum",
    section: "3",
    title: "3.6 Mehrfache Prozentänderungen & Globalisierung",
    subtitle: "Verkettete Zu- und Abnahmen mit Faktoren multiplizieren statt Prozente zu addieren",
    whyItMatters:
      "Ob Welthandel, Energiepreise oder CO₂-Ausstoß: Entwicklungen laufen über mehrere Jahre hinweg – und +20 % gefolgt von −20 % ergibt nicht wieder 100 %!",
    explanationHtml: `
      <p>Ändert sich eine Größe zweimal hintereinander um <em>p₁ %</em> und danach um <em>p₂ %</em>, wechselt beim zweiten Schritt der Grundwert! Deshalb darfst du die Prozentwerte <strong>niemals einfach addieren</strong>.</p>
      <p>Stattdessen multiplizierst du die beiden Veränderungsfaktoren:</p>
      <p><code>q<sub>gesamt</sub> = q₁ · q₂ = (1 ± ${frac("p₁", 100)}) · (1 ± ${frac("p₂", 100)})</code></p>
      <div class="example">
        <strong>Beispiel – Preissprung in globaler Lieferkette:</strong><br>
        Ein Transportpreis von <code>200 €</code> steigt im ersten Jahr um <code>+20 %</code> und fällt im nächsten Jahr um <code>−20 %</code>.<br>
        Rechnung: <code>q<sub>gesamt</sub> = 1,20 · 0,80 = 0,96</code> → Endpreis <code>200 · 0,96 = 192 €</code>.<br>
        Insgesamt ist der Preis also um <strong>4 % gesunken</strong> – nicht gleich geblieben!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Bei aufeinanderfolgenden Prozentänderungen gilt <strong>Faktoren multiplizieren</strong> (<code>q₁ · q₂</code>), niemals Prozentsätze addieren!
      </div>
    `,
    formulas: [
      {
        name: "Verkettete Prozentänderung",
        html: "q<sub>gesamt</sub> = q<sub>1</sub> · q<sub>2</sub>, &nbsp; p<sub>gesamt</sub> = (q<sub>gesamt</sub> − 1) · 100 %",
        quantities: "Reihenfolge vertauschbar (Kommutativgesetz), aber Faktoren ≠ Summe",
      },
    ],
    quiz: Q(
      "Ein weltweiter Rohstoffverbrauch sinkt zunächst um 10 % und steigt danach wieder um 10 %. Wie liegt der Endwert im Vergleich zum Startwert?",
      "Um 1 % niedriger (0,90 · 1,10 = 0,99)",
      "Genau beim Startwert (0 % Änderung)",
      "Um 1 % höher als zu Beginn",
      "Verketten der Faktoren liefert 0,90 · 1,10 = 0,99, was genau 99 % des Startwerts (also −1 %) bedeutet.",
    ),
    lab: labChainPercent,
    exercises: [exChainedPercent, exChainReverse],
    celebrationMessage:
      "Durchschaut! Du multiplizierst Änderungsfaktoren und erkennst sofort verdeckte Gesamteffekte.",
  },
  {
    id: "pr-3-pruefen",
    section: "3",
    title: "3.7 Prozentaussagen kritisch prüfen & bewerten",
    subtitle: "Rechenfehler entlarven sowie mathematische Fakten und Werturteile sauber trennen",
    whyItMatters:
      "In Medien, Politik und Nachhaltigkeitsberichten werden Zahlen häufig geschickt verpackt – hier lernst du, Fakt von Meinung zu trennen und Zahlen nachzurechnen.",
    explanationHtml: `
      <p>Wer öffentliche Aussagen zur Globalisierung, Nachhaltigkeit oder Politik beurteilt, muss zwei Ebenen auseinanderhalten:</p>
      <ol>
        <li><strong>Mathematischer Aspekt:</strong> Stimmt der Grundwert? Wurden <strong>Prozent</strong> und <strong>Prozentpunkte</strong> verwechselt? Ist der relative Anteil korrekt berechnet?</li>
        <li><strong>Außerfachlicher Aspekt (Wertung):</strong> Ob etwas als „zu hoch“, „gerecht“, „ausreichend“ oder „politisch wünschenswert“ gilt, kann die Mathematik allein <em>nicht</em> entscheiden.</li>
      </ol>
      <div class="example">
        <strong>Beispiel – Prozent vs. Prozentpunkte:</strong><br>
        Steigt der Recycling-Anteil einer Stadt von <code>20 %</code> auf <code>25 %</code>, sind das:<br>
        • <code>+5 Prozentpunkte</code> absoluter Abstand der Quoten (<code>25 − 20</code>),<br>
        • aber ein <strong>relativer Anstieg um +25 %</strong> (denn <code>${frac(5, 20)} = 0,25 = 25 %</code> mehr Recycling als zuvor)!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Prüfe zuerst die mathematische Richtigkeit (Grundwert? Prozentpunkte? absolute Menge vs. Quote!) und trenne das Ergebnis sauber von politischen oder ethischen Bewertungen.
      </div>
    `,
    formulas: [
      {
        name: "Prozentpunkte vs. relative Änderung",
        html: `Δp = p<sub>neu</sub> − p<sub>alt</sub> (Prozentpunkte) &nbsp;|&nbsp; p<sub>rel</sub> = ${frac("p<sub>neu</sub> − p<sub>alt</sub>", "p<sub>alt</sub>")} · 100 %`,
        quantities: "Relative Änderung bezieht die Differenz auf den Ausgangswert p_alt",
      },
    ],
    quiz: Q(
      "In einem Artikel zum Thema Nachhaltigkeit stehen zwei Sätze: „Der Ökostromanteil stieg von 40 % auf 50 %, also um 10 Prozentpunkte. Das zeigt, dass das bisherige Tempo reicht.“ Welche Einordnung stimmt?",
      "Der erste Teil ist mathematisch richtig; ob das Tempo „reicht“, ist eine außerfachliche Bewertung",
      "Beide Sätze sind rein mathematisch bewiesen",
      "40 % auf 50 % sind genau 10 % relative Steigerung, nicht 10 Prozentpunkte",
      "50 − 40 = 10 Prozentpunkte (relativ übrigens +25 %!). Ob dieses Tempo politisch oder ökologisch ausreicht, bleibt eine außerfachliche Wertung.",
    ),
    lab: labClaimAudit,
    exercises: [exPercentPointsTrap, exClaimSeparation],
    celebrationMessage:
      "Lernbereich 3 geschafft! Du löst Gleichungen, wendest Prozentfaktoren sicher an und trennst Rechnung von Bewertung.",
  },
]);
