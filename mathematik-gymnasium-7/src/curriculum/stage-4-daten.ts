import { choiceField, intField, numberField } from "./helpers";
import { Q, task, valueList } from "./builders";
import { makeLessons } from "./make";
import {
  labBoxplotBuilder,
  labBoxplotCompare,
  labMedianOrder,
  labOutlierShift,
  labQuartilesSplit,
} from "./labs";
import { fiveNumbers, mean, median, roundTo, sorted } from "./math";
import { fmt, frac, MINUS } from "../exercises/format";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators 4.1 (Median & arithmetisches Mittel) ──────────────────────────

const exMedianCompute: ExerciseGenerator = {
  id: "median-berechnen",
  make(rng, level) {
    if (level === 1) {
      const n = 7;
      const raw = [
        rng.int(4, 9),
        rng.int(12, 18),
        rng.int(2, 6),
        rng.int(8, 12),
        rng.int(16, 22),
        rng.int(9, 14),
        rng.int(5, 10),
      ];
      const ord = sorted(raw);
      const med = median(raw);
      const middleNaive = raw[3];
      return task(
        level,
        `In einem Lauf-Test einer 7. Klasse wurden folgende ${n} Ergebnisse (in min) gemessen: ${valueList(raw, 0)}. Sortiere die Liste der Größe nach und bestimme den Median.`,
        "",
        [
          intField("Median", med, [
            ...(middleNaive !== med
              ? [
                  {
                    value: middleNaive,
                    hint: `Du darfst den Median nicht aus der UNSORTIERTEN Liste ablesen! Ordne die Werte erst von klein nach groß: ${valueList(ord, 0)}.`,
                  },
                ]
              : []),
          ], "min"),
        ],
        `Vor dem Ablesen unbedingt sortieren! Bei ${n} Werten steht der Median an Platz ${(n + 1) / 2}.`,
        `Geordnete Rangliste: ${valueList(ord, 0)}.`,
        `An der 4. Stelle steht der Median: <strong>${med} min</strong>.`,
        { med },
      );
    }

    // Level 2: even count n = 6, also compute exact arithmetic mean
    const base = rng.int(10, 18);
    // Construct 6 values whose sum is divisible by 6 so mean is integer!
    const offsets = rng.pick([
      [-6, -3, 0, 2, 4, 9], // sum = +6
      [-4, -2, -1, 1, 3, 9], // sum = +6
      [-5, -1, 0, 3, 4, 11], // sum = +12
    ]);
    const ord = offsets.map((o) => base + o);
    // Shuffle deterministically
    const raw = [ord[3], ord[0], ord[5], ord[2], ord[1], ord[4]];
    const med = roundTo(median(raw), 1);
    const avg = roundTo(mean(raw), 1);
    const slipThird = ord[2];

    return task(
      level,
      "",
      `Sechs Schülerinnen und Schüler messen ihren täglichen Schulweg (in min): ${valueList(raw, 0)}. Berechne den Median (bei gerader Anzahl: Mittelwert der beiden mittleren Werte) und das arithmetische Mittel.`,
      [
        numberField("Median", med, "min", 1, {
          absTolerance: 0.05,
          slips: [
            ...(Math.abs(slipThird - med) > 0.1
              ? [
                  {
                    value: slipThird,
                    hint: `Bei 6 Werten gibt es keine einzelne Mitte – bilde den Mittelwert des 3. und 4. geordneten Werts: (${ord[2]} + ${ord[3]}) : 2!`,
                  },
                ]
              : []),
          ],
        }),
        numberField("Arithmetisches Mittel", avg, "min", 1, { absTolerance: 0.05 }),
      ],
      "",
      `Sortiert: ${valueList(ord, 0)}. Mitte zwischen ${ord[2]} und ${ord[3]} ist ${fmt(med, 1)}; Summe geteilt durch 6 ergibt ${fmt(avg, 1)}.`,
      `Median = <strong>${fmt(med, 1)} min</strong>, arithmetisches Mittel = <strong>${fmt(avg, 1)} min</strong>.`,
      { med, avg },
    );
  },
};

const exMedianVsMean: ExerciseGenerator = {
  id: "median-vs-mittelwert",
  make(rng, level) {
    const a = rng.int(14, 20);
    const cleanOrd = [a - 4, a - 2, a, a + 2, a + 19];
    const med = median(cleanOrd); // a
    const avg = mean(cleanOrd); // a + 3

    return task(
      level,
      `Eine Liste von 5 Taschengeldbeträgen (in €) lautet geordnet: ${valueList(cleanOrd, 0)}. Berechne arithmetisches Mittel und Median. Welcher Wert beschreibt die „typische“ Mitte der Mehrheit hier besser?`,
      `In einer kleinen Firma verdienen vier Beschäftigte (${valueList(cleanOrd.slice(0, 4), 0)} €/h) sehr ähnlich, die Leitung liegt bei ${cleanOrd[4]} €/h. Berechne den Abstand (Mittelwert ${MINUS} Median) und beurteile, welches Maß sich z. B. für Werbung mit „typischem Lohn“ vs. Gesamtlohnsumme eignet.`,
      [
        numberField(
          level === 1 ? "Arithmetisches Mittel" : "Abstand (Mittelwert − Median)",
          level === 1 ? avg : avg - med,
          "€",
          1,
          { absTolerance: 0.05 },
        ),
        ...(level === 1 ? [intField("Median", med, undefined, "€")] : []),
        choiceField(
          level === 1 ? "Welcher Mittelwert bildet die Mitte besser ab?" : "Kritische Bewertung in Sachzusammenhängen",
          level === 1
            ? [
                "Der Median, weil er vom hohen Ausreißer nicht nach oben gezogen wird",
                "Das arithmetische Mittel, weil es immer in der Mitte steht",
                "Beide sind exakt gleich",
              ]
            : [
                "Der Median zeigt den typischen Lohn der Mehrheit; für die Gesamtkosten braucht man jedoch das arithmetische Mittel",
                "Man sollte grundsätzlich das arithmetische Mittel verschweigen",
                "Ausreißer verändern immer auch den Median um denselben Betrag",
              ],
          0,
        ),
      ],
      `Summe : 5 liefert das arithmetische Mittel; der mittlere Wert (Platz 3) ist der Median.`,
      `Median = ${med}, arithmetisches Mittel = ${fmt(avg, 1)} (Differenz = ${fmt(avg - med, 1)}).`,
      `${level === 1 ? `Mittel = <strong>${fmt(avg, 1)} €</strong>, Median = <strong>${med} €</strong>` : `Unterschied = <strong>${fmt(avg - med, 1)} €</strong>`}: Ausreißer verzerren das arithmetische Mittel, den Median kaum.`,
      { med, avg },
    );
  },
};

// ─── Generators 4.2 (Ausreißer & Aussagekraft) ────────────────────────────────

const exOutlierEffect: ExerciseGenerator = {
  id: "ausreisser-wirkung",
  make(rng, level) {
    const base = rng.int(15, 22);
    // 4 values with integer mean = base: [base-3, base-1, base+1, base+3], median = base
    const baseData = [base - 3, base - 1, base + 1, base + 3];
    // Add 5th value as huge outlier: base + 50 => sum was 4*base, new sum = 5*base + 50 => newMean = base + 10!
    // New median of [base-3, base-1, base+1, base+3, base+50] is base + 1 (changes only by 1!)
    const extraJump = rng.pick([45, 50, 60]);
    const outlier = base + extraJump;
    const newData = [...baseData, outlier];
    const oldMean = mean(baseData);
    const oldMed = median(baseData);
    const newMean = roundTo(mean(newData), 1);
    const newMed = median(newData);
    const shiftMean = roundTo(newMean - oldMean, 1);

    return task(
      level,
      `Vier Messwerte betragen ${valueList(baseData, 0)} (Mittelwert = ${oldMean}, Median = ${oldMed}). Nun kommt als fünfter Wert ein Ausreißer ${outlier} hinzu. Berechne das neue arithmetische Mittel und den neuen Median.`,
      `Bei einem Weitsprung-Training liegen die ersten vier Versuche bei ${valueList(baseData, 0)} (in cm oder Punkten), dann kommt ein Ausreißer ${outlier} dazu. Um wie viel steigt das arithmetische Mittel, und um wie viel ändert sich nur der Median?`,
      [
        numberField(level === 1 ? "Neues arithmetisches Mittel" : "Anstieg des arithmetischen Mittels", level === 1 ? newMean : shiftMean, "", 1, {
          absTolerance: 0.05,
        }),
        intField(level === 1 ? "Neuer Median" : "Änderung des Medians", level === 1 ? newMed : newMed - oldMed, [
          {
            value: level === 1 ? oldMed : 0,
            hint: `Durch das Hinzufügen eines 5. Werts rechts verschiebt sich die Mitte vom Durchschnitt des 2./3. Werts (${oldMed}) auf den 3. Wert (${newMed})!`,
          },
        ]),
      ],
      `Neuer Mittelwert = (Summe aller 5 Werte) : 5; der neue Median bei 5 Werten steht an Platz 3.`,
      `Alte Summe = ${4 * base}, neue Summe = ${5 * base + extraJump} → neues Mittel = ${fmt(newMean, 1)} (Anstieg um ${fmt(shiftMean, 1)}); neuer Median an Platz 3 = ${newMed} (Änderung um 1).`,
      `Ergebnis: arithmetisches Mittel ${level === 1 ? `= <strong>${fmt(newMean, 1)}</strong>` : `steigt um <strong>${fmt(shiftMean, 1)}</strong>`}, Median ${level === 1 ? `= <strong>${newMed}</strong>` : `ändert sich nur um <strong>${newMed - oldMed}</strong>`}!`,
      { oldMean, newMean, oldMed, newMed, shiftMean },
    );
  },
};

const exContextChoiceMeanMedian: ExerciseGenerator = {
  id: "kenngroesse-kontext",
  make(rng, level) {
    const packs = rng.int(4, 7);
    const totalNeeded = packs * rng.int(12, 18);
    const avg = totalNeeded / packs;

    return task(
      level,
      `Eine Schulklasse verteilt insgesamt ${totalNeeded} € Reisekosten gleichmäßig auf ${packs} Tage. Wie hoch sind die durchschnittlichen Kosten pro Tag, und welche Kenngröße steckt hier mathematisch dahinter?`,
      `Bewerte zwei Situationen: (A) Um die Gesamtlast gleichmäßig auf ${packs} Gruppen zu verteilen (Gesamtkosten ${totalNeeded} €), braucht man einen Pro-Kopf-Wert. (B) Bei Wartezeiten am Telefon mit einzelnen Extremwartezeiten sucht man eine typische Wartezeit. Berechne den Wert für (A) und ordne Mittelwert vs. Median begründet zu.`,
      [
        intField("Durchschnittswert pro Tag/Gruppe", avg, undefined, "€"),
        choiceField(
          "Welche Kenngröße passt?",
          level === 1
            ? [
                "Arithmetisches Mittel, weil die Gesamtsumme gleichmäßig durch die Anzahl geteilt wird",
                "Median, weil er nur den mittleren Tag betrachtet",
                "Spannweite, weil sie Maximal- und Minimaltag misst",
              ]
            : [
                "Bei (A) braucht man das arithmetische Mittel (Gesamtsumme : Anzahl); bei (B) ist der Median ausreißerfest",
                "In beiden Fällen muss zwingend der Median genommen werden",
                "In beiden Fällen genügt die Spannweite",
              ],
          0,
        ),
      ],
      `Sobald die Gesamtsumme (= n · Mittelwert) entscheidend ist, zählt das arithmetische Mittel; für die „typische Lage“ bei Ausreißern der Median.`,
      `${totalNeeded} : ${packs} = ${avg} (arithmetisches Mittel).`,
      `Ergebnis: <strong>${avg} €</strong>. Merke dir genau diesen Gegensatz: Gesamtsumme ↔ arithmetisches Mittel, Ausreißerresistenz ↔ Median.`,
      { packs, totalNeeded, avg },
    );
  },
};

// ─── Generators 4.3 (Spannweite & Quartile) ──────────────────────────────────

const exQuartilesSpan: ExerciseGenerator = {
  id: "spannweite-quartile",
  make(rng, level) {
    // n = 7 odd length so lower = indices 0,1,2 -> q1 = ord[1], median = ord[3], upper = ord[4,5,6] -> q3 = ord[5]
    // Clean, unambiguous, follows math.ts quartiles() (median excluded from both halves)!
    const step = rng.int(2, 4);
    const start = rng.int(5, 14);
    const ord = [
      start,
      start + step,
      start + 2 * step + 1,
      start + 3 * step + 2,
      start + 4 * step + 3,
      start + 5 * step + 5,
      start + 7 * step + 6,
    ];
    const raw = level === 1 ? ord : [ord[4], ord[1], ord[6], ord[0], ord[5], ord[2], ord[3]];
    const { span, q1, q3 } = fiveNumbers(raw);

    return task(
      level,
      `Gegeben ist ein sortierter Datensatz aus 7 Werten: ${valueList(ord, 0)}. Bestimme die Spannweite R, das untere Quartil q₁ und das obere Quartil q₃ (Regel bei ungerader Anzahl: der Median in der Mitte bleibt außen vor).`,
      `Sieben Messwerte liegen noch unsortiert vor: ${valueList(raw, 0)}. Sortiere sie, wende die Aufteilungsregel für ungerade Anzahl an (der Median bleibt bei beiden Hälften außen vor) und berechne Spannweite R, q₁ sowie q₃.`,
      [
        intField("Spannweite R = Max − Min", span, [
          { value: ord[6], hint: `Die Spannweite ist die Differenz aus größtem und kleinstem Wert (${ord[6]} ${MINUS} ${ord[0]}), nicht das Maximum selbst!` },
        ]),
        intField("Unteres Quartil q₁", q1, [
          { value: ord[0], hint: `${ord[0]} ist das Minimum! q₁ ist der Median der unteren drei Werte (${valueList(ord.slice(0, 3), 0)}).` },
        ]),
        intField("Oberes Quartil q₃", q3, [
          { value: ord[6], hint: `${ord[6]} ist das Maximum! q₃ ist der Median der oberen drei Werte (${valueList(ord.slice(4), 0)}).` },
        ]),
      ],
      `Spannweite = Max ${MINUS} Min; die 7 Werte teilen sich in (3 untere Werte | Median | 3 obere Werte).`,
      `Sortiert: ${valueList(ord, 0)}. Median = ${ord[3]}; untere Hälfte ${valueList(ord.slice(0, 3), 0)} → q₁ = ${q1}; obere Hälfte ${valueList(ord.slice(4), 0)} → q₃ = ${q3}.`,
      `Spannweite R = ${ord[6]} ${MINUS} ${ord[0]} = <strong>${span}</strong>, <strong>q₁ = ${q1}</strong>, <strong>q₃ = ${q3}</strong>.`,
      { span, q1, q3 },
    );
  },
};

const exInterquartileRange: ExerciseGenerator = {
  id: "quartilsabstand-streuung",
  make(rng, level) {
    // Compare even n = 8 dataset where median splits cleanly into 4 | 4
    const s = rng.int(10, 18);
    const ord = [s, s + 2, s + 4, s + 6, s + 8, s + 10, s + 12, s + 24];
    const fn = fiveNumbers(ord);
    // lower half of 4: s, s+2, s+4, s+6 => q1 = s + 3; upper: s+8, s+10, s+12, s+24 => q3 = s + 11; IQR = 8, span = 24!
    return task(
      level,
      `Ein geordneter Datensatz mit 8 Werten lautet: ${valueList(ord, 0)}. Berechne das untere Quartil q₁, das obere Quartil q₃ und den Quartilsabstand (Boxbreite q₃ ${MINUS} q₁).`,
      `Analysiere die Streuung des Datensatzes: ${valueList(ord, 0)}. Berechne den Quartilsabstand (q₃ ${MINUS} q₁) sowie die Spannweite (Max ${MINUS} Min) und erkläre, warum der Einzelwert ${ord[7]} zwar die Spannweite aufbläht, nicht aber den Quartilsabstand.`,
      [
        ...(level === 1 ? [intField("q₁", fn.q1), intField("q₃", fn.q3)] : []),
        intField("Quartilsabstand (q₃ − q₁)", fn.iqr, [
          {
            value: fn.span,
            hint: `Das ist die gesamte Spannweite (Max ${MINUS} Min)! Der Quartilsabstand misst nur die Breite der mittleren 50 %: q₃ ${MINUS} q₁.`,
          },
        ]),
        ...(level === 2 ? [intField("Spannweite (Max − Min)", fn.span)] : []),
      ],
      `Bei 8 Werten bilden die ersten 4 die untere Hälfte (q₁ = Mitte von Platz 2 und 3) und die letzten 4 die obere Hälfte (q₃ = Mitte von Platz 6 und 7).`,
      `q₁ = (${ord[1]} + ${ord[2]}) : 2 = ${fn.q1}; q₃ = (${ord[5]} + ${ord[6]}) : 2 = ${fn.q3}.`,
      `Quartilsabstand: ${fn.q3} ${MINUS} ${fn.q1} = <strong>${fn.iqr}</strong>${level === 2 ? `, Spannweite = <strong>${fn.span}</strong> (Einzelausreißer ${ord[7]} liegt oberhalb von q₃ und berührt die Box nicht)` : ""}.`,
      { q1: fn.q1, q3: fn.q3, iqr: fn.iqr, span: fn.span },
    );
  },
};

// ─── Generators 4.4 (Boxplots & 25-%-Viertel) ─────────────────────────────────

const exBoxplotFiveSummary: ExerciseGenerator = {
  id: "boxplot-fuenf-werte",
  make(rng, level) {
    const min = rng.int(8, 16);
    const q1 = min + rng.int(4, 9);
    const q2 = q1 + rng.int(4, 8);
    const q3 = q2 + rng.int(5, 10);
    const max = q3 + rng.int(6, 15);
    const span = max - min;
    const iqr = q3 - q1;

    if (level === 1) {
      return task(
        level,
        `Ein Boxplot zeigt die fünf Kennwerte: Min = ${min}, q₁ = ${q1}, Median = ${q2}, q₃ = ${q3}, Max = ${max}. Wie breit ist die gesamte Spannweite, und wie breit ist die Rechteck-Box (mittlere 50 %)?`,
        "",
        [
          intField("Gesamtspannweite (Max − Min)", span, [
            { value: iqr, hint: `Die Spannweite reicht ganz von Min (${min}) bis Max (${max})!` },
          ]),
          intField("Boxbreite (q₃ − q₁)", iqr, [
            { value: q3 - q2, hint: `Die Box erstreckt sich von q₁ bis q₃, nicht nur vom Median bis q₃.` },
          ]),
        ],
        `Spannweite = Max ${MINUS} Min; Boxbreite = q₃ ${MINUS} q₁.`,
        `Spannweite: ${max} ${MINUS} ${min} = ${span}; Boxbreite: ${q3} ${MINUS} ${q1} = ${iqr}.`,
        `Gesamtspannweite = <strong>${span}</strong>, Boxbreite = <strong>${iqr}</strong>.`,
        { span, iqr },
      );
    }

    return task(
      level,
      "",
      `Aus einem Boxplot-Bericht (mit Statistik-Software erstellt) kennst du Min = ${min}, q₁ = ${q1}, Gesamtspannweite = ${span} und die Boxbreite (q₃ ${MINUS} q₁) = ${iqr}. Rekonstruiere das obere Quartil q₃ und das Maximum Max.`,
      [
        intField("Oberes Quartil q₃", q3, [
          { value: min + iqr, hint: `Die Boxbreite wird auf q₁ = ${q1} aufgeschlagen (q₁ + Boxbreite), nicht auf Min!` },
        ]),
        intField("Maximum", max),
      ],
      "",
      `q₃ = q₁ + Boxbreite = ${q1} + ${iqr} = ${q3}; Max = Min + Spannweite = ${min} + ${span} = ${max}.`,
      `Rekonstruktion: <strong>q₃ = ${q3}</strong>, <strong>Max = ${max}</strong>.`,
      { min, q1, q3, max },
    );
  },
};

const exBoxplotQuarterShare: ExerciseGenerator = {
  id: "boxplot-viertel-regel",
  make(rng, level) {
    const totalN = rng.pick([20, 24, 28, 32, 40]);
    const quarter = totalN / 4;
    const half = totalN / 2;

    return task(
      level,
      `Ein Boxplot fasst ${totalN} Messwerte einer Klassenarbeit zusammen. Die linke Antenne (Min bis q₁) ist gezeichnet dreimal so lang wie das Boxstück (q₁ bis Median). Wie viele Werte liegen ungefähr in jedem einzelnen Viertel, und warum täuscht die Länge über die Anzahl?`,
      `Ein Datensatz aus ${totalN} Werten zeigt im Boxplot eine sehr breite rechte Teilbox (Median bis q₃) und eine ganz schmale linke Teilbox (q₁ bis Median). Etwa wie viele Messwerte liegen insgesamt innerhalb der gesamten Box (zwischen q₁ und q₃), und was bedeutet die große Breite rechts tatsächlich?`,
      [
        intField(
          level === 1 ? "Ungefähre Anzahl je Viertel (25 %)" : "Ungefähre Anzahl in der gesamten Box (50 %)",
          level === 1 ? quarter : half,
          [
            {
              value: level === 1 ? half : quarter,
              hint: level === 1
                ? `Jeder der vier Boxplot-Abschnitte enthält ca. ein Viertel (25 %) der ${totalN} Werte!`
                : `Die gesamte Box (von q₁ bis q₃) umfasst ZWEI Viertel, also rund 50 % der ${totalN} Werte!`,
            },
          ],
        ),
        choiceField(
          "Bedeutung eines besonders breiten Abschnitts",
          [
            "Die rund 25 % der Werte streuen in diesem Abschnitt weiter auseinander (es sind NICHT mehr Werte!)",
            "Dort liegen automatisch doppelt so viele Messwerte",
            "In einem schmalen Abschnitt fehlen immer Daten",
          ],
          0,
        ),
      ],
      `Min–q₁, q₁–Median, Median–q₃ und q₃–Max zerlegen die geordneten Daten in vier etwa gleich große Viertel (je ca. 25 %).`,
      level === 1
        ? `25 % von ${totalN} = ${quarter} Werte je Viertel.`
        : `50 % von ${totalN} = ${half} Werte liegen zwischen q₁ und q₃.`,
      `Ca. <strong>${level === 1 ? quarter : half}</strong> Werte! Breite bedeutet starke Streuung (nicht mehr Daten).`,
      { totalN, quarter, half },
    );
  },
};

// ─── Generators 4.5 (Boxplots vergleichen) ────────────────────────────────────

const exCompareBoxplots: ExerciseGenerator = {
  id: "boxplot-vergleichen",
  make(rng, level) {
    const medA = rng.int(18, 25);
    const medB = medA + rng.int(3, 6);
    const iqrA = rng.int(10, 14);
    const iqrB = rng.int(4, 6);
    const medDiff = medB - medA;

    return task(
      level,
      `Zwei Klassen A und B schrieben denselben Test (max. 40 Punkte): Klasse A hat Median ${medA} und Boxbreite (q₃ ${MINUS} q₁) = ${iqrA}; Klasse B hat Median ${medB} und Boxbreite ${iqrB}. Berechne den Abstand der beiden Mediane und vergleiche beide Verteilungen.`,
      `Zwei Akku-Marken zeigen im Boxplot folgende Laufzeiten (in h): Marke A (Min = 10, q₁ = ${medA - 5}, Median = ${medA}, q₃ = ${medA + iqrA - 5}, Max = 38), Marke B (Min = 14, q₁ = ${medB - 2}, Median = ${medB}, q₃ = ${medB + iqrB - 2}, Max = 35). Vergleiche typische Laufzeit (Median) und Konstanz der mittleren 50 % (Boxbreite) rechnerisch!`,
      [
        intField("Median-Vorsprung (B − A)", medDiff, undefined, level === 1 ? "Punkte" : "h"),
        intField("Unterschied der Boxbreiten (A − B)", iqrA - iqrB, undefined, level === 1 ? "Punkte" : "h"),
        choiceField(
          "Zutreffender Vergleich",
          [
            "B liegt im Schnitt höher (höherer Median) und die mittleren 50 % streuen enger (kleinere Box)",
            "A ist verlässlicher, weil seine Box viel breiter ist",
            "Weil A das höhere Maximum hat, müssen alle Werte von A größer sein",
          ],
          0,
        ),
      ],
      `Ein höherer Median spricht für ein höheres Leistungsniveau; eine schmalere Box (kleinerer Quartilsabstand q₃ − q₁) bedeutet geringere Streuung (konstanter!).`,
      `Median-Abstand: ${medB} ${MINUS} ${medA} = ${medDiff}; Boxbreite A = ${iqrA}, Boxbreite B = ${iqrB} → Unterschied ${iqrA - iqrB}.`,
      `B liegt beim Median um <strong>${medDiff}</strong> höher und streut in den mittleren 50 % um <strong>${iqrA - iqrB}</strong> enger!`,
      { medA, medB, iqrA, iqrB, medDiff },
    );
  },
};

const exAuditBoxplotClaim: ExerciseGenerator = {
  id: "boxplot-aussage-pruefen",
  make(rng, level) {
    const q1 = rng.int(12, 16);
    const med = q1 + rng.int(4, 6);
    const q3 = med + rng.int(4, 6);
    const max = q3 + rng.int(5, 9);
    const nStudents = rng.pick([20, 24, 28]);

    return task(
      level,
      `Ein Boxplot aus ${nStudents} Werten liefert q₁ = ${q1}, Median = ${med}, q₃ = ${q3}, Max = ${max}. Jemand behauptet: „Mindestens die Hälfte aller Werte liegt bei ${med} oder höher!“ Prüfe diese Aussage anhand der Quartile und gib die Mindestanzahl solcher Werte an.`,
      `In einer Klasse (${nStudents} Personen) zeigen zwei Aussagen über den Boxplot (Min = ${q1 - 3}, q₁ = ${q1}, Median = ${med}, q₃ = ${q3}, Max = ${max}): (1) „Höchstens ein Viertel hat mehr als ${q3} Punkte.“ (2) „Aus dem Boxplot kann man ablesen, dass genau zwei Leute exakt ${med} Punkte erreicht haben.“ Prüfe beide Aussagen und gib 25 % der Klassengröße an.`,
      [
        intField(
          level === 1 ? "Mindestens 50 % der Werte" : "Ein Viertel der Werte (25 %)",
          level === 1 ? nStudents / 2 : nStudents / 4,
        ),
        choiceField(
          "Beurteilung der Aussage(n)",
          level === 1
            ? [
                `Die Behauptung stimmt: Rechts vom Median (${med}) liegen mindestens 50 % (also ≥ ${nStudents / 2}) der Werte`,
                "Sie ist falsch, weil nur ein Viertel rechts vom Median liegt",
                "Man weiß nichts über Werte oberhalb des Medians",
              ]
            : [
                "(1) stimmt nach Definition von q₃; (2) ist falsch – man sieht Einzelwerte im Boxplot (außer evt. Min/Max) nicht direkt",
                "Beide Aussagen (1) und (2) stimmen exakt",
                "(1) ist falsch, denn oberhalb von q₃ liegen immer 75 %",
              ],
          0,
        ),
      ],
      `Ein Boxplot zeigt die Grenzen der Viertel (25 % / 50 % / 75 %), aber nicht die einzelnen Rohdaten dahinter!`,
      level === 1
        ? `Der Median teilt die geordneten ${nStudents} Daten in mindestens ${nStudents / 2} Werte ≤ ${med} und mindestens ${nStudents / 2} Werte ≥ ${med}.`
        : `Oberhalb von q₃ liegen höchstens 25 % (${nStudents / 4} Werte); ob ein einzelner Wert genau zweimal getroffen wurde, verbirgt die Boxplot-Darstellung.`,
      `Ergebnis: <strong>${level === 1 ? nStudents / 2 : nStudents / 4}</strong> Werte; Quartile verraten Anteile, aber keine Häufigkeiten einzelner Zahlen.`,
      { q1, med, q3, max, nStudents },
    );
  },
};

// ─── Stage 4 Lessons (5 Lektionen) ────────────────────────────────────────────

export const STAGE_4_LESSONS = makeLessons([
  {
    id: "da-1-median",
    section: "4",
    title: "4.1 Median und arithmetisches Mittel",
    subtitle: "Die geordnete Mitte bestimmen und beide Mittelwerte gegenüberstellen",
    whyItMatters:
      "„Durchschnitt“ bedeutet im Alltag nicht immer dasselbe: Schon ein einziger Superreicher im Raum treibt das arithmetische Mittel hoch, während der Median ruhig in der Mitte bleibt.",
    explanationHtml: `
      <p>Neben dem aus Klasse 6 bekannten <strong>arithmetischen Mittel</strong> <code>x̄ = (Summe aller Werte) : Anzahl n</code> nutzt die Statistik als zweiten Mittelwert den <strong>Median</strong> (<em>Zentralwert</em>).</p>
      <p><strong>So findest du den Median:</strong> Sortiere alle <em>n</em> Messwerte zuerst unbedingt der Größe nach (von klein nach groß)!</p>
      <ul>
        <li>Ist <em>n</em> <strong>ungerade</strong>, ist der Median genau der Wert in der Mitte (auf Platz <code>(n + 1) : 2</code>).</li>
        <li>Ist <em>n</em> <strong>gerade</strong>, gibt es zwei mittlere Werte – der Median ist deren arithmetisches Mittel.</li>
      </ul>
      <div class="example">
        <strong>Beispiel – Taschengeld in einer Gruppe (n = 6):</strong><br>
        Gemessen: <code>15 €; 10 €; 18 €; 12 €; 80 €; 15 €</code>.<br>
        1. Sortieren: <code>10; 12; 15; 15; 18; 80</code>.<br>
        2. Median: Mittelwert von Platz 3 und 4 → <code>(15 + 15) : 2 = 15 €</code>.<br>
        3. Arithmetisches Mittel: <code>(10 + 12 + 15 + 15 + 18 + 80) : 6 = 150 : 6 = 25 €</code> (hier höher als 5 von 6 Jugendlichen!).
      </div>
      <div class="merke">
        <strong>Merke:</strong> Niemals den Median aus einer unsortierten Liste ablesen! Bei gerader Anzahl mittelst du die beiden innersten Werte der geordneten Reihe.
      </div>
    `,
    formulas: [
      {
        name: "Arithmetisches Mittel",
        html: `x̄ = ${frac("x₁ + x₂ + … + xₙ", "n")}`,
        quantities: "Summe aller n Datenwerte geteilt durch ihre Anzahl n",
      },
      {
        name: "Median (Zentralwert) der geordneten Liste",
        html: "n ungerade: Wert in der Mitte &nbsp;|&nbsp; n gerade: Mittelwert der beiden mittleren Werte",
        quantities: "Liste zuvor immer der Größe nach sortieren",
      },
    ],
    quiz: Q(
      "Die sortierten Punkte von 4 Schülern sind 8; 10; 14; 16. Wie groß ist der Median?",
      "12",
      "10",
      "14",
      "Bei n = 4 (gerade) gibt es zwei mittlere Werte (10 und 14). Ihr arithmetisches Mittel ist (10 + 14) : 2 = 12.",
    ),
    lab: labMedianOrder,
    exercises: [exMedianCompute, exMedianVsMean],
    celebrationMessage:
      "Sehr gut! Du sortierst sicher, bestimmst den Median bei gerader und ungerader Anzahl und vergleichst ihn mit x̄.",
  },
  {
    id: "da-2-ausreisser",
    section: "4",
    title: "4.2 Ausreißer & Aussagekraft der Mittelwerte",
    subtitle: "Wann der Median schützt und wann das arithmetische Mittel unverzichtbar bleibt",
    whyItMatters:
      "Statistiken werden oft gezielt mit dem „passenderen“ Mittelwert präsentiert – erst wenn du beide prüfst, merkst du, ob ein Ausreißer das Bild verzerrt.",
    explanationHtml: `
      <p>Ein einzelner extrem großer oder extrem kleiner Wert heißt <strong>Ausreißer</strong>. Beide Mittelwerte reagieren darauf völlig unterschiedlich:</p>
      <ul>
        <li>Das <strong>arithmetische Mittel</strong> verarbeitet jede einzelne Zahl – ein Ausreißer zieht es stark in seine Richtung.</li>
        <li>Der <strong>Median</strong> hängt fast nur von der <em>Reihenfolge</em> ab und bleibt gegenüber extremen Ausreißern sehr stabil (<strong>ausreißerrobust</strong>).</li>
      </ul>
      <div class="example">
        <strong>Beispiel – wann taugt welcher Wert?</strong><br>
        • <em>Typisches Gehalt in einem Betrieb:</em> 9 Personen verdienen je 2400 €, der Chef 24000 €. Der Median (2400 €) beschreibt das typische Einkommen ehrlich.<br>
        • <em>Gesamte Ausgaben / fairer Kostenanteil:</em> Bei 5 Ausflügen kostet einer besonders viel – um die gesamte Jahreskasse durch 5 zu teilen, braucht man zwingend das <strong>arithmetische Mittel</strong>!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Für das „Typische“ bei schiefen Daten oder Ausreißern eignet sich der <strong>Median</strong>; wenn die <em>Gesamtsumme</em> (= n · x̄) zählt, ist das <strong>arithmetische Mittel</strong> unersetzlich.
      </div>
    `,
    formulas: [
      {
        name: "Gesamtsumme aus arithmetischem Mittel",
        html: "Summe = n · x̄",
        quantities: "Bei Verteilungs- und Kostenfragen spielt jeder einzelne Extremwert eine Rolle",
      },
    ],
    quiz: Q(
      "Bei fünf Messzeiten einer Bahnlinie gibt es eine einmalige Zugverspätung von 90 Minuten (sonst immer ca. 2 Minuten). Welcher Mittelwert steigt dadurch extrem stark an?",
      "Das arithmetische Mittel",
      "Der Median (er springt sofort ebenfalls um fast 18 Minuten)",
      "Beide bleiben unverändert",
      "Das arithmetische Mittel teilt die 90-Minuten-Verspätung auf alle 5 Werte um (+18 min im Schnitt); der Median rückt nur einen Listenplatz weiter (weiterhin ca. 2 min).",
    ),
    lab: labOutlierShift,
    exercises: [exOutlierEffect, exContextChoiceMeanMedian],
    celebrationMessage:
      "Kritisch bewertet! Du erkennst Ausreißereffekte sofort und wählst begründet den passenden Mittelwert.",
  },
  {
    id: "da-3-quartile",
    section: "4",
    title: "4.3 Spannweite und Quartile bestimmen",
    subtitle: "Streuung messen mit Spannweite, unterem Quartil q₁ und oberem Quartil q₃",
    whyItMatters:
      "Zwei Klassen können denselben Median haben – doch in einer streuen die Noten von 1 bis 6, während in der anderen fast alle eng beisammen liegen.",
    explanationHtml: `
      <p>Um die <strong>Streuung</strong> (Verteilungsbreite) eines Datensatzes zu beschreiben, nutzt man neben Minimum und Maximum:</p>
      <ul>
        <li><strong>Spannweite R:</strong> <code>Max − Min</code> (Abstand zwischen größtem und kleinstem Wert).</li>
        <li><strong>Unteres Quartil q₁:</strong> der Median der unteren Datenhälfte (trennt etwa das unterste Viertel ab).</li>
        <li><strong>Oberes Quartil q₃:</strong> der Median der oberen Datenhälfte (trennt etwa das oberste Viertel ab).</li>
        <li><strong>Quartilsabstand:</strong> <code>q₃ − q₁</code> (Streubreite der mittleren 50 % – im Gegensatz zur Spannweite unempfindlich gegen Einzelausreißer!).</li>
      </ul>
      <div class="example">
        <strong>Klare Regel bei ungerader Anzahl (hier bei uns einheitlich verwendet):</strong><br>
        Bei <code>n = 7</code> geordneten Werten bleibt der <strong>Median selbst bei beiden Hälften außen vor</strong>!<br>
        Liste: <code>4; 6; 9 | 12 | 15; 19; 28</code> → Median = <code>12</code>;<br>
        • Untere Hälfte <code>(4; 6; 9)</code> → <strong>q₁ = 6</strong>.<br>
        • Obere Hälfte <code>(15; 19; 28)</code> → <strong>q₃ = 19</strong>.<br>
        • Spannweite: <code>28 − 4 = 24</code>; Quartilsabstand: <code>19 − 6 = 13</code>.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Sortieren nicht vergessen! Bei gerader Anzahl <em>n</em> teilst du die Liste sauber in zwei gleich lange Hälften; bei ungerader Anzahl <em>n</em> bleibt der mittlere Wert (Median) außen vor.
      </div>
    `,
    formulas: [
      {
        name: "Spannweite und Quartilsabstand",
        html: "R = Max − Min &nbsp;|&nbsp; Boxbreite = q₃ − q₁",
        quantities: "Spannweite misst Gesamtbreite (ausreißerempfindlich), q₃ − q₁ die Breite der mittleren 50 %",
      },
    ],
    quiz: Q(
      "Gegeben ist die geordnete Liste 5; 7; 10; 13; 18; 20; 25 (n = 7). Wie lauten q₁ und q₃ (Median ausgeschlossen)?",
      "q₁ = 7 und q₃ = 20",
      "q₁ = 5 und q₃ = 25",
      "q₁ = 8,5 und q₃ = 19",
      "Der Median 13 bleibt außen vor: untere Hälfte (5; 7; 10) → q₁ = 7; obere Hälfte (18; 20; 25) → q₃ = 20.",
    ),
    lab: labQuartilesSplit,
    exercises: [exQuartilesSpan, exInterquartileRange],
    celebrationMessage:
      "Präzise aufgeteilt! Minimum, Quartile, Median, Maximum und Spannweite berechnest du fehlerfrei.",
  },
  {
    id: "da-4-boxplot",
    section: "4",
    title: "4.4 Boxplots erstellen & Software nutzen",
    subtitle: "Die Fünf-Punkte-Zusammenfassung im Kasten-Antennen-Diagramm richtig lesen",
    whyItMatters:
      "Boxplots verdichten hunderte Messwerte in fünf übersichtliche Striche – aber nur, wenn man nicht auf die Länge eines Kastens als „Anzahl“ hereinfällt!",
    explanationHtml: `
      <p>Ein <strong>Boxplot</strong> (Kastengrafik) stellt genau die fünf Kennwerte <code>Min</code>, <code>q₁</code>, <code>Median</code>, <code>q₃</code> und <code>Max</code> auf einer Zahlenskala dar:</p>
      <ul>
        <li>Vom <code>Min</code> bis <code>q₁</code> und von <code>q₃</code> bis <code>Max</code> verlaufen die beiden <strong>Antennen (Whisker)</strong>.</li>
        <li>Zwischen <code>q₁</code> und <code>q₃</code> liegt das zentrale Rechteck, die <strong>Box</strong> (darin der senkrechte Strich für den <strong>Median</strong>).</li>
      </ul>
      <p>Bei größeren Datensätzen (ab 20+ Werten) erstellt man Boxplots am schnellsten mit <strong>Statistik- oder Tabellenkalkulationssoftware</strong>.</p>
      <div class="example">
        <strong>Typischer Trugschluss – „längere Box = mehr Daten“?</strong><br>
        Falsch! Jeder der vier Bereiche (Min–q₁, q₁–Median, Median–q₃, q₃–Max) umfasst unabhängig von seiner optischen Länge stets rund <strong>ein Viertel (25 %)</strong> der Daten!<br>
        Ein <em>langer</em> Abschnitt zeigt lediglich, dass dieses Viertel der Werte <strong>weit auseinanderliegt</strong> (große Streuung), ein <em>kurzer</em> Abschnitt, dass sich die Werte dort dicht drängen.
      </div>
      <div class="merke">
        <strong>Merke:</strong> In der Box (q₁ bis q₃) liegen die mittleren 50 % der Daten. Optische Länge zeigt <em>Streuung</em>, niemals größere Datenanzahl!
      </div>
    `,
    formulas: [
      {
        name: "Fünf-Punkte-Zusammenfassung",
        html: "(Min | q₁ | Median | q₃ | Max)",
        quantities: "Jeder der vier Abschnitte dazwischen enthält ca. 25 % der Messwerte",
      },
    ],
    quiz: Q(
      "Im Boxplot zu 40 Testergebnissen ist die linke Antenne (Min bis q₁) viel länger als die gesamte Box (q₁ bis q₃). Wo liegen mehr Testergebnisse?",
      "In der Box (rund 50 % = ca. 20 Ergebnisse) liegen mehr als in der linken Antenne (rund 25 % = ca. 10)",
      "In der linken Antenne, weil sie auf dem Zahlenstrahl länger gezeichnet ist",
      "In beiden Abschnitten liegen gleich viele (je 25 %), nur sind die Noten gleich",
      "Die Gesamtbox umfasst ZWEI Viertel (q₁ bis Median und Median bis q₃, zusammen ca. 50 %), eine einzelne Antenne nur ein Viertel (ca. 25 %).",
    ),
    lab: labBoxplotBuilder,
    exercises: [exBoxplotFiveSummary, exBoxplotQuarterShare],
    celebrationMessage:
      "Klasse gelesen! Du konstruierst Boxplots aus ihren fünf Werten und entlarvst Längen-Trugschlüsse.",
  },
  {
    id: "da-5-vergleich",
    section: "4",
    title: "4.5 Datensätze mit Boxplots vergleichen",
    subtitle: "Typisches Niveau, Gleichmäßigkeit und Aussagen über zwei Gruppen beurteilen",
    whyItMatters:
      "Ob Schulklassen, Fußballteams oder Akkulaufzeiten: Erst der Vergleich nebeneinanderliegender Boxplots zeigt Niveauunterschiede und Verlässlichkeit.",
    explanationHtml: `
      <p>Stehen zwei oder mehr <strong>Boxplots</strong> übereinander auf derselben Zahlenskala, kannst du sie direkt nach drei Merkmalen vergleichen:</p>
      <ol>
        <li><strong>Lage (Niveau):</strong> Wo liegt der <strong>Median</strong> weiter rechts (bzw. höher)? Dort liegen mind. 50 % über dem Vergleichsniveau.</li>
        <li><strong>Konstanz der Mehrheit:</strong> Welche <strong>Boxbreite (q₃ − q₁)</strong> ist schmaler? Eine enge Box bedeutet gleichmäßigere Ergebnisse im mittleren Bereich.</li>
        <li><strong>Extremwerte & Gesamtstreuung:</strong> Vergleiche <code>Min</code>, <code>Max</code> und <code>Spannweite = Max − Min</code>.</li>
      </ol>
      <div class="example">
        <strong>Beispiel – was man sieht (und was NICHT!):</strong><br>
        Gruppe A hat Median 75 und Boxbreite 8; Gruppe B hat Median 70 und Boxbreite 18.<br>
        • <em>Aussage 1 (belegbar):</em> Gruppe A erzielt typischerweise höhere Ergebnisse (75 &gt; 70) und ist deutlich gleichmäßiger (Box 8 &lt; 18).<br>
        • <em>Aussage 2 (NICHT belegbar!):</em> „In Gruppe A hat jemand genau 76 Punkte“ – einzelne Rohwerte zwischen den Quartilgrenzen kann ein Boxplot nicht sichtbar machen!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Argumentiere beim Vergleichen präzise mit den fünf Kennwerten (Median, q₁, q₃, Boxbreite, Spannweite) – und behaupte nichts über unsichtbare Einzelwerte!
      </div>
    `,
    formulas: [
      {
        name: "Vergleichsleitfaden zweier Boxplots",
        html: "Median → typisches Niveau &nbsp;|&nbsp; q₃ − q₁ → Gleichmäßigkeit der mittleren 50 % &nbsp;|&nbsp; Max − Min → Gesamtbreite",
        quantities: "Auf gemeinsame Skala achten; Einzelwerte zwischen den Grenzen sind nicht ablesbar",
      },
    ],
    quiz: Q(
      "Zwei Buslinien A und B haben denselben Median (2 Min Verspätung), doch A hat Boxbreite 1 Min und B Boxbreite 6 Min. Welche Aussage stimmt?",
      "Linie A fährt deutlich verlässlicher (gleichmäßiger im mittleren Bereich) als Linie B",
      "Linie B ist verlässlicher, weil eine breitere Box mehr Daten enthält",
      "Beide Linien sind völlig ununterscheidbar, da der Median gleich ist",
      "Der identische Median zeigt dasselbe mittlere Niveau; die sechsmal kleinere Boxbreite bei A beweist eine viel geringere Streuung.",
    ),
    lab: labBoxplotCompare,
    exercises: [exCompareBoxplots, exAuditBoxplotClaim],
    celebrationMessage:
      "Lernbereich 4 abgeschlossen! Du beherrschst Median, Quartile, Spannweite und den kritischen Boxplot-Vergleich.",
  },
]);
