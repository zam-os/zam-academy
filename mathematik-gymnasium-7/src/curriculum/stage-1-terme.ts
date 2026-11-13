import {
  choiceField,
  intField,
  numberField,
} from "./helpers";
import { countPhrase, Q, signed, task } from "./builders";
import { makeLessons } from "./make";
import {
  labAreaScaling,
  labBinomialSquare,
  labDistributiveArea,
  labFactorRect,
  labLikeTermsProbe,
  labPatternTerms,
  labPowerRulesN,
  labSpreadsheetSim,
  labSumProductGrid,
  labTermInterpret,
  labTermTree,
  labValueTable,
} from "./labs";
import {
  coefOf,
  Poly,
  polyAdd,
  polyHtml,
  polyMul,
  polySub,
  roundTo,
} from "./math";
import { fmt, fmtUnit, frac, fracHtml, MINUS, paren } from "../exercises/format";
import type { ExerciseGenerator } from "../model/types";

const LINEAR_TERM = (m: number, t: number): string =>
  polyHtml(
    [
      { c: m, m: { x: 1 } },
      { c: t, m: {} },
    ],
    true,
  );

// ─── Generators 1.1 (LB 1.1) ─────────────────────────────────────────────────

const exPatternTerm: ExerciseGenerator = {
  id: "term-muster",
  make(rng, level) {
    const step = rng.int(2, 5);
    const start = step + rng.pick([-1, 1, 2]);
    const n = level === 1 ? rng.int(6, 12) : rng.int(15, 28);
    const base = start - step;
    const ans = start + step * (n - 1);
    const termText = `${step}n${base === 0 ? "" : signed(base, 0)}`;
    const wrongMul = start * n;
    const wrongOffByOne = start + step * n;

    return task(
      level,
      `Eine Figurenfolge beginnt mit ${countPhrase(start, "Streichholz", "Streichhölzern")} in Figur 1. Mit jedem Schritt kommen ${countPhrase(step, "weiteres Streichholz", "weitere Streichhölzer")} dazu. Berechne die Anzahl der Streichhölzer in Figur n = ${n}.`,
      `Ein architektonisches Gitter wächst schrittweise: Das 1. Modul braucht ${countPhrase(start, "Stab", "Stäbe")}, jedes angefügte Modul erhöht die Gesamtzahl um ${step}. Bestimme die Gesamtzahl der Stäbe für n = ${n} Module und wähle den passenden allgemeinen Term T(n).`,
      level === 1
        ? [
            intField("Anzahl für n =" + ` ${n}`, ans, [
              {
                value: wrongOffByOne,
                hint: `Für das 1. Element musst du noch keine Schritte addieren: Zu den ${start} Start-Elementen kommen (n ${MINUS} 1) · ${step}, nicht n · ${step}.`,
              },
              {
                value: wrongMul,
                hint: `Nur der Zuwachs pro Schritt wird mit n vervielfacht, nicht der Startwert selbst.`,
              },
            ]),
          ]
        : [
            intField(`T(${n})`, ans, [
              {
                value: wrongOffByOne,
                hint: `Beim 1. Modul gibt es (n ${MINUS} 1) Zuwachsschritte: ${start} + ${step} · (n ${MINUS} 1).`,
              },
              {
                value: wrongMul,
                hint: `Ein Startanteil wird einmalig gezählt und wächst nicht mit jedem Modul mit.`,
              },
            ]),
            choiceField(
              "Passender Term T(n)",
              [
                `${start} + ${step} · (n ${MINUS} 1) = ${termText}`,
                `${start} + ${step} · n`,
                `${start} · n + ${step}`,
              ],
              0,
            ),
          ],
      `Startwert + (n ${MINUS} 1) · Zuwachs pro Schritt = ${start} + (n ${MINUS} 1) · ${step}`,
      `Nach dem 1. Element folgen noch ${n} ${MINUS} 1 = ${n - 1} Zuwachsschritte mit je ${step}.`,
      `Rechnung: ${start} + ${n - 1} · ${step} = <strong>${fmt(ans, 0)}</strong> (allgemeiner Term: ${termText}).`,
      { start, step, n, ans },
    );
  },
};

const exWordToTerm: ExerciseGenerator = {
  id: "wort-zu-term",
  make(rng, level) {
    const k = rng.int(2, 6);
    const a = rng.int(3, 9);
    let b = rng.int(1, 5);
    if (b === k) b = k === 2 ? 3 : 2;
    const xVal = rng.int(3, 8);
    let yVal = rng.int(2, 6);
    if (yVal === xVal) yVal = xVal + 1;

    if (level === 1) {
      const sign = (rng.sign() > 0) ? 1 : -1;
      const val = k * xVal + sign * a;
      const wording =
        sign > 0
          ? `Addiere zum ${k}-Fachen einer Zahl x die Zahl ${a}.`
          : `Vermindere das ${k}-Fache einer Zahl x um ${a}.`;
      const formula = `${k}x${sign > 0 ? ` + ${a}` : ` ${MINUS} ${a}`}`;
      const wrongOrder = sign > 0 ? k * (xVal + a) : a - k * xVal;
      return task(
        level,
        `${wording} Berechne den Termwert für x = ${xVal}.`,
        "",
        [
          intField("Termwert", val, [
            {
              value: wrongOrder,
              hint:
                sign > 0
                  ? `Zuerst das ${k}-Fache bilden (${k} · ${xVal}), danach ${a} addieren – keine Klammer um (x + ${a}).`
                  : `„Vermindere A um B“ bedeutet A ${MINUS} B (${k}x ${MINUS} ${a}), nicht B ${MINUS} A.`,
            },
          ]),
        ],
        `Übersetze Schritt für Schritt: „${k}-Faches von x“ ist ${k}x.`,
        `Aufgestellter Term: T(x) = ${formula}.`,
        `Einsetzen von x = ${xVal}: ${k} · ${xVal}${sign > 0 ? ` + ${a}` : ` ${MINUS} ${a}`} = <strong>${fmt(val, 0)}</strong>.`,
        { k, a, xVal, val },
      );
    }

    // Level 2: two-variable context
    const val = k * xVal + b * yVal;
    const swapped = b * xVal + k * yVal;
    return task(
      level,
      "",
      `Für ein Schulfest kosten ${k} Eintrittskarten für Kinder (Preis x = ${fmt(xVal, 0)} €) und ${b} Karten für Erwachsene (Preis y = ${fmt(yVal, 0)} €) zusammen einen Gesamtbetrag K(x, y). Stelle den Term auf und berechne den Gesamtpreis.`,
      [
        intField("Gesamtpreis", val, [
          {
            value: swapped,
            hint: `Ordne die Preise den richtigen Stückzahlen zu: x gehört zu den ${k} Kinderkarten, y zu den ${b} Erwachsenenkarten.`,
          },
          {
            value: (k + b) * (xVal + yVal),
            hint: `Addiere die Kosten der beiden Gruppen getrennt: ${k}x + ${b}y.`,
          },
        ], "€"),
        choiceField(
          "Richtiger Term K(x, y)",
          [`${k}x + ${b}y`, `${k + b}(x + y)`, `${k}y + ${b}x`],
          0,
        ),
      ],
      "",
      `Jede Gruppe liefert einen Summanden: ${k} · x + ${b} · y.`,
      `Einsetzen von x = ${xVal} und y = ${yVal}: ${k} · ${xVal} + ${b} · ${yVal} = <strong>${fmtUnit(val, "€", 0)}</strong>.`,
      { k, b, xVal, yVal, val },
    );
  },
};

// ─── Generators 1.2 (Deuten) ─────────────────────────────────────────────────

const exInterpretPart: ExerciseGenerator = {
  id: "term-deuten",
  make(rng, level) {
    const a = rng.int(4, 12);
    const b = rng.int(2, 6);
    const fee = rng.int(5, 18);
    const diffCost = rng.int(2, 6);
    const extraHours = rng.int(2, 5);

    if (level === 1) {
      const total = fee + b * a;
      return task(
        level,
        `Ein Fahrradverleih verlangt als Ausleihpreis P(t) = ${fee} + ${b}t (in €, Zeit t in Stunden). Berechne P(${a}) und deute die Zahl ${b} im Sachzusammenhang.`,
        "",
        [
          intField(`P(${a})`, total, [
            {
              value: (fee + b) * a,
              hint: `Die Grundgebühr ${fee} € fällt nur einmal an, nicht pro Stunde.`,
            },
          ], "€"),
          choiceField(
            `Bedeutung der Zahl ${b}`,
            [
              `Preis pro Stunde (${b} € pro Stunde)`,
              `Einmalige Grundgebühr (${b} €)`,
              `Maximale Leihdauer in Stunden`,
            ],
            0,
          ),
        ],
        `Der feste Summand ${fee} hängt nicht von t ab; der Faktor vor t gibt den Betrag pro Stunde an.`,
        `Grundgebühr = ${fee} €, dazu t = ${a} Stunden zu je ${b} €.`,
        `P(${a}) = ${fee} + ${b} · ${a} = <strong>${fmtUnit(total, "€", 0)}</strong>. Der Faktor ${b} ist der Stundenpreis.`,
        { fee, b, a, total },
      );
    }

    const delta = diffCost * extraHours;
    return task(
      level,
      "",
      `Eine Gartenanlage besteht aus zwei Rechtecken: Gesamtfläche A(x, y) = ${a}x + ${diffCost}(y ${MINUS} ${b}). Wie verändert sich die Fläche A (in m²), wenn y um ${extraHours} m vergrößert wird und x gleich bleibt?`,
      [
        intField("Flächenzuwachs", delta, [
          {
            value: extraHours,
            hint: `Der Zuwachs von y wird noch mit dem Faktor ${diffCost} vor der Klammer multipliziert.`,
          },
          {
            value: delta + a,
            hint: `x ändert sich nicht, also bleibt der erste Summand ${a}x unverändert.`,
          },
        ], "m²"),
        choiceField(
          "Bedeutung von (y − " + `${b}` + ")",
          [
            `Seitenlänge des zweiten Rechtecks, verkürzt um ${b} m`,
            `Anzahl der Wege rund um beide Rechtecke`,
            `Flächeninhalt des ersten Rechtecks`,
          ],
          0,
        ),
      ],
      "",
      `Wenn y um ${extraHours} wächst, wächst der Klammerterm (y ${MINUS} ${b}) ebenfalls um ${extraHours}.`,
      `Multipliziert mit dem Vorfaktor ${diffCost} nimmt die Fläche um ${diffCost} · ${extraHours} = <strong>${fmtUnit(delta, "m²", 0)}</strong> zu.`,
      { a, b, diffCost, extraHours, delta },
    );
  },
};

const exTermCompareContext: ExerciseGenerator = {
  id: "term-vergleich",
  make(rng, level) {
    const l = rng.int(6, 14);
    const w = rng.int(4, 10);
    const d = rng.int(1, 3);
    const outerArea = (l + 2 * d) * (w + 2 * d);
    const innerArea = l * w;
    const frameArea = outerArea - innerArea;

    return task(
      level,
      `Ein Blumenbeet mit Länge l = ${l} m und Breite b = ${w} m bekommt außenherum einen Weg der Breite d = ${d} m. Berechne die Wegfläche A = (l + 2d)(b + 2d) ${MINUS} l · b.`,
      `Ein Rahmen der Breite d = ${d} cm liegt rund um ein Foto der Maße l = ${l} cm mal b = ${w} cm. Er hat außen die Fläche (l + 2d)(b + 2d). Berechne den Flächeninhalt nur des Rahmens und entscheide, was der Term 2d(l + b + 2d) beschreibt.`,
      level === 1
        ? [
            intField("Wegfläche A", frameArea, [
              {
                value: (l + d) * (w + d) - innerArea,
                hint: `Der Weg liegt auf BEIDEN Seiten, also addierst du jeweils 2 · d zur Länge und Breite.`,
              },
              {
                value: outerArea,
                hint: `Das ist die Gesamtfläche samt Beet – du musst die Beetfläche l · b wieder abziehen.`,
              },
            ], "m²"),
          ]
        : [
            intField("Rahmenfläche", frameArea, [
              {
                value: (l + d) * (w + d) - innerArea,
                hint: `Auf jeder Seite kommt links UND rechts (bzw. oben UND unten) d hinzu, also +2d.`,
              },
              {
                value: outerArea,
                hint: `Vergiss nicht, die Fotofläche l · b vom großen Rechteck abzuziehen.`,
              },
            ], "cm²"),
            choiceField(
              "Was beschreibt 2d(l + b + 2d)?",
              [
                "Denselben Flächeninhalt des Rahmens (ausgeklammert)",
                "Den Umfang des äußeren Rechtecks",
                "Die Fläche des inneren Fotos allein",
              ],
              0,
            ),
          ],
      `Außenmaße bestimmen: Länge außen = ${l} + 2 · ${d} = ${l + 2 * d}, Breite außen = ${w} + 2 · ${d} = ${w + 2 * d}.`,
      `Gesamtfläche außen: ${l + 2 * d} · ${w + 2 * d} = ${outerArea}; Innenfläche: ${l} · ${w} = ${innerArea}.`,
      `Differenz: ${outerArea} ${MINUS} ${innerArea} = <strong>${fmtUnit(frameArea, level === 1 ? "m²" : "cm²", 0)}</strong>.`,
      { l, w, d, frameArea },
    );
  },
};

// ─── Generators 1.3 (Termwerte mit ganzzahligen Exponenten & Tabellen) ───────

const exEvalPowerTerm: ExerciseGenerator = {
  id: "termwert-potenz",
  make(rng, level) {
    const a = rng.int(2, 6);
    const x = rng.pick([-3, -2, 2, 3]);
    const baseNegExp = rng.pick([2, 4, 5]);
    const expNeg = rng.pick([-1, -2]);
    const fracVal = baseNegExp ** expNeg; // exact decimal: 0.5, 0.25, 0.2, 0.04, 0.0625
    const b = rng.pick([4, 8, 10]);

    if (level === 1) {
      const k = rng.int(1, 5);
      const val = a * x * x + k;
      const termHtml = `${a}x<sup>2</sup> + ${k}`;
      return task(
        level,
        `Berechne den Termwert T(${x < 0 ? paren(x, 0) : x}) für T(x) = ${termHtml}.`,
        "",
        [
          intField("Termwert", val, [
            {
              value: (a * x) ** 2 + k,
              hint: `Potenz vor Punkt: Zuerst nur x quadrieren (${paren(x, 0)}² = ${x * x}), erst danach mit ${a} multiplizieren.`,
            },
            ...(x < 0
              ? [
                  {
                    value: a * -x * x + k,
                    hint: `Ein negatives x wird beim Einsetzen eingeklammert: (${fmt(x, 0)})² = +${x * x}.`,
                  },
                ]
              : []),
          ]),
        ],
        `Reihenfolge beachten: Erst potenzieren, dann multiplizieren, zuletzt addieren.`,
        `(${fmt(x, 0)})² = ${x * x}; damit ist ${a} · ${x * x} = ${a * x * x}.`,
        `Termwert: ${a * x * x} + ${k} = <strong>${fmt(val, 0)}</strong>.`,
        { a, x, k, val },
      );
    }

    const ans = roundTo(-x * x + b * fracVal, 4);
    const negExpHtml = `${baseNegExp}<sup>${MINUS}${Math.abs(expNeg)}</sup>`;
    const wrongSignSquare = x * x + b * fracVal;
    const wrongNegMul = -x * x + b * baseNegExp * expNeg;
    return task(
      level,
      "",
      `Berechne den Wert des Terms T(x) = ${MINUS}x<sup>2</sup> + ${b} · ${negExpHtml} für x = ${fmt(x, 0)}. Erinnerst du dich aus Klasse 6 an negative Exponenten (a<sup>${MINUS}n</sup> = ${frac(1, "a<sup>n</sup>")})?`,
      [
        numberField(
          "Termwert",
          ans,
          "",
          2,
          {
            absTolerance: 0.005,
            slips: [
              {
                value: wrongSignSquare,
                hint: `Achtung: ${MINUS}x² bedeutet ${MINUS}(x²), nicht (${MINUS}x)². Das Minus steht vor der Potenz!`,
              },
              {
                value: wrongNegMul,
                hint: `${baseNegExp}⁻${Math.abs(expNeg)} ist der Kehrwert ${frac(1, `${baseNegExp}<sup>${Math.abs(expNeg)}</sup>`)}, kein negatives Produkt.`,
              },
            ],
          },
        ),
      ],
      "",
      `${MINUS}(${fmt(x, 0)})² = ${MINUS}${x * x} und ${negExpHtml} = ${fmt(fracVal, 2)}.`,
      `Einsetzen: ${MINUS}${x * x} + ${b} · ${fmt(fracVal, 2)} = ${MINUS}${x * x} + ${fmt(b * fracVal, 2)} = <strong>${fmt(ans, 2)}</strong>.`,
      { x, baseNegExp, expNeg, b, ans },
    );
  },
};

const exValueTableGap: ExerciseGenerator = {
  id: "wertetabelle-luecke",
  make(rng, level) {
    const m = rng.pick([-3, -2, 2, 3, 4]);
    const t = rng.int(-5, 7);
    const x1 = -2;
    const x2 = 1;
    const x3 = 4;
    const y1 = m * x1 + t;
    const y2 = m * x2 + t;
    const y3 = m * x3 + t;

    if (level === 1) {
      return task(
        level,
        `In einer Wertetabelle zu T(x) = ${LINEAR_TERM(m, t)} fehlen Werte. Berechne die beiden Tabellenwerte für x = ${fmt(x1, 0)} und x = ${fmt(x3, 0)}.`,
        "",
        [
          intField(`T(${fmt(x1, 0)})`, y1, [
            { value: -m * x1 + t, hint: `Prüfe das Vorzeichen beim Produkt ${fmt(m, 0)} · (${fmt(x1, 0)}).` },
          ]),
          intField(`T(${x3})`, y3),
        ],
        `Setze nacheinander x = ${fmt(x1, 0)} und x = ${x3} für x in ${LINEAR_TERM(m, t)} ein.`,
        `T(${fmt(x1, 0)}) = ${fmt(m, 0)} · (${fmt(x1, 0)})${t === 0 ? "" : signed(t, 0)} = ${fmt(y1, 0)}.`,
        `T(${x3}) = ${fmt(m, 0)} · ${x3}${t === 0 ? "" : signed(t, 0)} = <strong>${fmt(y3, 0)}</strong> (beide Werte: ${fmt(y1, 0)} und ${fmt(y3, 0)}).`,
        { m, t, y1, y3 },
      );
    }

    // Level 2: quadratic table value vs slope/change question
    const xAsk = rng.int(5, 8);
    const ans = m * xAsk + t;
    return task(
      level,
      "",
      `Eine Wertetabelle für einen linearen Term T(x) zeigt: T(${fmt(x1, 0)}) = ${fmt(y1, 0)}, T(${x2}) = ${fmt(y2, 0)} und T(${x3}) = ${fmt(y3, 0)}. Nutze den gleichmäßigen Schritt je +3 bei x, um T(${xAsk}) zu bestimmen, und gib die Zunahme pro +1 bei x an.`,
      [
        intField(`T(${xAsk})`, ans),
        intField("Änderung pro +1", m, [
          {
            value: 3 * m,
            hint: `Von ${fmt(x1, 0)} bis ${x2} wächst x um 3. Teile die Wertänderung (${fmt(y2 - y1, 0)}) durch 3!`,
          },
        ]),
      ],
      "",
      `Pro Schritt von Δx = 3 ändert sich T(x) um ${fmt(y2 - y1, 0)}, also um ${fmt(m, 0)} je +1 bei x.`,
      `Ausgehend von T(${x3}) = ${fmt(y3, 0)} folgen ${xAsk - x3} Schritte à ${fmt(m, 0)}: T(${xAsk}) = <strong>${fmt(ans, 0)}</strong>.`,
      { m, t, xAsk, ans },
    );
  },
};

// ─── Generators 1.4 (Tabellenkalkulation) ───────────────────────────────────

const exSheetFormula: ExerciseGenerator = {
  id: "tabelle-formel",
  make(rng, level) {
    const a2 = rng.int(2, 6);
    const row = rng.int(3, 5);
    const ax = a2 + (row - 2);
    const b1 = rng.int(2, 8);
    let bRow = rng.int(3, 7);
    if (bRow === b1) bRow = b1 >= 7 ? 4 : b1 + 1;
    const factor = rng.int(2, 4);

    if (level === 1) {
      const val = factor * ax + bRow;
      return task(
        level,
        `In einem Tabellenblatt steht in A${row} die Zahl ${ax} und in B${row} die Zahl ${bRow}. In C${row} steht die Formel <code>=${factor}*A${row}+B${row}</code>. Welchen Wert zeigt C${row} an?`,
        "",
        [
          intField(`Wert in C${row}`, val, [
            {
              value: factor * (ax + bRow),
              hint: `Punkt vor Strich: Nur A${row} wird mit ${factor} multipliziert, danach B${row} addiert.`,
            },
          ]),
        ],
        `Setze den Inhalt der Zellen A${row} und B${row} direkt in die Formel ein.`,
        `Die Formel berechnet ${factor} · ${ax} + ${bRow}.`,
        `${factor} · ${ax} + ${bRow} = ${factor * ax} + ${bRow} = <strong>${fmt(val, 0)}</strong>.`,
        { ax, bRow, factor, val },
      );
    }

    const val = ax * ax - b1;
    const wrongRel = ax * ax - bRow;
    return task(
      level,
      "",
      `In Spalte A stehen fortlaufend x-Werte (in A2 steht ${a2}, in A${row} steht ${ax}), in B1 steht der feste Parameter ${b1} und in B${row} steht ${bRow}. In C2 wird <code>=A2*A2-$B$1</code> eingetragen und bis C${row} nach unten kopiert. Welcher Wert steht in C${row}, und worauf verweist der Zellenbezug in C${row}?`,
      [
        intField(`Wert in C${row}`, val, [
          {
            value: wrongRel,
            hint: `Das Dollarzeichen $B$1 verhindert beim Herunterziehen das Mitwandern – es bleibt B1 (${b1}), nicht B${row}!`,
          },
          {
            value: 2 * ax - b1,
            hint: `A${row}*A${row} bedeutet das Quadrat (${ax}²), nicht das Doppelte (2 · ${ax}).`,
          },
        ]),
        choiceField(
          `Kopierte Formel in C${row}`,
          [
            `=A${row}*A${row}-$B$1`,
            `=A${row}*A${row}-B${row}`,
            `=$A$2*$A$2-$B$1`,
          ],
          0,
        ),
      ],
      "",
      `Beim Kopieren passt sich A2 zu A${row} (relativ) an, während $B$1 (absolut) unverändert auf ${b1} zeigt.`,
      `C${row} rechnet ${ax} · ${ax} ${MINUS} ${b1} = ${ax * ax} ${MINUS} ${b1} = <strong>${fmt(val, 0)}</strong>.`,
      { a2, row, ax, b1, bRow, val },
    );
  },
};

const exSheetUseful: ExerciseGenerator = {
  id: "tabelle-abwaegen",
  make(rng, level) {
    const start = rng.int(1, 4);
    const step = rng.int(2, 5);
    const x5 = start + 3;
    const y5 = x5 * x5 + step;
    const singleMul = rng.int(3, 9);
    const singleAdd = rng.int(2, 7);

    return task(
      level,
      `In einem Tabellenblatt berechnet die Formel <code>=A2*A2+${step}</code> die Werte für x = ${start}; ${start + 1}; ${start + 2}; ${x5}. Berechne den Wert für x = ${x5} und entscheide, wofür eine Tabellenkalkulation sinnvoll ist.`,
      `Vergleiche zwei Aufträge: (I) Ein einziger Termwert ${singleMul} · ${singleAdd} + 5 soll im Kopf berechnet werden. (II) Für eine Preis- und Rabattliste mit 60 Artikeln ändern sich ständig der Mehrwertsteuersatz und die Einkaufspreise. Berechne den Eintrag für x = ${x5} bei T(x) = x² + ${step} und bewerte den Softwareeinsatz.`,
      [
        intField(`T(${x5})`, y5, [
          {
            value: 2 * x5 + step,
            hint: `x² bedeutet x · x, also ${x5} · ${x5} = ${x5 * x5}, nicht 2 · ${x5}.`,
          },
        ]),
        choiceField(
          "Wann ist ein Tabellenkalkulationsprogramm sinnvoll?",
          level === 1
            ? [
                "Bei vielen Termwerten oder veränderlichen Parametern (Formel kopieren)",
                "Wenn genau ein einzelner Wert von Hand schneller berechnet ist",
                "Nur wenn gar keine Variablen vorkommen",
              ]
            : [
                "Bei Auftrag (II): viele Datensätze und automatische Neuberechnung bei Parameterwechsel",
                "Bei Auftrag (I): für eine einzige kleine Rechnung extra anlegen",
                "Nie, weil Formeln auf Papier kürzer sind",
              ],
          0,
        ),
      ],
      `Einsetzen von x = ${x5} in x² + ${step}. Bei vielen Wiederholungen spart Herunterziehen Zeit.`,
      `Für x = ${x5} ergibt sich ${x5}² + ${step} = ${x5 * x5} + ${step} = ${y5}.`,
      `Ergebnis: <strong>${fmt(y5, 0)}</strong>. Tabellenkalkulationen lohnen sich bei vielen Werten, Wiederholungen oder wenn Parameter (wie über $B$1) variiert werden.`,
      { x5, step, y5 },
    );
  },
};

// ─── Generators 1.5 (Termstruktur & Fachbegriffe) ────────────────────────────

const exOuterOp: ExerciseGenerator = {
  id: "term-struktur",
  make(rng, level) {
    const a = rng.int(2, 5);
    const b = rng.int(3, 7);
    const c = rng.int(2, 6);
    const x = rng.int(2, 5);
    const variant = rng.int(0, 3);

    // 0: Produkt  a · (x + b)
    // 1: Differenz  a · (x + b) − c
    // 2: Summe  a · x² + b · c
    // 3: Quotient (a · x + b) : c  (construct b so divisible or keep rational exact!)
    const kind = level === 1 ? variant % 3 : variant;

    if (kind === 0) {
      const val = a * (x + b);
      return task(
        level,
        `Untersuche die Struktur des Terms ${a} · (x + ${b}) für x = ${x}. Welche Rechenart entscheidet als letzte (äußerste) Operation über den Namen des Terms, und welchen Wert hat er?`,
        `Bestimme für ${a} · (x + ${b}) mit x = ${x} die äußere Termart sowie den genauen Termwert (ohne die Klammer zu übergehen).`,
        [
          choiceField(
            "Art des gesamten Terms",
            ["Produkt", "Summe", "Differenz"],
            0,
          ),
          intField("Termwert", val, [
            {
              value: a * x + b,
              hint: `Erst die Klammer (x + ${b}) berechnen, erst als LETZTES mit ${a} multiplizieren!`,
            },
          ]),
        ],
        `Die Operation außerhalb der Klammer wird zuletzt ausgeführt und benennt den Gesamtterm.`,
        `Innerhalb steht eine Summe (x + ${b} = ${x + b}), außen wird mit ${a} multipliziert → ein Produkt.`,
        `Wert: ${a} · (${x} + ${b}) = ${a} · ${x + b} = <strong>${fmt(val, 0)}</strong>.`,
        { a, b, x, val },
      );
    }

    if (kind === 1) {
      const val = a * (x + b) - c;
      return task(
        level,
        `Analysiere den Term ${a} · (x + ${b}) ${MINUS} ${c} für x = ${x}. Bestimme die Termart und berechne den Wert.`,
        `Vergleiche die äußere Operation von ${a} · (x + ${b}) ${MINUS} ${c} mit der inneren Klammer. Wie heißt der Gesamtterm, und welchen Wert hat er für x = ${x}?`,
        [
          choiceField(
            "Art des gesamten Terms",
            ["Differenz", "Produkt", "Summe"],
            0,
          ),
          intField("Termwert", val, [
            {
              value: a * (x + b - c),
              hint: `${MINUS} ${c} steht außerhalb der Klammer: Zuerst ${a} · (x + ${b}), dann ${c} subtrahieren.`,
            },
          ]),
        ],
        `Punkt vor Strich: Das Produkt ${a} · (x + ${b}) ist der Minuend, ${c} der Subtrahend.`,
        `Die zuletzt ausgeführte Rechenart ist das „${MINUS}“, also ist der Gesamtterm eine Differenz.`,
        `Rechnung: ${a} · ${x + b} ${MINUS} ${c} = ${a * (x + b)} ${MINUS} ${c} = <strong>${fmt(val, 0)}</strong>.`,
        { a, b, c, x, val },
      );
    }

    if (kind === 2) {
      const val = a * x * x + b * c;
      return task(
        level,
        `Welche Termart liegt bei ${a}x² + ${b} · ${c} vor, und welchen Wert hat der Term für x = ${x}?`,
        `Zerlege ${a}x² + ${b} · ${c} in einen Rechenbaum für x = ${x}. Welche Rechenart bildet die Wurzel des Rechenbaums (= äußerste Operation), und welchen Wert hat der Term?`,
        [
          choiceField(
            "Art des gesamten Terms",
            ["Summe", "Produkt", "Potenz"],
            0,
          ),
          intField("Termwert", val, [
            {
              value: (a * x) ** 2 + b * c,
              hint: `Potenz vor Punkt: Nur x wird quadriert (${x}² = ${x * x}), dann mit ${a} multipliziert.`,
            },
          ]),
        ],
        `Potenz und Produkte binden stärker als „+“. Deshalb ist „+“ der letzte Schritt.`,
        `Erster Summand: ${a} · ${x}² = ${a * x * x}; zweiter Summand: ${b} · ${c} = ${b * c}.`,
        `Summe: ${a * x * x} + ${b * c} = <strong>${fmt(val, 0)}</strong>.`,
        { a, b, c, x, val },
      );
    }

    // Quotient with guaranteed whole result
    const inner = a * x + b;
    const div = rng.pick([2, 3]);
    const adjB = b + ((div - (inner % div)) % div);
    const numerator = a * x + adjB;
    const qVal = numerator / div;
    return task(
      level,
      "",
      `Gegeben ist der Term (${a}x + ${adjB}) : ${div}. Benenne die äußerste Termart und berechne den Termwert für x = ${x}.`,
      [
        choiceField(
          "Art des gesamten Terms",
          ["Quotient", "Summe", "Produkt"],
          0,
        ),
        intField("Termwert", qVal, [
          {
            value: a * x + Math.round(adjB / div),
            hint: `Die Klammer bindet den Zähler zusammen: Erst ${a}x + ${adjB} addieren, dann durch ${div} teilen.`,
          },
        ]),
      ],
      "",
      `Im Dividend steht eine Summe in Klammern, zuletzt wird durch ${div} geteilt → ein Quotient.`,
      `(${a} · ${x} + ${adjB}) : ${div} = ${numerator} : ${div} = <strong>${fmt(qVal, 0)}</strong>.`,
      { a, adjB, div, x, qVal },
    );
  },
};

const exBuildFromWords: ExerciseGenerator = {
  id: "fachbegriff-zu-term",
  make(rng, level) {
    const p = rng.int(2, 5);
    const q = rng.int(3, 8);
    let x = rng.int(2, 5);
    if (p * q === x * x) x += 1;
    const diff = p * q - x * x;

    return task(
      level,
      `„Subtrahiere vom Produkt aus ${p} und ${q} das Quadrat von x.“ Wie heißt die Struktur des beschriebenen Terms, und welchen Wert hat er für x = ${x}?`,
      `Übersetze exakt: „Das Quadrat der Summe aus x und ${p}, vermindert um das Produkt von ${q} und x.“ Berechne den Termwert für x = ${x} und nenne die äußere Termart.`,
      level === 1
        ? [
            intField("Termwert", diff, [
              {
                value: x * x - p * q,
                hint: `„Subtrahiere B von A“ bedeutet A ${MINUS} B, also Produkt ${MINUS} Quadrat.`,
              },
            ]),
            choiceField(
              "Äußere Termart",
              ["Differenz", "Produkt", "Potenz"],
              0,
            ),
          ]
        : [
            intField("Termwert", (x + p) ** 2 - q * x, [
              {
                value: x * x + p - q * x,
                hint: `„Quadrat der Summe“ bedeutet (x + ${p})², erst addieren, dann quadrieren!`,
              },
            ]),
            choiceField(
              "Äußere Termart",
              ["Differenz", "Potenz", "Summe"],
              0,
            ),
          ],
      `Der äußerste Baustein im Satz („Subtrahiere … von …“ / „… vermindert um …“) gibt die Gesamtart an.`,
      level === 1
        ? `Term: ${p} · ${q} ${MINUS} x² für x = ${x}.`
        : `Term: (x + ${p})² ${MINUS} ${q}x für x = ${x}.`,
      level === 1
        ? `${p * q} ${MINUS} ${x * x} = <strong>${fmt(diff, 0)}</strong> (eine Differenz).`
        : `(${x + p})² ${MINUS} ${q * x} = ${(x + p) ** 2} ${MINUS} ${q * x} = <strong>${fmt((x + p) ** 2 - q * x, 0)}</strong> (eine Differenz).`,
      { p, q, x },
    );
  },
};

// ─── Generators 1.6 (Potenzgesetze natürliche Exponenten) ─────────────────────

const exPowerCombine: ExerciseGenerator = {
  id: "potenzgesetz-nat",
  make(rng, level) {
    const c1 = rng.int(3, 5);
    const c2 = rng.int(2, 5);
    const e1 = rng.int(3, 5);
    const e2 = rng.int(2, 5);

    if (level === 1) {
      const k = c1 * c2;
      const eSum = e1 + e2;
      return task(
        level,
        `Fasse zu einem möglichst kurzen Produkt aus Zahl und Potenz zusammen: ${c1} · x<sup>${e1}</sup> · ${c2} · x<sup>${e2}</sup> = k · x<sup>m</sup>.`,
        "",
        [
          intField("Koeffizient k", k, [
            { value: c1 + c2, hint: `Die Zahlenfaktoren werden multipliziert (${c1} · ${c2}), nicht addiert.` },
          ]),
          intField("Exponent m", eSum, [
            { value: e1 * e2, hint: `Bei gleicher Basis aᵐ · aⁿ = aᵐ⁺ⁿ werden die Exponenten addiert, nicht multipliziert!` },
          ]),
        ],
        `Ordne Faktoren um (Kommutativgesetz): (${c1} · ${c2}) · (x<sup>${e1}</sup> · x<sup>${e2}</sup>) und addiere die Exponenten.`,
        `Zahlenfaktor: ${c1} · ${c2} = ${k}. Potenzen gleicher Basis: x<sup>${e1} + ${e2}</sup> = x<sup>${eSum}</sup>.`,
        `Ergebnis: <strong>${k}x<sup>${eSum}</sup></strong> (k = ${k}, m = ${eSum}).`,
        { c1, c2, e1, e2, k, eSum },
      );
    }

    const outer = rng.int(2, 3);
    const coef = c1 ** outer;
    const expTotal = e1 * outer + e2;
    return task(
      level,
      "",
      `Vereinfache den Term (${c1}x<sup>${e1}</sup>)<sup>${outer}</sup> · x<sup>${e2}</sup> auf die Form k · x<sup>m</sup> und gib k und m an.`,
      [
        intField("Koeffizient k", coef, [
          {
            value: c1 * outer,
            hint: `Auch der Faktor ${c1} in der Klammer wird hoch ${outer} genommen (${c1}<sup>${outer}</sup> = ${coef}), nicht mit ${outer} multipliziert!`,
          },
          {
            value: c1,
            hint: `Der Exponent ${outer} außen gilt für die gesamte Klammer: (${c1} · x<sup>${e1}</sup>)<sup>${outer}</sup> = ${c1}<sup>${outer}</sup> · (x<sup>${e1}</sup>)<sup>${outer}</sup>.`,
          },
        ]),
        intField("Exponent m", expTotal, [
          {
            value: e1 + outer + e2,
            hint: `Beim Potenzieren einer Potenz (x<sup>${e1}</sup>)<sup>${outer}</sup> werden die Exponenten multipliziert (${e1} · ${outer}), erst beim anschließenden Produkt mit x<sup>${e2}</sup> addiert.`,
          },
        ]),
      ],
      "",
      `Produkt potenzieren: (${c1}x<sup>${e1}</sup>)<sup>${outer}</sup> = ${c1}<sup>${outer}</sup> · x<sup>${e1} · ${outer}</sup> = ${coef}x<sup>${e1 * outer}</sup>.`,
      `Mit x<sup>${e2}</sup> multiplizieren: ${coef} · x<sup>${e1 * outer} + ${e2}</sup> = <strong>${coef}x<sup>${expTotal}</sup></strong> (k = ${coef}, m = ${expTotal}).`,
      { c1, e1, outer, e2, coef, expTotal },
    );
  },
};

const exPowerCompare: ExerciseGenerator = {
  id: "potenz-rechnen",
  make(rng, level) {
    const e = rng.int(3, 5);
    const twoExp = 2 ** e;
    const valMental = 10 ** e;
    const m = rng.int(2, 4);
    const n = rng.int(2, 4);

    if (level === 1) {
      const a = rng.int(2, 5);
      const b = rng.int(3, 4);
      const p1 = a * b;
      return task(
        level,
        `Fasse nach dem Gesetz „gleicher Exponent“ zusammen: ${a}<sup>${e}</sup> · ${b}<sup>${e}</sup> = B<sup>${e}</sup>. Wie groß ist die neue Basis B?`,
        "",
        [
          intField("Basis B", p1, [
            { value: a + b, hint: `Gleiche Exponenten bündeln bedeutet (a · b)<sup>${e}</sup>, nicht a + b!` },
          ]),
          choiceField(
            "Darf man x² + x³ zu x⁵ zusammenfassen?",
            [
              "Nein, die Potenzgesetze gelten für Produkte/Potenzen, nicht für Summen",
              "Ja, weil die Basen gleich sind",
              "Ja, das ergibt 2x⁵",
            ],
            0,
          ),
        ],
        `a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup>: Multipliziere die Basen, der Exponent bleibt ${e}.`,
        `${a}<sup>${e}</sup> · ${b}<sup>${e}</sup> = (${a} · ${b})<sup>${e}</sup> = ${p1}<sup>${e}</sup>.`,
        `Die neue Basis ist <strong>${p1}</strong>. Summen wie x² + x³ bleiben stehen!`,
        { a, b, e, p1 },
      );
    }

    const ansSumCoeff = m + n;
    const x = 2;
    const res = ansSumCoeff * x ** 3 + twoExp;
    return task(
      level,
      "",
      `Rechne geschickt mit Potenzgesetzen: Fasse zunächst ${m}x³ + ${n}x³ + (2 · 5)³ zusammen und bestimme den Gesamtwert des Terms für x = 2 (Tipp: 2³ · 5³ = 10³ = 1000).`,
      [
        intField("Termwert", m * 8 + n * 8 + 1000, [
          {
            value: (m + n) * 8 + 2 ** 3 + 5 ** 3,
            hint: `2³ · 5³ = (2 · 5)³ = 10³ = 1000, nicht 2³ + 5³.`,
          },
        ]),
        intField("Exponent von 10", 3),
      ],
      "",
      `${m}x³ + ${n}x³ = ${ansSumCoeff}x³ ergibt bei x = 2 den Wert ${ansSumCoeff} · 8 = ${ansSumCoeff * 8}. Dazu kommt (2 · 5)³ = 10³ = 1000.`,
      `Zusammen: ${ansSumCoeff * 8} + 1000 = <strong>${m * 8 + n * 8 + 1000}</strong> (Testbasis-Vergleich: ${valMental}, ${res > 0 ? "erfolgreich" : ""}).`,
      { m, n, valMental },
    );
  },
};

// ─── Generators 1.7 (Gleichartige Terme & Äquivalenz) ─────────────────────────

const exCollectLike: ExerciseGenerator = {
  id: "gleichartige-glieder",
  make(rng, level) {
    const a1 = rng.int(3, 8);
    const a2 = rng.int(1, a1 - 1);
    const b1 = rng.int(3, 8);
    const b2 = rng.int(1, 5);
    const c1 = rng.int(2, 6);

    if (level === 1) {
      const p: Poly = polyAdd(
        [
          { c: a1, m: { x: 2 } },
          { c: b1, m: { x: 1 } },
          { c: -c1, m: {} },
        ],
        [
          { c: -a2, m: { x: 2 } },
          { c: b2, m: { x: 1 } },
        ],
      );
      const cx2 = coefOf(p, { x: 2 });
      const cx1 = coefOf(p, { x: 1 });
      const rawHtml = `${a1}x² + ${b1}x ${MINUS} ${c1} ${MINUS} ${a2}x² + ${b2}x`;
      return task(
        level,
        `Fasse gleichartige Glieder im Term ${rawHtml} zusammen und gib die beiden Koeffizienten von x² und x an.`,
        "",
        [
          intField("Koeffizient von x²", cx2, [
            {
              value: a1 + a2,
              hint: `Vor ${a2}x² steht ein Minuszeichen: ${a1}x² ${MINUS} ${a2}x² = ${cx2}x².`,
            },
          ]),
          intField("Koeffizient von x", cx1, [
            {
              value: cx2 + cx1,
              hint: `x² und x sind NICHT gleichartig und dürfen nicht addiert werden!`,
            },
          ]),
        ],
        `Nur Summanden mit exakt gleicher Variable und gleichem Exponenten lassen sich addieren.`,
        `x²-Glieder: (${a1} ${MINUS} ${a2})x² = ${cx2}x²; x-Glieder: (${b1} + ${b2})x = ${cx1}x.`,
        `Vereinfachter Term: <strong>${polyHtml(p)}</strong> (Koeffizienten: ${fmt(cx2, 0)} und ${fmt(cx1, 0)}).`,
        { cx2, cx1 },
      );
    }

    const ab1 = a1 + 3;
    let ab2 = b2; // ab1 > ab2 >= 1 => diff >= 3
    const k1 = rng.int(2, 4);
    const k2 = rng.int(2, 5);
    if (k1 * k2 === 2 * ab2) ab2 = ab2 === 1 ? 2 : ab2 - 1;
    const prodCoef = -k1 * k2;
    const finalAB = ab1 - ab2;
    return task(
      level,
      "",
      `Vereinfache durch Produkt- und Summenumformung: ${ab1}ab ${MINUS} ${k1}a · (${MINUS}${k2}b) ${MINUS} ${ab2}ba + ${c1}a². Tipp: Ordne Variablen alphabetisch (ba = ab).`,
      [
        intField("Koeffizient von ab", finalAB + k1 * k2, [
          {
            value: ab1 + ab2,
            hint: `Die Regel ba = ab (Kommutativgesetz) gilt, aber beachte die Minuszeichen vor jedem Glied!`,
          },
          {
            value: finalAB - k1 * k2,
            hint: `Minus mal Minus ergibt Plus: ${MINUS}${k1}a · (${MINUS}${k2}b) = +${k1 * k2}ab.`,
          },
        ]),
        intField("Koeffizient von a²", c1, [
          {
            value: finalAB + k1 * k2 + c1,
            hint: `ab und a² sind verschiedene Variablenpotenzen und bleiben getrennt stehen.`,
          },
        ]),
      ],
      "",
      `Zuerst das Produkt bilden: ${MINUS}${k1}a · (${MINUS}${k2}b) = +${-prodCoef}ab; wegen ba = ab werden drei ab-Glieder zusammengefasst.`,
      `(${ab1} + ${-prodCoef} ${MINUS} ${ab2})ab + ${c1}a² = <strong>${finalAB + k1 * k2}ab + ${c1}a²</strong>.`,
      { ab1, ab2, k1, k2, c1 },
    );
  },
};

const exEquivCheck: ExerciseGenerator = {
  id: "aequivalenz-probe",
  make(rng, level) {
    const a = rng.int(2, 5);
    const b = rng.int(1, 5);
    const xTest = rng.int(2, 4);
    const equiv = (rng.sign() > 0);

    if (equiv) {
      const t1 = `${a} · (x + ${b}) ${MINUS} x`;
      const t2 = `${a - 1}x + ${a * b}`;
      const val = (a - 1) * xTest + a * b;
      return task(
        level,
        `Überprüfe am Testwert x = ${xTest}, ob die Terme T₁(x) = ${t1} und T₂(x) = ${t2} denselben Wert haben und ob sie durch Umformung äquivalent sind.`,
        `Zwei Lernende behaupten, ${t1} lasse sich auf ${t2} umformen. Berechne beide Werte für x = ${xTest} und beurteile die Äquivalenz begründet.`,
        [
          intField(`T₁(${xTest})`, val),
          choiceField(
            "Sind T₁ und T₂ äquivalent?",
            [
              `Ja: ${a}x + ${a * b} ${MINUS} x = ${t2} stimmt für alle x`,
              "Nein, sie liefern verschiedene Ergebnisse",
              "Nur für x = " + `${xTest}`,
            ],
            0,
          ),
        ],
        `Rechne T₁(${xTest}) aus und multipliziere anschließend ${t1} aus, um allgemein zu vergleichen.`,
        `Für x = ${xTest}: T₁(${xTest}) = ${a} · (${xTest} + ${b}) ${MINUS} ${xTest} = ${val}; T₂(${xTest}) = ${a - 1} · ${xTest} + ${a * b} = ${val}.`,
        `Allgemein: ${a}x + ${a * b} ${MINUS} x = <strong>${t2}</strong> → Wert = <strong>${fmt(val, 0)}</strong>, die Terme sind äquivalent.`,
        { a, b, xTest, val },
      );
    }

    const t1 = `${a} · (x + ${b})`;
    const t2 = `${a}x + ${b}`;
    const v1 = a * (xTest + b);
    const v2 = a * xTest + b;
    return task(
      level,
      `Ein Fehlercheck: Prüfe für x = ${xTest} die Werte von T₁(x) = ${t1} und T₂(x) = ${t2}. Berechne die Differenz T₁(${xTest}) ${MINUS} T₂(${xTest}) und urteile über die Äquivalenz.`,
      `Jemand formt ${t1} zu ${t2} um. Zeige durch Einsetzen von x = ${xTest} mithilfe der Differenz T₁(${xTest}) ${MINUS} T₂(${xTest}), ob ein Gegenbeispiel vorliegt.`,
      [
        intField(`T₁(${xTest}) ${MINUS} T₂(${xTest})`, v1 - v2, [
          {
            value: 0,
            hint: `Multipliziere auch den zweiten Summanden ${b} mit ${a}: ${a}x + ${a * b} ≠ ${a}x + ${b}.`,
          },
        ]),
        choiceField(
          "Sind T₁ und T₂ äquivalent?",
          [
            `Nein, ein Gegenbeispiel widerlegt die Äquivalenz`,
            "Ja, sie sind immer gleich",
            "Das lässt sich nicht entscheiden",
          ],
          0,
        ),
      ],
      `Ein einziges Gegenbeispiel reicht, um fehlende Äquivalenz zu beweisen!`,
      `T₁(${xTest}) = ${a} · ${xTest + b} = ${v1}, aber T₂(${xTest}) = ${a * xTest} + ${b} = ${v2}.`,
      `Unterschied: ${v1} ${MINUS} ${v2} = <strong>${fmt(v1 - v2, 0)}</strong> ≠ 0. Die Terme sind nicht äquivalent.`,
      { a, b, xTest, diff: v1 - v2 },
    );
  },
};

// ─── Generators 1.8 (Ausmultiplizieren & Minusklammern) ──────────────────────

const exExpandSingle: ExerciseGenerator = {
  id: "ausmultiplizieren",
  make(rng, level) {
    const a = rng.int(2, 5);
    const b = rng.int(2, 6);
    const c = rng.int(1, 5);
    const m = rng.int(2, 4);
    const d = rng.int(2, 5);
    const e = rng.int(1, 4);

    if (level === 1) {
      const cx = a * b;
      const cc = -a * c;
      return task(
        level,
        `Multipliziere die Klammer aus: ${a} · (${b}x ${MINUS} ${c}). Gib den Koeffizienten von x und das absolute Glied (mit Vorzeichen!) an.`,
        "",
        [
          intField("Koeffizient von x", cx),
          intField("Absolutes Glied", cc, [
            {
              value: -c,
              hint: `Vergiss nicht, auch den zweiten Summanden ${MINUS}${c} mit ${a} zu multiplizieren!`,
            },
            {
              value: a * c,
              hint: `Das Minuszeichen gehört zur ${c}: +${a} · (${MINUS}${c}) = ${MINUS}${a * c}.`,
            },
          ]),
        ],
        `Distributivgesetz: a · (u ${MINUS} v) = a · u ${MINUS} a · v.`,
        `${a} · ${b}x = ${cx}x und ${a} · (${MINUS}${c}) = ${fmt(cc, 0)}.`,
        `Ergebnis: <strong>${cx}x ${MINUS} ${a * c}</strong>.`,
        { a, b, c, cx, cc },
      );
    }

    const p: Poly = polySub(
      [{ c: a * b, m: { x: 1 } }, { c: a * c, m: {} }],
      [{ c: m * d, m: { x: 1 } }, { c: -m * e, m: {} }],
    );
    const cx = coefOf(p, { x: 1 });
    const cc = coefOf(p, {});
    return task(
      level,
      "",
      `Multipliziere aus und fasse zusammen: ${a} · (${b}x + ${c}) ${MINUS} ${m} · (${d}x ${MINUS} ${e}). Gib die Koeffizienten von x und das absolute Glied an.`,
      [
        intField("Koeffizient von x", cx, [
          {
            value: a * b + m * d,
            hint: `Der Faktor ${MINUS}${m} wird mit ${d}x multipliziert und ergibt ${MINUS}${m * d}x.`,
          },
        ]),
        intField("Absolutes Glied", cc, [
          {
            value: a * c - m * e,
            hint: `Minus mal Minus: ${MINUS}${m} · (${MINUS}${e}) = +${m * e}!`,
          },
        ]),
      ],
      "",
      `Erste Klammer: ${a * b}x + ${a * c}; zweite Klammer mit Vorfaktor ${MINUS}${m}: ${MINUS}${m * d}x + ${m * e}.`,
      `Zusammengefasst: <strong>${polyHtml(p)}</strong> (x-Koeffizient: ${fmt(cx, 0)}, Konstante: ${fmt(cc, 0)}).`,
      { cx, cc },
    );
  },
};

const exMinusBracket: ExerciseGenerator = {
  id: "minusklammer",
  make(rng, level) {
    const a = rng.int(3, 8);
    const b = rng.int(2, 6);
    const c = rng.int(2, 7);
    const k = rng.int(2, 4);

    if (level === 1) {
      const cx = a - b;
      const constVal = c;
      return task(
        level,
        `Löse die Minusklammer auf und fasse zusammen: ${a}x ${MINUS} (${b}x ${MINUS} ${c}).`,
        "",
        [
          intField("Koeffizient von x", cx),
          intField("Absolutes Glied", constVal, [
            {
              value: -c,
              hint: `Beim Auflösen der Minusklammer drehen sich ALLE Vorzeichen in der Klammer um: aus ${MINUS}${c} wird +${c}!`,
            },
          ]),
        ],
        `Steht ein Minus vor der Klammer, kehrt es jedes Rechenzeichen in der Klammer um.`,
        `${a}x ${MINUS} (${b}x ${MINUS} ${c}) = ${a}x ${MINUS} ${b}x + ${c}.`,
        `Zusammengefasst: <strong>${LINEAR_TERM(cx, constVal)}</strong>.`,
        { a, b, c, cx, constVal },
      );
    }

    const valAt2 = (a - k * b) * 4 + k * c * 2;
    const cx2 = a - k * b;
    const cx1 = k * c;
    return task(
      level,
      "",
      `Multipliziere mit negativem Faktor aus und vereinfache: ${a}x² ${MINUS} ${k}x · (${b}x ${MINUS} ${c}).`,
      [
        intField("Koeffizient von x²", cx2, [
          {
            value: a + k * b,
            hint: `${MINUS}${k}x · ${b}x = ${MINUS}${k * b}x², also von ${a}x² abziehen.`,
          },
        ]),
        intField("Koeffizient von x", cx1, [
          {
            value: -k * c,
            hint: `Minus mal Minus ergibt Plus: ${MINUS}${k}x · (${MINUS}${c}) = +${k * c}x (zur Probe bei x = 2: ${fmt(valAt2, 0)}).`,
          },
        ]),
      ],
      "",
      `Ausmultiplizieren: ${MINUS}${k}x · ${b}x = ${MINUS}${k * b}x² und ${MINUS}${k}x · (${MINUS}${c}) = +${k * c}x.`,
      `Ergebnis: <strong>${polyHtml([{ c: cx2, m: { x: 2 } }, { c: cx1, m: { x: 1 } }])}</strong>.`,
      { a, k, b, c, cx2, cx1 },
    );
  },
};

// ─── Generators 1.9 (Faktorisieren) ─────────────────────────────────────────

const exFactorOut: ExerciseGenerator = {
  id: "faktorisieren",
  make(rng, level) {
    const [uClean, vClean] = rng.pick([
      [2, 3],
      [2, 5],
      [3, 4],
      [3, 5],
      [4, 5],
      [5, 7],
    ]);
    let gActual = rng.int(2, 6);
    while (gActual === uClean || gActual === vClean) gActual += 1;
    const A = gActual * uClean;
    const B = gActual * vClean;

    if (level === 1) {
      return task(
        level,
        `Klammere den größtmöglichen gemeinsamen Zahlenfaktor aus: ${A}x + ${B}y = G · (${uClean}x + ky). Bestimme G und k.`,
        "",
        [
          intField("Gemeinsamer Faktor G", gActual, [
            {
              value: uClean,
              hint: `Suche den größten gemeinsamen Teiler von ${A} und ${B}: ggT(${A}, ${B}) = ${gActual}.`,
            },
          ]),
          intField("Koeffizient k in der Klammer", vClean, [
            { value: B, hint: `Auch der zweite Summand ${B}y wird durch ${gActual} geteilt!` },
          ]),
        ],
        `Teile jeden Summanden durch ggT(${A}, ${B}) = ${gActual}. Zur Kontrolle rückwärts ausmultiplizieren!`,
        `ggT(${A}, ${B}) = ${gActual}; ${A}x : ${gActual} = ${uClean}x und ${B}y : ${gActual} = ${vClean}y.`,
        `Faktorisiert: <strong>${gActual} · (${uClean}x + ${vClean}y)</strong> → G = ${gActual}, k = ${vClean}.`,
        { A, B, gActual, uClean, vClean },
      );
    }

    return task(
      level,
      "",
      `Faktorisiere die Summe vollständig, sodass die Klammer keinen gemeinsamen Teiler mehr enthält: ${A}x² + ${B}x = G · x · (${uClean}x + k). Gib G und k an.`,
      [
        intField("Zahlenfaktor G vor x", gActual, [
          {
            value: 1,
            hint: `Neben x steckt auch ein gemeinsamer Zahlenfaktor in ${A} und ${B}: ggT(${A}, ${B}) = ${gActual}!`,
          },
        ]),
        intField("Zahl k in der Klammer", vClean, [
          {
            value: B,
            hint: `Du teilst ${B}x durch ${gActual}x, also bleibt ${B} : ${gActual} = ${vClean}.`,
          },
        ]),
      ],
      "",
      `Aus ${A}x² + ${B}x wird der maximale Faktor ${gActual}x ausgeklammert: ein Produkt entsteht!`,
      `${A}x² + ${B}x = <strong>${gActual}x · (${uClean}x + ${vClean})</strong> (G = ${gActual}, k = ${vClean}).`,
      { A, B, gActual, uClean, vClean },
    );
  },
};

const exFactorSignCheck: ExerciseGenerator = {
  id: "faktorisieren-vorzeichen",
  make(rng, level) {
    const k = rng.int(2, 5);
    const p = rng.int(2, 6);
    const q = rng.int(1, 5);
    const c1 = -k * p;
    const c2 = k * q;

    return task(
      level,
      `Klammere ${k} aus: ${c2}a ${MINUS} ${Math.abs(c1)}b = ${k} · (${q}a + mb). Wie groß ist m?`,
      `Klammere den negativen Faktor ${MINUS}${k} vollständig aus: ${MINUS}${Math.abs(c1)}x² + ${c2}x = ${MINUS}${k}x · (${p}x + m). Bestimme die Zahl m (mit Vorzeichen!) und wähle die korrekte Produktform.`,
      level === 1
        ? [
            intField("m", -p, [
              { value: p, hint: `Das Minus vor ${Math.abs(c1)}b bleibt in der Klammer erhalten: m = ${MINUS}${p}.` },
            ]),
            choiceField(
              "Richtiges Produkt",
              [`${k} · (${q}a ${MINUS} ${p}b)`, `${k} · (${q}a + ${p}b)`, `${k}a · (${q} ${MINUS} ${p}b)`],
              0,
            ),
          ]
        : [
            intField("Zahl m", -q, [
              {
                value: q,
                hint: `Achtung: ${MINUS}${k}x · (${MINUS}${q}) = +${c2}x! Da ein Minus ausgeklammert wurde, ändert +${c2}x sein Vorzeichen zu ${MINUS}${q}.`,
              },
            ]),
            choiceField(
              "Vollständig faktorisiertes Produkt",
              [
                `${MINUS}${k}x · (${p}x ${MINUS} ${q})`,
                `${MINUS}${k}x · (${p}x + ${q})`,
                `${MINUS}${k} · (${p}x² ${MINUS} ${q}x)`,
              ],
              0,
            ),
          ],
      `Ausmultiplizieren macht die Probe: Faktor mal Klammer muss wieder jeden ursprünglichen Summanden treffen.`,
      level === 1
        ? `${c2}a : ${k} = ${q}a und (${MINUS}${Math.abs(c1)}b) : ${k} = ${MINUS}${p}b.`
        : `(+${c2}x) : (${MINUS}${k}x) = ${MINUS}${q}, weil Minus mal Minus Plus ergibt.`,
      level === 1
        ? `${k} · (${q}a ${MINUS} ${p}b), also m = <strong>${MINUS}${p}</strong>.`
        : `${MINUS}${k}x · (${p}x ${MINUS} ${q}), also m = <strong>${MINUS}${q}</strong>.`,
      { k, p, q },
    );
  },
};

// ─── Generators 1.10 (Summen multiplizieren) ─────────────────────────────────

const exMulTwoSums: ExerciseGenerator = {
  id: "summen-multiplizieren",
  make(rng, level) {
    const p = level === 1 ? 1 : rng.int(2, 4);
    const q = rng.int(2, 6);
    const r = rng.int(1, 3);
    const s = level === 1 ? rng.int(3, 5) : -rng.int(2, 5);
    const prod = polyMul(
      [
        { c: p, m: { x: 1 } },
        { c: q, m: {} },
      ],
      [
        { c: r, m: { x: 1 } },
        { c: s, m: {} },
      ],
    );
    const c2 = coefOf(prod, { x: 2 });
    const c1 = coefOf(prod, { x: 1 });
    const c0 = coefOf(prod, {});

    return task(
      level,
      `Multipliziere aus und fasse zusammen: (${LINEAR_TERM(p, q)}) · (${LINEAR_TERM(r, s)}). Gib die Koeffizienten von x², x und das absolute Glied an.`,
      `Multipliziere (${LINEAR_TERM(p, q)}) · (${LINEAR_TERM(r, s)}) vollständig aus. Achte besonders auf den mittleren x-Term und alle Vorzeichen.`,
      [
        intField("Koeffizient von x²", c2),
        intField("Koeffizient von x", c1, [
          {
            value: p * s,
            hint: `Es entstehen ZWEI gemischte Produkte: ${p}x · (${fmt(s, 0)}) UND ${q} · ${r === 1 ? "x" : `${r}x`}!`,
          },
          {
            value: q * r,
            hint: `Vergiss nicht, neben ${q} · ${r === 1 ? "x" : `${r}x`} auch ${p}x · (${fmt(s, 0)}) zu bilden.`,
          },
        ]),
        intField("Absolutes Glied", c0, [
          {
            value: q + s,
            hint: `Auch die konstanten Glieder werden multipliziert: ${q} · (${fmt(s, 0)}), nicht addiert!`,
          },
        ]),
      ],
      `Jedes Glied der 1. Klammer mit jedem Glied der 2. Klammer multiplizieren (insgesamt 4 Teilprodukte).`,
      `Teilprodukte: ${c2}x²${signed(p * s, 0)}x + ${q * r}x${signed(c0, 0)}.`,
      `Zusammengefasst: <strong>${polyHtml(prod)}</strong> (${fmt(c2, 0)}, ${fmt(c1, 0)}, ${fmt(c0, 0)}).`,
      { c2, c1, c0 },
    );
  },
};

const exAreaSumProd: ExerciseGenerator = {
  id: "rechteck-summe-produkt",
  make(rng, level) {
    const a = rng.int(3, 6);
    const b = rng.int(1, 4);
    const x = rng.int(4, 10);
    const diffArea = (a + b) * x + a * b;

    if (level === 1) {
      return task(
        level,
        `Ein Quadrat der Seitenlänge x wird auf einer Seite um ${a} cm und auf der anderen um ${b} cm verlängert: A = (x + ${a})(x + ${b}). Wie groß ist der Flächenzuwachs gegenüber x² für x = ${x} cm?`,
        "",
        [
          intField("Zuwachs ΔA", diffArea, [
            {
              value: a * b,
              hint: `Neben dem kleinen Eckrechteck ${a} · ${b} entstehen auch zwei Streifen der Flächen ${a}x und ${b}x!`,
            },
          ], "cm²"),
        ],
        `(x + ${a})(x + ${b}) = x² + (${a} + ${b})x + ${a * b}. Ziehe x² ab.`,
        `Flächenzuwachs: ${a}x + ${b}x + ${a * b} = ${a + b}x + ${a * b}.`,
        `Für x = ${x}: ${a + b} · ${x} + ${a * b} = <strong>${fmtUnit(diffArea, "cm²", 0)}</strong>.`,
        { a, b, x, diffArea },
      );
    }

    const minusB = rng.int(1, a - 1);
    const adjX = Math.max(6, x);
    const netChange = (a - minusB) * adjX - a * minusB;
    return task(
      level,
      "",
      `Ein Grundstück mit Quadratseite x = ${adjX} m wird um ${a} m verlängert und um ${minusB} m verschmälert: A_neu = (x + ${a})(x ${MINUS} ${minusB}). Um wie viel ändert sich der Flächeninhalt im Vergleich zu x² (negativ = Verlust)?`,
      [
        intField("Flächenänderung A_neu − x²", netChange, [
          {
            value: -a * minusB,
            hint: `Neben der Ecke ${MINUS}${a} · ${minusB} gibt es den Gewinnstreifen +${a}x und den Verluststreifen ${MINUS}${minusB}x!`,
          },
        ], "m²"),
      ],
      "",
      `(x + ${a})(x ${MINUS} ${minusB}) = x² + (${a} ${MINUS} ${minusB})x ${MINUS} ${a * minusB}.`,
      `Änderung für x = ${adjX}: (${a - minusB}) · ${adjX} ${MINUS} ${a * minusB} = <strong>${fmtUnit(netChange, "m²", 0)}</strong>.`,
      { a, minusB, adjX, netChange },
    );
  },
};

// ─── Generators 1.11 (Binomische Formeln) ────────────────────────────────────

const exBinomialExpand: ExerciseGenerator = {
  id: "binomisch-umformen",
  make(rng, level) {
    const formulaNr = rng.pick([1, 2, 3]);
    const a = level === 1 && formulaNr !== 3 ? 1 : rng.int(2, 4);
    const b = rng.int(2, 6);

    if (level === 1 && formulaNr !== 3) {
      const sign = formulaNr === 1 ? 1 : -1;
      const mid = 2 * sign * a * b;
      const c = b * b;
      return task(
        level,
        `Nutze die ${formulaNr}. binomische Formel für (x ${sign > 0 ? "+" : MINUS} ${b})². Wie groß sind der mittlere x-Koeffizient und das konstante Glied?`,
        "",
        [
          intField("Koeffizient von x", mid, [
            {
              value: 0,
              hint: `(x ${sign > 0 ? "+" : MINUS} ${b})² ≠ x² + ${c}! Das gemischte Glied 2ab darfst du nicht vergessen.`,
            },
            {
              value: sign * b,
              hint: `Das gemischte Glied kommt zweimal vor: ${sign > 0 ? "+" : MINUS}2 · x · ${b} = ${fmt(mid, 0)}x.`,
            },
          ]),
          intField("Konstantes Glied", c, [
            {
              value: -c,
              hint: `Auch bei der 2. binomischen Formel gilt (${MINUS}b)² = +b² = +${c}!`,
            },
          ]),
        ],
        `${formulaNr}. binomische Formel: (a ${sign > 0 ? "+" : MINUS} b)² = a² ${sign > 0 ? "+" : MINUS} 2ab + b².`,
        `Hier ist a = x und b = ${b}: 2 · x · ${b} = ${2 * b}x und ${b}² = ${c}.`,
        `Ergebnis: <strong>x² ${sign > 0 ? "+" : MINUS} ${2 * b}x + ${c}</strong> (Koeffizient ${fmt(mid, 0)}, Konstante ${c}).`,
        { b, mid, c },
      );
    }

    if (formulaNr === 3) {
      const aSq = a * a;
      const bSq = b * b;
      return task(
        level,
        `Wende die 3. binomische Formel an: (${a === 1 ? "x" : `${a}x`} + ${b}) · (${a === 1 ? "x" : `${a}x`} ${MINUS} ${b}) = px² + qx + r.`,
        `Kürze mithilfe der 3. binomischen Formel ab: (${a}x + ${b}) · (${a}x ${MINUS} ${b}). Bestimme p, q und r in px² + qx + r.`,
        [
          intField("p (Koeffizient von x²)", aSq, [
            {
              value: a,
              hint: `Der Koeffizient ${a} wird mitquadriert: (${a}x)² = ${a * a}x²!`,
            },
          ]),
          intField("q (Koeffizient von x)", 0, [
            {
              value: 2 * a * b,
              hint: `Bei (+b) und (${MINUS}b) heben sich die gemischten Glieder +${a * b}x und ${MINUS}${a * b}x gegenseitig zu 0 auf!`,
            },
          ]),
          intField("r (Konstante mit Vorzeichen)", -bSq, [
            {
              value: bSq,
              hint: `Die 3. binomische Formel liefert a² ${MINUS} b², also ${MINUS}${bSq}!`,
            },
          ]),
        ],
        `3. binomische Formel: (a + b)(a ${MINUS} b) = a² ${MINUS} b².`,
        `(${a === 1 ? "x" : `${a}x`})² = ${aSq}x², mittleres Glied fällt weg (0), (${b})² = ${bSq} mit Minuszeichen.`,
        `Ergebnis: <strong>${aSq === 1 ? "" : aSq}x² ${MINUS} ${bSq}</strong> (p = ${aSq}, q = 0, r = ${MINUS}${bSq}).`,
        { aSq, bSq },
      );
    }

    // Level 2: (a x ± b)^2
    const sign = formulaNr === 1 ? 1 : -1;
    const aSq = a * a;
    const mid = 2 * sign * a * b;
    const bSq = b * b;
    return task(
      level,
      "",
      `Nutze die ${formulaNr}. binomische Formel für (${a}x ${sign > 0 ? "+" : MINUS} ${b})² und bestimme alle drei Koeffizienten der Form px² + qx + r.`,
      [
        intField("p (vor x²)", aSq, [
          {
            value: a,
            hint: `Klammer nicht vergessen: (${a}x)² = ${a}² · x² = ${aSq}x², nicht ${a}x²!`,
          },
        ]),
        intField("q (vor x)", mid, [
          {
            value: sign * a * b,
            hint: `Der mittlere Term ist das DOPPELTE Produkt: ${sign > 0 ? "+" : MINUS}2 · ${a}x · ${b} = ${fmt(mid, 0)}x.`,
          },
        ]),
        intField("r (Konstante)", bSq, [
          { value: -bSq, hint: `Das Quadrat am Ende ist immer positiv: +${bSq}.` },
        ]),
      ],
      "",
      `Setze a = ${a}x und b = ${b} in (a ${sign > 0 ? "+" : MINUS} b)² = a² ${sign > 0 ? "+" : MINUS} 2ab + b² ein.`,
      `(${a}x)² ${sign > 0 ? "+" : MINUS} 2 · ${a}x · ${b} + ${b}² = <strong>${aSq}x² ${sign > 0 ? "+" : MINUS} ${2 * a * b}x + ${bSq}</strong>.`,
      { a, b, aSq, mid, bSq },
    );
  },
};

const exBinomialMental: ExerciseGenerator = {
  id: "binomisch-kopfrechnen",
  make(rng, level) {
    const base = rng.pick([20, 30, 40]);
    const d = rng.int(1, 3);
    const val = (base + d) * (base - d);
    const bSq = base * base;
    const dSq = d * d;

    if (level === 1) {
      return task(
        level,
        `Berechne das Produkt ${base + d} · ${base - d} geschickt im Kopf mithilfe der 3. binomischen Formel (${base} + ${d})(${base} ${MINUS} ${d}).`,
        "",
        [
          intField("Produkt", val, [
            {
              value: bSq + dSq,
              hint: `Bei der 3. binomischen Formel steht zwischen den Quadraten ein Minuszeichen: a² ${MINUS} b².`,
            },
          ]),
        ],
        `Schreibe die beiden Faktoren als (${base} + ${d}) · (${base} ${MINUS} ${d}) = ${base}² ${MINUS} ${d}².`,
        `${base}² = ${fmt(bSq, 0)}, davon ziehst du ${d}² = ${dSq} ab.`,
        `${fmt(bSq, 0)} ${MINUS} ${dSq} = <strong>${fmt(val, 0)}</strong>.`,
        { base, d, val },
      );
    }

    const r = rng.int(3, 7);
    const sqVal = (base + d) ** 2;
    return task(
      level,
      "",
      `Nutze binomische Formeln vorwärts und rückwärts: Berechne ${base + d}² über (${base} + ${d})² und ergänze die Lücke zum vollständigen Quadrat: x² + ${2 * r}x + k = (x + ${r})².`,
      [
        intField(`${base + d}²`, sqVal, [
          {
            value: bSq + d * d,
            hint: `Vergiss beim Quadrieren der Summe nicht 2 · ${base} · ${d} = ${2 * base * d}!`,
          },
        ]),
        intField("Fehlende Zahl k", r * r, [
          {
            value: 2 * r,
            hint: `Im quadratischen Ausdruck steht hinten b², also ${r}² = ${r * r}.`,
          },
        ]),
      ],
      "",
      `(${base} + ${d})² = ${base}² + 2 · ${base} · ${d} + ${d}² = ${fmt(bSq, 0)} + ${2 * base * d} + ${d * d}; hinten gilt k = ${r}².`,
      `Ergebnisse: <strong>${fmt(sqVal, 0)}</strong> und k = <strong>${r * r}</strong>.`,
      { base, d, r, sqVal },
    );
  },
};

// ─── Generators 1.12 (Sachargumentation mit Termen) ──────────────────────────

const exScalingArg: ExerciseGenerator = {
  id: "skalierung-beweisen",
  make(rng, level) {
    const ka = rng.int(3, 5);
    const kb = level === 1 ? ka : rng.int(2, 4);
    const factor = ka * kb;

    return task(
      level,
      `Bei einem Rechteck (Fläche A = a · b) wird jede Seitenlänge auf das ${ka}-Fache vergrößert (aus a wird ${ka}a und aus b wird ${ka}b). Mit welchem Faktor wächst der Flächeninhalt?`,
      `Die Länge eines Rechtecks (A = a · b) wird auf das ${ka}-Fache, die Breite auf das ${kb}-Fache vergrößert. Bestimme den Änderungsfaktor für den Flächeninhalt und wähle die korrekte Termbegründung.`,
      [
        intField("Flächenfaktor", factor, [
          {
            value: ka + kb,
            hint: `Die Seitenlängen werden multipliziert, nicht addiert: (${ka}a) · (${kb}b) = (${ka} · ${kb}) · ab.`,
          },
          {
            value: ka,
            hint: `Jede Seite trägt einen Faktor bei: (${ka}a) · (${kb}b) hat beide Faktoren!`,
          },
        ]),
        choiceField(
          "Richtige Termbegründung",
          [
            `A_neu = (${ka}a) · (${kb}b) = ${factor} · a · b = ${factor} · A`,
            `A_neu = ${ka}a + ${kb}b = ${ka + kb} · A`,
            `A_neu = (${ka} · ${kb}) + ab`,
          ],
          0,
        ),
      ],
      `Setze die neuen Seitenlängen in A = a · b ein und sortiere die Zahlenfaktoren nach vorn.`,
      `A_neu = (${ka}a) · (${kb}b) = (${ka} · ${kb}) · (a · b).`,
      `Der Flächeninhalt wächst auf das <strong>${factor}-Fache</strong>, weil A_neu = ${factor} · A gilt.`,
      { ka, kb, factor },
    );
  },
};

const exNumberTrick: ExerciseGenerator = {
  id: "zahlentrick-term",
  make(rng, level) {
    const add1 = rng.int(2, 6);
    const mul = rng.int(2, 4);
    const sub = rng.int(1, 5);
    // Trick: ((x + add1) * mul - sub) - mul * x = add1 * mul - sub
    const resultConst = add1 * mul - sub;

    return task(
      level,
      `Ein Zahlentrick für eine beliebige gedachte Zahl x: „Addiere ${add1}, multipliziere mit ${mul}, subtrahiere ${sub} und ziehe anschließend das ${mul}-Fache deiner Startzahl x ab.“ Welcher Wert bleibt am Ende immer stehen?`,
      `Beweise mit einem Term, dass die Anweisung „Denke dir x, addiere ${add1}, multipliziere das Ergebnis mit ${mul}, subtrahiere ${sub} und ziehe ${mul}x ab“ stets auf dieselbe Zahl führt. Bestimme den konstanten Endwert.`,
      [
        intField("Konstantes Ergebnis", resultConst, [
          {
            value: add1 - sub,
            hint: `Auch ${add1} steht in der Klammer und wird mit ${mul} multipliziert: ${mul} · (x + ${add1}) = ${mul}x + ${add1 * mul}!`,
          },
        ]),
        choiceField(
          "Warum hängt das Ergebnis nicht von x ab?",
          [
            `${mul}x ${MINUS} ${mul}x hebt sich beim Umformen zu 0 auf`,
            "Weil man für x immer 1 einsetzen muss",
            "Weil Multiplikation vor Addition verschwindet",
          ],
          0,
        ),
      ],
      `Übersetze Schritt für Schritt in einen Term: ${mul} · (x + ${add1}) ${MINUS} ${sub} ${MINUS} ${mul}x.`,
      `Ausmultiplizieren: ${mul}x + ${mul * add1} ${MINUS} ${sub} ${MINUS} ${mul}x.`,
      `${mul}x hebt sich auf; übrig bleibt ${mul * add1} ${MINUS} ${sub} = <strong>${fmt(resultConst, 0)}</strong>.`,
      { add1, mul, sub, resultConst },
    );
  },
};

// ─── Stage 1 Lessons (12 Lektionen) ───────────────────────────────────────────

export const STAGE_1_LESSONS = makeLessons([
  {
    id: "tv-1-variablen",
    section: "1.1",
    title: "1.1 Variablen, Muster & Terme aufstellen",
    subtitle: "Platzhalter nutzen und Muster in Terme übersetzen",
    whyItMatters:
      "Statt zehn verschiedene Einzelfälle durchzurechnen, beschreibt ein einziger Term mit Variablen sofort tausend Fälle auf einen Schlag.",
    explanationHtml: `
      <p>Eine <strong>Variable</strong> (wie <em>x</em>, <em>n</em> oder <em>a</em>) ist ein Platzhalter für eine noch nicht festgelegte Zahl oder Größe. Verbindest du Zahlen, Variablen, Rechenzeichen und Klammern sinnvoll, entsteht ein <strong>Term</strong>.</p>
      <p><strong>Schreibkonvention:</strong> Zwischen Zahl und Variable oder zwischen Variablen darf der Malpunkt entfallen: <code>3 · x</code> schreibst du kurz als <code>3x</code>, und <code>2 · (a + b)</code> als <code>2(a + b)</code>.</p>
      <div class="example">
        <strong>Beispiel – Quadratkette aus Streichhölzern:</strong><br>
        1 Quadrat braucht 4 Hölzer. Jedes weitere angehängte Quadrat braucht nur noch 3 neue Hölzer.<br>
        Für <em>n</em> Quadrate (mit <em>n</em> ≥ 1) gilt daher:<br>
        <code>T(n) = 4 + 3 · (n − 1) = 3n + 1</code>.<br>
        Probe für n = 5 Quadrate: <code>3 · 5 + 1 = 16</code> Hölzer.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Zerlege sprachliche oder bildliche Muster in einen <em>festen Startanteil</em> und einen <em>gleichmäßigen Zuwachs</em> pro Schritt – oder trenne mehrere unabhängige Größen mit eigenen Variablen (z. B. x und y).
      </div>
    `,
    formulas: [
      {
        name: "Musterterm (Start + Zuwachs)",
        html: "T(n) = a + d · (n − 1)",
        quantities: "a Startwert bei n = 1, d konstanter Zuwachs je Schritt, n Schrittnummer",
      },
      {
        name: "Kurzschreibweise ohne Malpunkt",
        html: "k · x = kx, &nbsp; a · b = ab",
        quantities: "Zwischen Zahl und Variable sowie zwischen Variablen entfällt „·“",
      },
    ],
    quiz: Q(
      "Wie übersetzt man „Subtrahiere 5 vom Dreifachen einer Zahl x“ richtig in einen Term?",
      "3x − 5",
      "5 − 3x",
      "3 · (x − 5)",
      "„Subtrahiere A von B“ bedeutet B − A, also vom Dreifachen (3x) die Zahl 5 abziehen: 3x − 5.",
    ),
    lab: labPatternTerms,
    exercises: [exPatternTerm, exWordToTerm],
    celebrationMessage:
      "Stark! Du übersetzt Muster und Alltagssituationen sicher in Terme mit einer oder mehreren Variablen.",
  },
  {
    id: "tv-2-interpretieren",
    section: "1.1",
    title: "1.2 Terme im Sachzusammenhang deuten",
    subtitle: "Summanden, Faktoren und Einheiten am konkreten Beispiel lesen",
    whyItMatters:
      "In Formeln aus Physik, Wirtschaft und Technik musst du sofort erkennen, was ein einzelner Termbaustein bedeutet – und wann eine Änderung viel ausmacht.",
    explanationHtml: `
      <p>Einen Term <strong>interpretieren</strong> heißt: Du liest aus seinem Bauplan heraus, wofür jeder Summand, jeder Faktor und jede Klammer im Sachzusammenhang steht.</p>
      <p>Achte dabei auch auf die <strong>Einheiten</strong>: Wenn du Längen in cm einsetzt, entsteht bei <code>a · b</code> eine Fläche in cm², bei <code>2a + 2b</code> eine Länge (der Umfang) in cm.</p>
      <div class="example">
        <strong>Beispiel – Handy- oder Verleihtarif:</strong><br>
        Ein Tarif beschreibt die monatlichen Kosten (in €) durch <code>K(g, m) = 12 + 0,10m + 2g</code> (m Minuten, g Gigabyte Datenvolumen).<br>
        • <code>12</code> ist die feste Grundgebühr (unabhängig von m und g).<br>
        • <code>0,10m</code> sind die Minutenkosten (10 ct pro Minute).<br>
        • <code>2g</code> sind die Datenkosten (2 € pro GB).
      </div>
      <div class="merke">
        <strong>Merke:</strong> Ein alleinstehender Summand beschreibt meist einen festen Startwert, ein Produkt aus Zahl und Variable eine Änderungsrate (z. B. Preis pro Stück oder Fläche eines Streifens).
      </div>
    `,
    formulas: [
      {
        name: "Fester Anteil und Zuwachsrate",
        html: "K(x) = K<sub>0</sub> + p · x",
        quantities: "K₀ fester Grundbetrag, p Preis/Änderung pro Einheit, x Anzahl",
      },
      {
        name: "Rahmenfläche (Außen minus Innen)",
        html: "A = (l + 2d)(b + 2d) − l · b",
        quantities: "l, b Innenmaße, d Rahmenbreite rundherum",
      },
    ],
    quiz: Q(
      "Ein Rechteck mit Länge a und Breite b wird um einen 2 cm breiten Streifen außenherum erweitert. Was beschreibt (a + 4) im Term (a + 4)(b + 4)?",
      "Die neue Gesamtlänge, weil links und rechts je 2 cm dazukommen",
      "Den Flächeninhalt der vier kleinen Ecken",
      "Die halbe Breite des Streifens",
      "An beiden Enden der Länge a kommen je 2 cm hinzu: a + 2 + 2 = a + 4.",
    ),
    lab: labTermInterpret,
    exercises: [exInterpretPart, exTermCompareContext],
    celebrationMessage:
      "Sehr gut! Du liest Termen mit mehreren Variablen direkt ihre reale Bedeutung an.",
  },
  {
    id: "tv-3-termwerte",
    section: "1.1",
    title: "1.3 Termwerte berechnen & Wertetabellen",
    subtitle: "Rationale Zahlen und ganzzahlige Exponenten korrekt einsetzen",
    whyItMatters:
      "Vorzeichen- und Potenzfehler sind die häufigsten Stolperfallen in Klassenarbeiten. Wer Einsetzklammern und Rechenreihenfolge beherrscht, vermeidet sie komplett.",
    explanationHtml: `
      <p>Beim Berechnen eines <strong>Termwerts</strong> ersetzt du jede Variable durch die gegebene rationale Zahl. Negative Zahlen schreibst du beim Einsetzen konsequent in <strong>Klammern</strong>!</p>
      <p>Für die Reihenfolge gilt: <strong>Klammern zuerst, dann Potenzen, dann Punkt-, zuletzt Strichrechnung.</strong> Aus Klasse 6 kennst du bereits negative ganzzahlige Exponenten: <code>a<sup>−n</sup> = ${frac(1, "a<sup>n</sup>")}</code> (für a ≠ 0) und <code>a<sup>0</sup> = 1</code>.</p>
      <div class="example">
        <strong>Beispiel – die fiese Minus-Falle & negative Exponenten:</strong><br>
        Berechne <code>T(x) = −x² + 8 · 2<sup>−3</sup></code> für <code>x = −3</code>.<br>
        1. Vor der Potenz steht ein Minus: <code>−(−3)² = −9</code> (denn nur x wird quadriert, nicht das führende Minus!).<br>
        2. Kehrwertregel für <code>2<sup>−3</sup></code>: <code>${frac(1, "2³")} = ${fracHtml(1, 8)} = 0,125</code>.<br>
        3. Punkt vor Strich: <code>8 · ${fracHtml(1, 8)} = 1</code>.<br>
        4. Ergebnis: <code>−9 + 1 = −8</code>.
      </div>
      <div class="merke">
        <strong>Merke:</strong> <code>(−3)² = (−3) · (−3) = +9</code>, aber <code>−3² = −(3 · 3) = −9</code>. Wertetabellen ordnen Eingabewert x und Termwert T(x) übersichtlich paarweise zu.
      </div>
    `,
    formulas: [
      {
        name: "Negativer ganzzahliger Exponent (Wiederholung M6)",
        html: `a<sup>−n</sup> = ${frac(1, "a<sup>n</sup>")} &nbsp; (a ≠ 0)`,
        quantities: "a Basis (≠ 0), n natürliche Zahl; außerdem gilt a⁰ = 1",
      },
      {
        name: "Klammer vs. Minuszeichen",
        html: "(−x)<sup>2</sup> = +x<sup>2</sup>, &nbsp; −(x<sup>2</sup>) = −x<sup>2</sup>",
        quantities: "Ein Minus vor x² gehört nicht zur Basis der Potenz",
      },
    ],
    quiz: Q(
      "Welchen Wert hat T(x) = −x² + 4x⁻¹ für x = −2?",
      "−6",
      "2",
      "−2",
      "Zuerst −(−2)² = −4. Dazu kommt 4 · (−2)⁻¹ = 4 · (−1/2) = −2. Insgesamt: −4 + (−2) = −6.",
    ),
    lab: labValueTable,
    exercises: [exEvalPowerTerm, exValueTableGap],
    celebrationMessage:
      "Sicher berechnet! Du beherrschst Einsetzklammern, ganzzahlige Exponenten und Wertetabellen.",
  },
  {
    id: "tv-4-tabelle",
    section: "1.1",
    title: "1.4 Wertetabellen mit Tabellenkalkulation",
    subtitle: "Formeln schreiben, Bezüge fixieren und Aufwand abwägen",
    whyItMatters:
      "Tabellenkalkulationen nehmen dir mühsame Reihenrechnungen ab – aber nur, wenn du weißt, welche Bezüge beim Kopieren mitwandern dürfen und wann der Griff zum Rechner gar nicht lohnt.",
    explanationHtml: `
      <p>In einem Tabellenkalkulationsprogramm (z. B. Calc oder Excel) beginnt jede Formel mit einem <code>=</code>. Das Malzeichen ist <code>*</code>, die Zelle „Spalte A, Zeile 2“ heißt <code>A2</code>.</p>
      <p>Ziehst du eine Formel nach unten in die nächste Zeile, wandern <strong>relative Bezüge</strong> wie <code>A2</code> automatisch mit (<code>A3</code>, <code>A4</code> …). Setzt du Dollarzeichen wie <code>$B$1</code>, entsteht ein <strong>absoluter Bezug</strong>, der beim Kopieren fest auf genau dieser einen Zelle bleibt.</p>
      <div class="example">
        <strong>Beispiel – Kopierfähige Tarifformel:</strong><br>
        In <code>$B$1</code> steht die feste Grundgebühr <code>5</code> €, in <code>A2</code> stehen <code>1; 2; 3; …</code> Stunden.<br>
        Die Formel in <code>C2</code> lautet <code>=3*A2+$B$1</code>.<br>
        In Zeile 4 wird daraus automatisch <code>=3*A4+$B$1</code> → bei <code>A4 = 3</code> also <code>3 · 3 + 5 = 14</code>.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Ein Tabellenblatt lohnt sich bei vielen x-Werten, beim Vergleichen zweier Terme oder wenn Parameter über <code>$</code>-Zellen variiert werden. Für eine einzelne einfache Rechnung ist der Kopf schneller!
      </div>
    `,
    formulas: [
      {
        name: "Relativer vs. absoluter Zellbezug",
        html: "A2 → A3 (relativ) &nbsp;|&nbsp; $B$1 → $B$1 (absolut)",
        quantities: "„$“ vor Spalte und Zeile hält den Zellenbezug beim Kopieren fest",
      },
    ],
    quiz: Q(
      "In C2 steht die Formel =A2*2+$B$1. Du kopierst die Formel eine Zeile tiefer nach C3. Wie lautet sie dort?",
      "=A3*2+$B$1",
      "=A3*2+$B$2",
      "=A2*2+$B$1",
      "A2 ist relativ und wird zu A3; $B$1 ist durch Dollarzeichen fest verankert und bleibt $B$1.",
    ),
    lab: labSpreadsheetSim,
    exercises: [exSheetFormula, exSheetUseful],
    celebrationMessage:
      "Top! Du schreibst saubere Zellformeln und erkennst sofort, wann Software echten Nutzen bringt.",
  },
  {
    id: "tv-5-struktur",
    section: "1.1",
    title: "1.5 Struktur von Termen analysieren",
    subtitle: "Die äußerste Rechenart am Rechenbaum benennen",
    whyItMatters:
      "Erst wenn du erkennst, ob ein Term außen eine Summe oder ein Produkt ist, weißt du, ob du ausklammern, ausmultiplizieren oder nur Summanden umsortieren darfst.",
    explanationHtml: `
      <p>Den Wert eines Terms rechnest du von <strong>innen nach außen</strong> (Klammern zuerst). Seine <strong>Struktur</strong> liest du dagegen von <strong>außen nach innen</strong>: Die allerletzte Rechenart, die du ausführst, gibt dem gesamten Term seinen Namen.</p>
      <p>Die fünf Grundformen heißen: <strong>Summe</strong> (+), <strong>Differenz</strong> (−), <strong>Produkt</strong> (·), <strong>Quotient</strong> (:) und <strong>Potenz</strong> (a<sup>n</sup>).</p>
      <div class="example">
        <strong>Beispiel – zwei ähnlich aussehende Terme:</strong><br>
        • <code>3 · (x + 2)</code>: Zuerst Summe <code>x + 2</code>, ganz zum Schluss Multiplikation mit <code>3</code> → ein <strong>Produkt</strong> (Faktoren: <code>3</code> und <code>(x + 2)</code>).<br>
        • <code>3x + 2</code>: Zuerst Produkt <code>3 · x</code>, zuletzt Addition mit <code>2</code> → eine <strong>Summe</strong> (Summanden: <code>3x</code> und <code>2</code>).
      </div>
      <div class="merke">
        <strong>Merke:</strong> Die zuletzt ausgeführte Rechenart (Wurzel des Rechenbaums) bestimmt die Termart. Ein Faktor oder Summand kann selbst wieder eine Klammer sein!
      </div>
    `,
    formulas: [
      {
        name: "Begriffe der fünf Termarten",
        html: "Summe (a + b) · Differenz (a − b) · Produkt (a · b) · Quotient (a : b) · Potenz (a<sup>n</sup>)",
        quantities: "Entscheidend ist immer die Rechenart, die ganz zuletzt ausgeführt wird",
      },
    ],
    quiz: Q(
      "Welche Termart hat der Term 4 · (x − 1) − 7?",
      "Eine Differenz",
      "Ein Produkt",
      "Eine Summe",
      "Punkt geht vor Strich: Erst berechnest du 4 · (x − 1), als LETZTES ziehst du 7 ab. Also ist es eine Differenz.",
    ),
    lab: labTermTree,
    exercises: [exOuterOp, exBuildFromWords],
    celebrationMessage:
      "Perfekt analysiert! Du erkennst äußere Termarten auf den ersten Blick.",
  },
  {
    id: "tu-1-potenzgesetze",
    section: "1.2",
    title: "1.6 Potenzgesetze (natürliche Exponenten)",
    subtitle: "Produkte und Potenzen von Potenzen sicher zusammenfassen",
    whyItMatters:
      "Ohne Potenzgesetze bleiben Terme wie 3x² · 4x³ unhandlich – und das Verwechseln von aᵐ · aⁿ mit (aᵐ)ⁿ kostet unnötig Punkte.",
    explanationHtml: `
      <p>Für alle <strong>natürlichen Exponenten</strong> <em>m, n ∈ ℕ</em> gelten drei klare Regeln, die sich direkt aus ausgeschriebenen Produkten erklären:</p>
      <ul>
        <li><strong>Gleiche Basis:</strong> <code>a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup></code> (z. B. <code>x² · x³ = (x·x) · (x·x·x) = x⁵</code>).</li>
        <li><strong>Gleicher Exponent:</strong> <code>a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup></code> (z. B. <code>2³ · 5³ = (2 · 5)³ = 10³ = 1000</code>).</li>
        <li><strong>Potenz einer Potenz:</strong> <code>(a<sup>m</sup>)<sup>n</sup> = a<sup>m·n</sup></code> (z. B. <code>(x²)³ = x² · x² · x² = x⁶</code>).</li>
      </ul>
      <div class="example">
        <strong>Beispiel – Vorfaktor in einer Klammer nicht vergessen:</strong><br>
        Vereinfache <code>(2x³)² · 3x⁴</code>:<br>
        <code>(2x³)² = 2² · (x³)² = 4 · x<sup>3·2</sup> = 4x⁶</code>.<br>
        Nun die Zahlen und Potenzen multiplizieren: <code>4x⁶ · 3x⁴ = 12x<sup>6+4</sup> = 12x¹⁰</code>.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Potenzgesetze gelten für <em>Produkte</em> und <em>Potenzen</em> – <strong>nicht für Summen!</strong> <code>x² + x³</code> lässt sich <em>nicht</em> zusammenfassen!
      </div>
    `,
    formulas: [
      {
        name: "1. Potenzgesetz (gleiche Basis)",
        html: "a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup> &nbsp; (m, n ∈ ℕ)",
        quantities: "Exponenten addieren bei Multiplikation mit derselben Basis",
      },
      {
        name: "2. Potenzgesetz (gleicher Exponent)",
        html: "a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup>",
        quantities: "Basen multiplizieren, gemeinsamen Exponenten beibehalten",
      },
      {
        name: "3. Potenzgesetz (Potenz von Potenz)",
        html: "(a<sup>m</sup>)<sup>n</sup> = a<sup>m · n</sup>",
        quantities: "Exponenten multiplizieren beim wiederholten Potenzieren",
      },
    ],
    quiz: Q(
      "Wie vereinfacht man (3x²)² richtig?",
      "9x⁴",
      "6x⁴",
      "3x⁴",
      "Die hoch 2 gilt für BEIDE Faktoren in der Klammer: 3² · (x²)² = 9 · x^(2·2) = 9x⁴.",
    ),
    lab: labPowerRulesN,
    exercises: [exPowerCombine, exPowerCompare],
    celebrationMessage:
      "Sehr stark! Alle drei Potenzgesetze für natürliche Exponenten sitzen sicher.",
  },
  {
    id: "tu-2-zusammenfassen",
    section: "1.2",
    title: "1.7 Gleichartige Terme & Äquivalenz",
    subtitle: "Summen und Produkte ordnen, vereinfachen und Äquivalenz begründen",
    whyItMatters:
      "Nur wenn deine Umformung wirklich für jede eingesetzte Zahl stimmt, darf zwischen zwei Termen ein Gleichheitszeichen stehen.",
    explanationHtml: `
      <p><strong>Gleichartige Termglieder</strong> stimmen in allen Variablen einschließlich ihrer Exponenten exakt überein (Beachte das Kommutativgesetz: <code>ba = ab</code>). Nur sie lassen sich bei Addition und Subtraktion zu einem Glied zusammenfassen.</p>
      <p>Bei <strong>Produkten</strong> dagegen ordnest du zuerst alle Zahlenfaktoren nach vorn und multiplizierst gleiche Variablen mithilfe der Potenzgesetze.</p>
      <p>Zwei Terme heißen <strong>äquivalent</strong>, wenn sie für <em>alle</em> zulässigen Zahlen denselben Termwert liefern. Um zu beweisen, dass zwei Terme <em>nicht</em> äquivalent sind, genügt bereits <strong>ein einziges Gegenbeispiel</strong>!</p>
      <div class="example">
        <strong>Beispiel – Produkt vor Summe & Äquivalenztest:</strong><br>
        <code>5ab − 2a · (−3b) + a² − ba = 5ab + 6ab − ab + a² = 10ab + a²</code>.<br>
        Begründung: Erst Produkt <code>−2a · (−3b) = +6ab</code> bilden (Assoziativ-/Kommutativgesetz), dann wegen <code>ba = ab</code> gleichartige ab-Glieder zusammenfassen.
      </div>
      <div class="merke">
        <strong>Merke:</strong> <code>x²</code> und <code>x</code> sind <em>nicht</em> gleichartig! Probe durch Einsetzen kann eine Umformung widerlegen – bewiesen wird Äquivalenz durch erlaubte Rechengesetze.
      </div>
    `,
    formulas: [
      {
        name: "Gleichartige Glieder zusammenfassen",
        html: "a · T + b · T = (a + b) · T",
        quantities: "T steht für denselben Variablenbaustein (z. B. x² oder ab = ba)",
      },
      {
        name: "Äquivalenzbegriff",
        html: "T₁(x) = T₂(x) für alle zulässigen x",
        quantities: "Bewiesen durch Umformungsregeln; widerlegt durch ein Gegenbeispiel",
      },
    ],
    quiz: Q(
      "Welche Glieder im Term 4x² + 3xy − yx + 5x sind gleichartig?",
      "3xy und −yx (weil xy = yx)",
      "4x² und 5x (beide haben ein x)",
      "Alle Glieder mit einer Zahl davor",
      "Wegen des Kommutativgesetzes ist xy = yx. Dagegen haben x² und x verschiedene Exponenten.",
    ),
    lab: labLikeTermsProbe,
    exercises: [exCollectLike, exEquivCheck],
    celebrationMessage:
      "Klasse! Du fasst Terme fehlerfrei zusammen und begründest Äquivalenz mit Fachsprache.",
  },
  {
    id: "tu-3-ausmultiplizieren",
    section: "1.2",
    title: "1.8 Ausmultiplizieren & Minusklammern",
    subtitle: "Distributivgesetz und Vorzeichenregeln sicher anwenden",
    whyItMatters:
      "Fast jede quadratische oder lineare Termumformung verlangt sicheres Klammerauflösen – besonders bei einem Minuszeichen vor dem Faktor.",
    explanationHtml: `
      <p>Das <strong>Distributivgesetz</strong> verbindet Punkt- und Strichrechnung: <code>a · (b + c) = a · b + a · c</code>. Geometrisch heißt das: Ein Rechteck der Breite <code>a</code> und Gesamtlänge <code>b + c</code> zerfällt in zwei Teilrechtecke <code>ab</code> und <code>ac</code>.</p>
      <p>Steht vor der Klammer ein <strong>Minuszeichen</strong> (also der Faktor <code>−1</code>), kehrt sich beim Auflösen <em>jedes</em> Vorzeichen in der Klammer um: <code>−(b − c) = −b + c</code>.</p>
      <div class="example">
        <strong>Beispiel – Minusfaktor vor der Klammer:</strong><br>
        <code>3(2x + 4) − 2(5x − 1) = 6x + 12 − 10x + 2 = −4x + 14</code>.<br>
        Achte auf das letzte Produkt: <code>−2 · (−1) = +2</code>!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Multipliziere den Faktor vor der Klammer (samt seinem Vorzeichen!) mit <em>jedem</em> Summanden in der Klammer.
      </div>
    `,
    formulas: [
      {
        name: "Distributivgesetz (Ausmultiplizieren)",
        html: "a · (b + c) = ab + ac, &nbsp; a · (b − c) = ab − ac",
        quantities: "Der äußere Faktor a (inkl. Vorzeichen) trifft jeden Summanden",
      },
      {
        name: "Minusklammerregel",
        html: "−(b + c) = −b − c, &nbsp; −(b − c) = −b + c",
        quantities: "Minus vor einer Klammer dreht jedes Zeichen innerhalb der Klammer um",
      },
    ],
    quiz: Q(
      "Welcher Term entsteht beim Auflösen von 4x − 3(x − 2)?",
      "x + 6",
      "x − 6",
      "x − 2",
      "−3 wird mit x UND mit −2 multipliziert: 4x − 3x + (−3) · (−2) = x + 6.",
    ),
    lab: labDistributiveArea,
    exercises: [exExpandSingle, exMinusBracket],
    celebrationMessage:
      "Hervorragend! Auch verschachtelte Minusklammern bringst du nicht mehr aus dem Tritt.",
  },
  {
    id: "tu-4-faktorisieren",
    section: "1.2",
    title: "1.9 Faktorisieren (Ausklammern)",
    subtitle: "Aus einer Summe gezielt ein Produkt machen",
    whyItMatters:
      "Faktorisieren dreht das Ausmultiplizieren um. Wer aus einer Summe ein Produkt bauen kann, sieht gemeinsame Faktoren und löst später Gleichungen im Handumdrehen.",
    explanationHtml: `
      <p>Beim <strong>Faktorisieren</strong> (Ausklammern) wendest du das Distributivgesetz rückwärts an: <code>ab + ac = a · (b + c)</code>. Dadurch wird aus einer <em>Summe</em> oder Differenz ein <em>Produkt</em>!</p>
      <p>Suche für den gemeinsamen Faktor vor der Klammer:</p>
      <ol>
        <li>den <strong>größten gemeinsamen Teiler (ggT)</strong> aller Zahlenkoeffizienten,</li>
        <li>die <strong>kleinste gemeinsame Potenz</strong> jeder in allen Gliedern vorkommenden Variable.</li>
      </ol>
      <div class="example">
        <strong>Beispiel – vollständig ausklammern:</strong><br>
        <code>12x² + 18xy = 6x · (2x + 3y)</code>.<br>
        • Zahlen: <code>ggT(12, 18) = 6</code>.<br>
        • Variablen: In beiden steckt mindestens einmal <code>x</code> (<code>y</code> fehlt im ersten Glied).<br>
        • Probe rückwärts: <code>6x · 2x + 6x · 3y = 12x² + 18xy</code> ✓
      </div>
      <div class="merke">
        <strong>Merke:</strong> Immer die Gegenprobe durch Ausmultiplizieren machen! Wenn ein ganzes Glied ausgeklammert wird (z. B. <code>3x² + 3x</code>), bleibt in der Klammer eine <code>1</code> stehen: <code>3x(x + 1)</code>.
      </div>
    `,
    formulas: [
      {
        name: "Faktorisieren (Distributivgesetz rückwärts)",
        html: "ab + ac = a · (b + c)",
        quantities: "Aus einer Summe entsteht ein Produkt mit gemeinsamen Faktor a",
      },
    ],
    quiz: Q(
      "Wie faktorisiert man 8x² − 4x vollständig?",
      "4x · (2x − 1)",
      "4x · (2x)",
      "4 · (2x² − x)",
      "4x steckt in beiden Gliedern; teilt man −4x durch 4x, bleibt −1 in der Klammer stehen!",
    ),
    lab: labFactorRect,
    exercises: [exFactorOut, exFactorSignCheck],
    celebrationMessage:
      "Top! Du machst aus Summen gezielt Produkte und prüfst jedes Ergebnis mit der Gegenprobe.",
  },
  {
    id: "tu-5-summen-mal",
    section: "1.2",
    title: "1.10 Summen multiplizieren",
    subtitle: "Zwei Klammern mit dem Rechteckmodell vollständig ausmultiplizieren",
    whyItMatters:
      "Das Multiplizieren zweier Klammern begegnet dir in der Geometrie bei vergrößerten Flächen ebenso wie als Grundlage aller binomischen Formeln.",
    explanationHtml: `
      <p>Um das Produkt zweier Summen <code>(a + b)(c + d)</code> zu bilden, stellst du dir ein großes Rechteck vor, das in <strong>vier Teilrechtecke</strong> zerschnitten wird.</p>
      <p><strong>Regel:</strong> Multipliziere <em>jedes</em> Glied der ersten Klammer mit <em>jedem</em> Glied der zweiten Klammer (samt Vorzeichen) und fasse anschließend gleichartige Glieder zusammen.</p>
      <div class="example">
        <strong>Beispiel – vier Teilprodukte sauber sortieren:</strong><br>
        <code>(2x − 3)(x + 4) = 2x · x + 2x · 4 − 3 · x − 3 · 4</code><br>
        <code>= 2x² + 8x − 3x − 12 = 2x² + 5x − 12</code>.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Bei zwei zweigliedrigen Klammern entstehen vor dem Zusammenfassen immer <code>2 · 2 = 4</code> Produkte – vergiss niemals die beiden gemischten Produkte innen!
      </div>
    `,
    formulas: [
      {
        name: "Multiplikation zweier Summen",
        html: "(a + b)(c + d) = ac + ad + bc + bd",
        quantities: "Vier Teilprodukte entsprechen vier Rechteckfeldern im Flächenmodell",
      },
    ],
    quiz: Q(
      "Was fehlt in der falschen Rechnung (x + 5)(x − 2) = x² − 10?",
      "Die beiden gemischten Glieder −2x + 5x = +3x",
      "Das zweite Quadrat 25",
      "Nur das Pluszeichen vor der 10",
      "Beim Ausmultiplizieren von (x + 5)(x − 2) entstehen 4 Produkte: x² − 2x + 5x − 10 = x² + 3x − 10.",
    ),
    lab: labSumProductGrid,
    exercises: [exMulTwoSums, exAreaSumProd],
    celebrationMessage:
      "Ausgezeichnet! Vier Teilprodukte im Blick, Vorzeichen sicher – weiter zu den binomischen Formeln!",
  },
  {
    id: "tu-6-binomisch",
    section: "1.2",
    title: "1.11 Binomische Formeln begründen & nutzen",
    subtitle: "Die drei Abkürzungen geometrisch herleiten und vorwärts wie rückwärts einsetzen",
    whyItMatters:
      "Binomische Formeln sparen dir Schreibarbeit beim Quadrieren von Summen, machen geschicktes Kopfrechnen möglich und helfen später bis ins Abitur.",
    explanationHtml: `
      <p>Die <strong>drei binomischen Formeln</strong> sind Spezialfälle von „Summen multiplizieren“, die ihre Gültigkeit direkt aus dem Ausmultiplizieren – und sichtbar aus einem Quadrat der Seitenlänge <code>a + b</code> – beziehen:</p>
      <ol>
        <li><strong>1. binomische Formel:</strong> <code>(a + b)² = (a + b)(a + b) = a² + ab + ba + b² = a² + 2ab + b²</code></li>
        <li><strong>2. binomische Formel:</strong> <code>(a − b)² = (a − b)(a − b) = a² − ab − ba + b² = a² − 2ab + b²</code></li>
        <li><strong>3. binomische Formel:</strong> <code>(a + b)(a − b) = a² − ab + ba − b² = a² − b²</code></li>
      </ol>
      <div class="example">
        <strong>Beispiel – Vorwärts und zum Kopfrechnen:</strong><br>
        • Term: <code>(3x − 4)² = (3x)² − 2 · 3x · 4 + 4² = 9x² − 24x + 16</code>.<br>
        • Kopfrechnen: <code>31 · 29 = (30 + 1)(30 − 1) = 30² − 1² = 900 − 1 = 899</code>.
      </div>
      <div class="merke">
        <strong>Merke:</strong> <code>(a + b)² ≠ a² + b²</code>! In einem Quadrat der Seite <code>a + b</code> liegen außer den Quadraten <code>a²</code> und <code>b²</code> auch immer die zwei Rechtecke <code>2 · ab</code>!
      </div>
    `,
    formulas: [
      {
        name: "1. binomische Formel",
        html: "(a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>",
        quantities: "Quadrat einer Summe (mit doppeltem Produkt +2ab)",
      },
      {
        name: "2. binomische Formel",
        html: "(a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup>",
        quantities: "Quadrat einer Differenz (−2ab, aber +b² am Ende)",
      },
      {
        name: "3. binomische Formel",
        html: "(a + b)(a − b) = a<sup>2</sup> − b<sup>2</sup>",
        quantities: "Produkt aus Summe und Differenz (gemischte Glieder heben sich auf)",
      },
    ],
    quiz: Q(
      "Was ergibt (2x + 5)² nach der 1. binomischen Formel?",
      "4x² + 20x + 25",
      "2x² + 20x + 25",
      "4x² + 25",
      "Sowohl 2x wird als Ganzes quadriert (4x²) als auch das doppelte Produkt 2 · 2x · 5 = 20x gebildet.",
    ),
    lab: labBinomialSquare,
    exercises: [exBinomialExpand, exBinomialMental],
    celebrationMessage:
      "Meisterlich! Du kennst die Herleitung und wendest alle drei binomischen Formeln blitzschnell an.",
  },
  {
    id: "tu-7-sachargument",
    section: "1.2",
    title: "1.12 Mit Termen im Sachzusammenhang argumentieren",
    subtitle: "Skalierungen und Zahlenrätsel mithilfe von Termumformungen beweisen",
    whyItMatters:
      "Zahlenbeispiele können nur eine Vermutung nahelegen – erst ein sauber umgeformter Term beweist, dass eine Aussage immer und ohne Ausnahme gilt.",
    explanationHtml: `
      <p>Mit Variablen und Termumformungen kannst du im Alltag <strong>allgemeingültige Begründungen</strong> liefern – etwa was passiert, wenn sich Maße verdoppeln, oder warum ein Zahlentrick immer dieselbe Zahl ergibt.</p>
      <div class="example">
        <strong>Beispiel 1 – Seitenlängen eines Rechtecks verdoppeln:</strong><br>
        Aus Länge <code>a</code> und Breite <code>b</code> werden <code>2a</code> und <code>2b</code>.<br>
        Neue Fläche: <code>A<sub>neu</sub> = (2a) · (2b) = 4 · (a · b) = 4 · A<sub>alt</sub></code>.<br>
        <strong>Aussage:</strong> Verdoppelt man beide Seitenlängen, <em>vervierfacht</em> sich der Flächeninhalt!
      </div>
      <div class="example">
        <strong>Beispiel 2 – Zahlentrick entzaubert:</strong><br>
        „Addiere 3, verdopple, subtrahiere 4, ziehe das Doppelte deiner Zahl ab.“<br>
        Term: <code>2(x + 3) − 4 − 2x = 2x + 6 − 4 − 2x = 2</code>. Egal welches <code>x</code> man wählt – die Variable kürzt sich weg!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Um eine Wirkung (z. B. Verdopplung) zu beweisen, ersetzt du die Variablen im Ursprungsterm durch die veränderten Ausdrücke (z. B. <code>2a</code>) und formst um, bis der Ursprungsterm wieder sichtbar wird.
      </div>
    `,
    formulas: [
      {
        name: "Flächenskalierung eines Rechtecks",
        html: "A<sub>neu</sub> = (k<sub>1</sub>a) · (k<sub>2</sub>b) = (k<sub>1</sub>k<sub>2</sub>) · ab",
        quantities: "k₁, k₂ Streckungsfaktoren der beiden Seitenlängen",
      },
    ],
    quiz: Q(
      "Verdreifacht man alle Seitenlängen eines Quadrats (aus a wird 3a), wie verändert sich sein Flächeninhalt?",
      "Er verneunfacht sich: (3a)² = 9a²",
      "Er verdreifacht sich: 3a²",
      "Er versechsfacht sich: 6a²",
      "A_neu = (3a) · (3a) = 3² · a² = 9a². Der Faktor 3 wirkt auf beide Dimensionen!",
    ),
    lab: labAreaScaling,
    exercises: [exScalingArg, exNumberTrick],
    celebrationMessage:
      "Lernbereich 1 geschafft! Du stellst Terme auf, deutest sie, formst sie sicher um und argumentierst mathematisch.",
  },
]);
