import { fmt, frac } from "../exercises/format";
import { CONCEPT_DIAGRAMS } from "./concept-diagrams";
import { Q, task } from "./builders";
import { choiceField, intField, numberField } from "./helpers";
import {
  labCountingTree,
  labLaplaceSymmetryCheck,
  labLaplaceUrnGrid,
  labLawLargeNumbers,
  labSampleSpaceSet,
  labSpreadsheetRefs,
} from "./labs-4-7";
import { makeLessons } from "./make";
import { countingTotal } from "./math";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators LB 5 ────────────────────────────────────────────────────────

const exEventSets: ExerciseGenerator = {
  id: "la-ereignis-menge",
  make(rng, level) {
    const sides = level === 1 ? 6 : rng.pick([8, 10, 12]);
    const thresh = level === 1 ? rng.pick([4, 5]) : rng.int(5, sides - 2);
    const fav = sides - thresh; // strictly greater than thresh: {thresh+1 .. sides}
    const comp = thresh;

    return task(
      level,
      `Ein fairer ${fmt(sides, 0)}-seitiger Würfel wird einmal geworfen (Ω = {1; …; ${fmt(sides, 0)}}). Ereignis E: „Augenzahl ist echt größer als ${fmt(thresh, 0)}“. Bestimme |E| und |Ē|.`,
      `Bei einem Spiel mit einem ${fmt(sides, 0)}-seitigen Würfel gewinnt Ereignis E genau dann, wenn eine Zahl größer als ${fmt(thresh, 0)} fällt. Wie viele Ergebnisse gehören zu E, wie viele zum Gegenereignis Ē?`,
      [
        intField("|E| =", fav, [
          { value: fav + 1, hint: `„Echt größer als ${fmt(thresh, 0)}“ schließt ${fmt(thresh, 0)} selbst nicht mit ein.` },
        ]),
        intField("|Ē| =", comp),
      ],
      `|Ω| = ${fmt(sides, 0)}, und |Ē| = |Ω| − |E|.`,
      `Zu E gehören {${fmt(thresh + 1, 0)}; …; ${fmt(sides, 0)}}, also ${fmt(fav, 0)} Ergebnisse.`,
      `Gegenereignis Ē („höchstens ${fmt(thresh, 0)}“): |Ē| = ${fmt(sides, 0)} − ${fmt(fav, 0)} = <strong>${fmt(comp, 0)}</strong> (und <strong>|E| = ${fmt(fav, 0)}</strong>).`,
      { sides, thresh, fav, comp },
    );
  },
};

const exDetVsRandom: ExerciseGenerator = {
  id: "la-deterministisch-zufall",
  make(rng, level) {
    const isDet = level === 1 ? rng.int(0, 1) === 0 : rng.int(0, 1) === 0;
    const detCases = [
      "Die Summe der drei Innenwinkel in einem beliebigen ebenen Dreieck messen",
      "Den Flächeninhalt eines Quadrats mit bekannter Seitenlänge a = 5 cm berechnen",
      "Den Preis von 4 gleichen Brötchen zu je 0,45 € ausrechnen",
    ];
    const randCases = [
      "Einen sechsseitigen Spielwürfel einmal werfen und die Augenzahl notieren",
      "Ohne Hinsehen eine Kugel aus einer Urne mit roten und blauen Kugeln ziehen",
      "Die nächste geworfene Seite einer Münze vorhersagen",
    ];
    const desc = isDet ? rng.pick(detCases) : rng.pick(randCases);

    return task(
      level,
      `Ordne den Vorgang ein: „${desc}“. Handelt es sich um ein Zufallsexperiment oder einen deterministischen Vorgang?`,
      `Entscheide begründet für die folgende Situation, ob sie als Zufallsexperiment oder als deterministischer (vorherbestimmter) Vorgang modelliert wird: „${desc}“.`,
      [
        choiceField(
          "Einordnung",
          isDet
            ? ["Deterministischer Vorgang (Ergebnis steht eindeutig fest)", "Zufallsexperiment (Ergebnis nicht vorhersehbar)"]
            : ["Zufallsexperiment (Ergebnis ungewiss, wiederholbar)", "Deterministischer Vorgang (Ergebnis steht eindeutig fest)"],
          0,
        ),
      ],
      `Ein Zufallsexperiment ist beliebig oft wiederholbar und hat mindestens zwei mögliche, nicht vorhersagbare Ausgänge.`,
      isDet
        ? `Das Ergebnis lässt sich eindeutig berechnen oder liegt fest — es gibt keine Ungewissheit.`
        : `Es gibt mehrere mögliche Ausgänge, von denen sich im Einzelversuch keiner sicher vorhersagen lässt.`,
      `Richtig: <strong>${isDet ? "Deterministischer Vorgang" : "Zufallsexperiment"}</strong>.`,
      { isDet: isDet ? 1 : 0 },
    );
  },
};

const exRelFreq: ExerciseGenerator = {
  id: "la-rel-haeufigkeit",
  make(rng, level) {
    const total = level === 1 ? rng.pick([20, 25, 50, 100]) : rng.pick([40, 80, 200, 250]);
    const hits = rng.int(Math.floor(total * 0.2), Math.floor(total * 0.75));
    const h = hits / total;

    return task(
      level,
      `Bei ${fmt(total, 0)} Würfen einer Reißzwecke landet sie ${fmt(hits, 0)}-mal auf dem Kopf („Spitze oben“). Berechne die relative Häufigkeit h_n als Dezimalzahl (oder Prozent).`,
      `Ein Computer simuliert ${fmt(total, 0)} Züge und zählt ${fmt(hits, 0)} Treffer. Welcher Schätzwert für die Wahrscheinlichkeit p ergibt sich aus der relativen Häufigkeit h_n?`,
      [
        numberField("h_n =", h, "", 3, {
          slips: [
            { value: total / hits, hint: `Relative Häufigkeit ist k / n (Treffer durch Gesamtzahl), liegt also zwischen 0 und 1.` },
          ],
        }),
      ],
      `Relative Häufigkeit h_n = (absolute Häufigkeit k) / (Gesamtzahl n).`,
      `h_n = ${fmt(hits, 0)} / ${fmt(total, 0)}.`,
      `Als Dezimalzahl: <strong>${fmt(h, 3)}</strong> (= ${fmt(h * 100, 1)} %).`,
      { total, hits, h },
    );
  },
};

const exLawLargeNumbers: ExerciseGenerator = {
  id: "la-grosse-zahlen",
  make(rng, level) {
    const n1 = 20;
    const n2 = 1000;
    const k1 = rng.pick([6, 7, 13, 14]);
    const k2 = level === 1 ? rng.pick([492, 505, 512]) : rng.pick([488, 504, 511]);
    const h1 = k1 / n1;
    const h2 = k2 / n2;

    return task(
      level,
      `Eine Münze wird in zwei Versuchsreihen geworfen: Reihe A mit n = 20 (${fmt(k1, 0)}-mal Wappen → h = ${fmt(h1, 2)}) und Reihe B mit n = 1000 (${fmt(k2, 0)}-mal Wappen → h = ${fmt(h2, 3)}). Welche Reihe liefert den verlässlicheren Schätzwert für p?`,
      `Für ein nicht-symmetrisches Glücksrad liegen zwei Beobachtungen vor: Bei 20 Drehungen gewinnt Sektor Rot ${fmt(k1, 0)}-mal (h = ${fmt(h1, 2)}), bei 1000 Drehungen ${fmt(k2, 0)}-mal (h = ${fmt(h2, 3)}). Begründe nach dem Gesetz der großen Zahlen, welcher Schätzwert belastbarer ist.`,
      [
        numberField(`Relative Häufigkeit Reihe B`, h2, "", 3),
        choiceField(
          "Verlässlicherer Schätzwert",
          [
            `Reihe B (n = 1000), da Schwankungen bei großem n kleiner werden`,
            `Reihe A (n = 20), da kleine Serien genauer sind`,
            `Beide sind genau gleich verlässlich`,
          ],
          0,
        ),
      ],
      `Gesetz der großen Zahlen: Je größer n, desto enger schwankt h_n um p.`,
      `Reihe B hat h = ${fmt(k2, 0)} / 1000 = ${fmt(h2, 3)}.`,
      `Nach dem Gesetz der großen Zahlen ist <strong>Reihe B (h = ${fmt(h2, 3)})</strong> deutlich verlässlicher.`,
      { k1, k2, h1, h2 },
    );
  },
};

const exSpreadsheetCellRef: ExerciseGenerator = {
  id: "la-zellbezug-formel",
  make(rng, level) {
    const rowSum = rng.pick([6, 7, 8]);
    const isAbs = level === 1 ? 0 : 1;

    if (isAbs === 0) {
      return task(
        level,
        `In einer Tabellenkalkulation stehen in B2:B${fmt(rowSum - 1, 0)} die Trefferanzahlen und in B${fmt(rowSum, 0)} die Gesamtzahl n. Welche Formel in C2 lässt sich sauber bis C${fmt(rowSum - 1, 0)} herunterziehen?`,
        "",
        [
          choiceField(
            "Richtige Formel in C2",
            [
              `=B2/$B$${fmt(rowSum, 0)}`,
              `=B2/B${fmt(rowSum, 0)}`,
              `=$B$2/B${fmt(rowSum, 0)}`,
            ],
            0,
          ),
        ],
        `Nur der Bezug auf die Gesamtsumme B${fmt(rowSum, 0)} muss mit $-Zeichen fixiert werden.`,
        `B2 bleibt relativ (wird beim Ziehen zu B3, B4, …), während $B$${fmt(rowSum, 0)} fest verankert bleibt.`,
        `Korrekte Formel: <strong>=B2/$B$${fmt(rowSum, 0)}</strong>.`,
        { rowSum },
      );
    }

    const total = rng.pick([120, 200, 250]);
    const k = rng.pick([30, 60, 90]);
    const h = k / total;
    return task(
      level,
      "",
      `In B2 steht die Anzahl ${fmt(k, 0)}, in Zelle B${fmt(rowSum, 0)} die Summe ${fmt(total, 0)}, und in C2 die Formel <code>=B2/$B$${fmt(rowSum, 0)}</code>. Welchen Wert zeigt C2 an, und warum darf das $-Zeichen nicht fehlen?`,
      [
        numberField("Wert in C2 =", h, "", 2),
        choiceField(
          "Grund für $B$" + fmt(rowSum, 0),
          [
            `Ohne $ wandert der Bezug beim Herunterziehen auf leere Zellen unterhalb von B${fmt(rowSum, 0)}`,
            `Ohne $ rundet die Tabelle automatisch auf ganze Zahlen`,
            `Das $-Zeichen wandelt Zahlen automatisch in Euro um`,
          ],
          0,
        ),
      ],
      "",
      `C2 berechnet ${fmt(k, 0)} / ${fmt(total, 0)} = ${fmt(h, 2)}.`,
      `Wert: <strong>${fmt(h, 2)}</strong> — der absolute Bezug <code>$B$${fmt(rowSum, 0)}</code> verhindert Fehler beim Kopieren.`,
      { rowSum, total, k, h },
    );
  },
};

const exFreqTableSim: ExerciseGenerator = {
  id: "la-haeufigkeit-tabelle",
  make(rng, level) {
    const n = rng.pick([100, 120, 160, 200]);
    const k1 = rng.int(12, 30);
    const k2 = rng.int(12, 30);
    const k3 = n - k1 - k2;
    const h3 = k3 / n;

    return task(
      level,
      `Bei ${fmt(n, 0)} Würfen trat Ergebnis 1 genau ${fmt(k1, 0)}-mal und Ergebnis 2 genau ${fmt(k2, 0)}-mal auf. Bestimme die fehlende Anzahl k₃ und die relative Häufigkeit h₃ von Ergebnis 3.`,
      `Eine Tabellenkalkulation fasst ${fmt(n, 0)} Zufallszahlen mit drei möglichen Ausgängen zusammen: Ausgang 1 (${fmt(k1, 0)}), Ausgang 2 (${fmt(k2, 0)}). Berechne die restliche Häufigkeit k₃ und den Anteil h₃.`,
      [
        intField(
          "k₃ =",
          k3,
          k1 + k2 !== k3
            ? [{ value: k1 + k2, hint: `Subtrahiere k₁ + k₂ = ${fmt(k1 + k2, 0)} von der Gesamtzahl ${fmt(n, 0)}.` }]
            : undefined,
        ),
        numberField("h₃ =", h3, "", 3),
      ],
      `Alle absoluten Häufigkeiten addieren sich zu n = ${fmt(n, 0)}.`,
      `k₃ = ${fmt(n, 0)} − (${fmt(k1, 0)} + ${fmt(k2, 0)}) = ${fmt(k3, 0)}.`,
      `Relative Häufigkeit: h₃ = ${fmt(k3, 0)} / ${fmt(n, 0)} = <strong>${fmt(h3, 3)}</strong> (bei <strong>k₃ = ${fmt(k3, 0)}</strong>).`,
      { n, k1, k2, k3, h3 },
    );
  },
};

const exLaplaceCheck: ExerciseGenerator = {
  id: "la-laplace-pruefen",
  make(rng, level) {
    const isLaplace = level === 1 ? rng.int(0, 1) === 1 : rng.int(0, 1) === 1;
    const laplaceExamples = [
      "Eine ideale, gleichmäßige Münze einmal werfen (Kopf / Zahl)",
      "Aus einem verdeckten 32er-Skatblatt zufällig eine Karte ziehen",
      "Ein Glücksrad mit 8 genau gleich großen Sektoren (je 45°) einmal drehen",
    ];
    const nonLaplaceExamples = [
      "Eine Reißzwecke werfen und prüfen, ob sie auf dem Rücken oder der Seite landet",
      "Die Augensumme zweier Würfel betrachten (mögliche Summen 2 bis 12)",
      "Ein Glücksrad mit den Sektoren 180°, 90° und 90° drehen",
    ];
    const expText = isLaplace ? rng.pick(laplaceExamples) : rng.pick(nonLaplaceExamples);

    return task(
      level,
      `Prüfe, ob ein Laplace-Experiment vorliegt: „${expText}“.`,
      `Lässt sich der Vorgang „${expText}“ sinnvoll mit der Annahme der Gleichwahrscheinlichkeit (Laplace-Modell) beschreiben?`,
      [
        choiceField(
          "Laplace-Experiment?",
          isLaplace
            ? ["Ja, alle Elementarereignisse sind aus Symmetriegründen gleich wahrscheinlich", "Nein, die Ergebnisse haben unterschiedliche Wahrscheinlichkeiten"]
            : ["Nein, die Elementarereignisse sind nicht gleich wahrscheinlich", "Ja, alle Ergebnisse sind gleich wahrscheinlich"],
          0,
        ),
      ],
      `Bei einem Laplace-Experiment muss jedes mögliche Ergebnis exakt dieselbe Chance 1/|Ω| besitzen.`,
      isLaplace
        ? `Alle Ergebnisse sind symmetrisch und gleichberechtigt.`
        : `Verschiedene Ergebnisse treten unterschiedlich leicht oder häufig ein (z. B. Summe 7 öfter als 2, bzw. 180° doppelt so oft wie 90°).`,
      `<strong>${isLaplace ? "Ja, Laplace-Experiment" : "Nein, kein Laplace-Experiment"}</strong>.`,
      { isLaplace: isLaplace ? 1 : 0 },
    );
  },
};

const exSectorProb: ExerciseGenerator = {
  id: "la-sektor-anteil",
  make(rng, level) {
    const angle = rng.pick([36, 45, 72, 90, 108, 120, 144, 180]);
    const p = angle / 360;
    const color = level === 1 ? "Rot" : "Blau";

    return task(
      level,
      `Auf einem nicht-Laplace-Glücksrad nimmt der Sektor „${color}“ einen Mittelpunktswinkel von ${fmt(angle, 0)}° ein. Mit welcher Wahrscheinlichkeit bleibt der Zeiger auf „${color}“ stehen?`,
      `Ein Glücksrad ist in ungleich große Felder unterteilt; Sektor „${color}“ misst ${fmt(angle, 0)}° (Vollkreis = 360°). Berechne P(${color}) als Dezimalzahl (oder Bruch).`,
      [
        numberField(`P(${color}) =`, p, "", 3, {
          slips: [
            { value: 360 / angle, hint: `Teile den Sektorwinkel ${fmt(angle, 0)}° durch den Vollkreis 360°, nicht umgekehrt.` },
          ],
        }),
      ],
      `Anteil am Vollkreis: P = α / 360°.`,
      `P(${color}) = ${fmt(angle, 0)}° / 360°.`,
      `Ergebnis: <strong>${fmt(p, 3)}</strong> (= ${fmt(p * 100, 1)} %).`,
      { angle, p },
    );
  },
};

const exLaplaceBasic: ExerciseGenerator = {
  id: "la-laplace-basis",
  make(rng, level) {
    const r = rng.int(2, 6);
    const b = rng.int(2, 6);
    const g = rng.int(1, 5);
    const total = r + b + g;
    const pickRed = level === 1 ? true : rng.int(0, 1) === 0;
    const fav = pickRed ? r : r + b;
    const p = fav / total;
    const label = pickRed ? "eine rote Kugel" : "eine rote oder blaue Kugel";

    return task(
      level,
      `In einer Urne liegen ${fmt(r, 0)} rote, ${fmt(b, 0)} blaue und ${fmt(g, 0)} grüne Kugeln (alle gleich groß). Eine Kugel wird blind gezogen. Berechne die Laplace-Wahrscheinlichkeit für ${label}.`,
      `Bei einem Gewinnspiel zieht man eine von insgesamt ${fmt(total, 0)} identischen Kugeln (${fmt(r, 0)} rot, ${fmt(b, 0)} blau, ${fmt(g, 0)} grün). Mit welcher Wahrscheinlichkeit zieht man ${label}?`,
      [
        numberField("P(E) =", p, "", 3, {
          slips: [{ value: total / fav, hint: `Laplace-Formel: günstige durch mögliche, also |E| / |Ω| ≤ 1.` }],
        }),
      ],
      `P(E) = |E| / |Ω| = (Anzahl günstiger Kugeln) / (Gesamtzahl Kugeln).`,
      `Gesamtzahl |Ω| = ${fmt(r, 0)} + ${fmt(b, 0)} + ${fmt(g, 0)} = ${fmt(total, 0)}, günstig |E| = ${fmt(fav, 0)}.`,
      `P(E) = ${fmt(fav, 0)} / ${fmt(total, 0)} ≈ <strong>${fmt(p, 3)}</strong>.`,
      { r, b, g, total, fav, p },
    );
  },
};

const exComplementProb: ExerciseGenerator = {
  id: "la-gegenereignis",
  make(rng, level) {
    const total = rng.pick([10, 12, 15, 20, 25]);
    const special = rng.int(2, Math.floor(total * 0.4));
    const pSpecial = special / total;
    const pComp = (total - special) / total;

    return task(
      level,
      `Unter ${fmt(total, 0)} gleichartigen Losen sind genau ${fmt(special, 0)} Nieten. Berechne die Wahrscheinlichkeit für das Gegenereignis „keine Niete (Gewinn)“ über P(Ē) = 1 − P(E).`,
      `In einem ${fmt(total, 0)}-Felder-Glücksrad (alle gleich groß) führen ${fmt(special, 0)} Felder zum Aussetzen. Wie groß ist die Wahrscheinlichkeit, NICHT aussetzen zu müssen?`,
      [
        numberField("P(Ē) =", pComp, "", 3, {
          slips: [{ value: pSpecial, hint: `${fmt(pSpecial, 3)} ist P(E); gesucht ist das Gegenereignis 1 − P(E).` }],
        }),
      ],
      `Berechne zuerst P(E) = ${fmt(special, 0)} / ${fmt(total, 0)}, dann 1 − P(E).`,
      `P(E) = ${fmt(special, 0)} / ${fmt(total, 0)} = ${fmt(pSpecial, 3)}.`,
      `P(Ē) = 1 − ${fmt(pSpecial, 3)} = <strong>${fmt(pComp, 3)}</strong>.`,
      { total, special, pSpecial, pComp },
    );
  },
};

const exCountingPrinciple: ExerciseGenerator = {
  id: "la-zaehlprinzip",
  make(rng, level) {
    const n1 = rng.int(3, 5);
    const n2 = rng.int(2, 4);
    const n3 = level === 1 ? 1 : rng.int(2, 4);
    const total = level === 1 ? countingTotal([n1, n2]) : countingTotal([n1, n2, n3]);

    return task(
      level,
      `Für ein Menü gibt es ${fmt(n1, 0)} Hauptgerichte und ${fmt(n2, 0)} Desserts. Wie viele verschiedene Kombinationen lassen sich nach dem Zählprinzip zusammenstellen?`,
      `Ein Zahlenschloss besitzt drei drehbare Räder mit ${fmt(n1, 0)}, ${fmt(n2, 0)} bzw. ${fmt(n3, 0)} Ziffern. Berechne mit dem Zählprinzip die Gesamtzahl aller möglichen Codes.`,
      [
        intField("Anzahl Kombinationen", total, [
          { value: level === 1 ? n1 + n2 : n1 + n2 + n3, hint: `Beim Zählprinzip werden die Möglichkeiten der Stufen multipliziert, nicht addiert.` },
        ]),
      ],
      `Zählprinzip: Möglichkeiten je Stufe multiplizieren.`,
      level === 1 ? `${fmt(n1, 0)} · ${fmt(n2, 0)} = ${fmt(total, 0)}.` : `${fmt(n1, 0)} · ${fmt(n2, 0)} · ${fmt(n3, 0)} = ${fmt(total, 0)}.`,
      `Es gibt insgesamt <strong>${fmt(total, 0)}</strong> Möglichkeiten.`,
      { n1, n2, n3, total },
    );
  },
};

const exTreeLaplace: ExerciseGenerator = {
  id: "la-baum-laplace",
  make(rng, level) {
    // 2 coins or coin + die or 2 spinner draws with Laplace outcomes
    const sides = rng.pick([4, 6]);
    const total = 2 * sides;
    const fav = level === 1 ? 1 : rng.int(2, 3); // e.g. Kopf & Zahl > sides - fav
    const minNum = sides - fav + 1;
    const p = fav / total;

    return task(
      level,
      `Erst wird eine faire Münze geworfen (K, Z), dann ein fairer ${fmt(sides, 0)}-seitiger Würfel. Wie viele Pfade hat das Baumdiagramm insgesamt, und wie groß ist die Wahrscheinlichkeit für „(Kopf; ${fmt(sides, 0)})“?`,
      `Zweistufiges Laplace-Experiment: Münze (K, Z) und anschließend ${fmt(sides, 0)}-seitiger Würfel. Bestimme die Gesamtzahl aller Pfade |Ω| und die Wahrscheinlichkeit für „Kopf UND Zahl mindestens ${fmt(minNum, 0)}“.`,
      [
        intField("Pfade |Ω| =", total, [
          { value: 2 + sides, hint: `Zählprinzip: 2 · ${fmt(sides, 0)}, nicht 2 + ${fmt(sides, 0)}.` },
        ]),
        numberField("P(E) =", level === 1 ? 1 / total : p, "", 3),
      ],
      `Alle Pfade sind hier gleich wahrscheinlich, daher gilt P(E) = (günstige Pfade) / (Gesamtpfade).`,
      `Stufe 1 hat 2 Äste, Stufe 2 jeweils ${fmt(sides, 0)} Äste → |Ω| = 2 · ${fmt(sides, 0)} = ${fmt(total, 0)}.`,
      level === 1
        ? `Genau 1 Pfad führt zu (K; ${fmt(sides, 0)}) → P = 1 / ${fmt(total, 0)} ≈ <strong>${fmt(1 / total, 3)}</strong>.`
        : `${fmt(fav, 0)} günstige Pfade → P = ${fmt(fav, 0)} / ${fmt(total, 0)} ≈ <strong>${fmt(p, 3)}</strong>.`,
      { sides, total, fav, p },
    );
  },
};

export const STAGE_5_LESSONS = makeLessons([
  {
    id: "la-1-zufall",
    section: "5",
    title: "Zufallsexperimente, Ergebnismenge und Ereignisse",
    subtitle: "Vom Zufall zum deterministischen Vorgang abgrenzen und Mengen notieren",
    whyItMatters: "Klare Mengenbegriffe trennen den einzelnen Ausgang eines Wurfs sauber vom zusammengefassten Gewinnereignis.",
    explanationHtml: `<p>Ein Vorgang heißt <strong>Zufallsexperiment</strong>, wenn er mindestens zwei mögliche Ausgänge hat, unter gleichen Bedingungen wiederholbar ist und das Ergebnis im Einzelfall nicht sicher vorhersagbar ist. Steht der Ausgang eindeutig fest, spricht man von einem <strong>deterministischen Vorgang</strong>.</p>
<ul><li><strong>Ergebnis:</strong> Ein einzelner Ausgang (z. B. 4 beim Würfeln).</li><li><strong>Ergebnismenge Ω:</strong> Menge aller möglichen Ergebnisse, z. B. Ω = {1; 2; 3; 4; 5; 6}.</li><li><strong>Ereignis E:</strong> Eine Teilmenge von Ω (z. B. „gerade Zahl“: E = {2; 4; 6}).</li><li><strong>Gegenereignis Ē:</strong> Alle Ergebnisse aus Ω, die nicht in E liegen (Ē = {1; 3; 5}).</li></ul>
${CONCEPT_DIAGRAMS.la1}
<div class="example"><strong>Beispiel:</strong> Einmaliges Werfen eines 6er-Würfels.<br>Ω = {1; 2; 3; 4; 5; 6} mit |Ω| = 6.<br>Ereignis E = „gerade Zahl“ = {2; 4; 6} (|E| = 3).<br>Gegenereignis Ē = „ungerade Zahl“ = {1; 3; 5} (|Ē| = 3).</div>
<div class="merke"><strong>Merke:</strong> Jedes Ergebnis aus Ω gehört entweder zu E oder zu Ē — niemals zu beiden gleichzeitig: |E| + |Ē| = |Ω|.</div>`,
    formulas: [
      { name: "Gegenereignis", html: "|E| + |Ē| = |Ω|", quantities: "Ω Ergebnismenge, E Ereignis, Ē Gegenereignis" },
    ],
    quiz: Q(
      "Beim normalen 6er-Würfel ist E = {5; 6}. Wie lautet das Gegenereignis Ē?",
      "Ē = {1; 2; 3; 4} („höchstens 4“)",
      "Ē = {1; 2; 3; 4; 5}",
      "Ē = {6}",
      "Das Gegenereignis enthält genau alle Elemente aus Ω = {1; 2; 3; 4; 5; 6}, die nicht in E liegen.",
    ),
    lab: labSampleSpaceSet,
    exercises: [exEventSets, exDetVsRandom],
    celebrationMessage: "Du beschreibst Zufallsexperimente präzise mit Fachbegriffen.",
  },
  {
    id: "la-2-haeufigkeit",
    section: "5",
    title: "Relative Häufigkeit und Gesetz der großen Zahlen",
    subtitle: "Wie aus Versuchsreihen verlässliche Schätzwerte für Wahrscheinlichkeiten werden",
    whyItMatters: "Wenn Symmetrie fehlt (z. B. beim Wetter, bei Würfeln mit Fehlstellen oder Qualitätstests), hilft nur empirisches Zählen.",
    explanationHtml: `<p>Führt man ein Zufallsexperiment n-mal durch und tritt ein Ereignis E dabei k-mal auf (<em>absolute Häufigkeit</em>), so heißt der Quotient <strong>h<sub>n</sub>(E) = k / n</strong> die <strong>relative Häufigkeit</strong>.</p>
<p><strong>Empirisches Gesetz der großen Zahlen:</strong> Bei kurzen Versuchsreihen schwankt h<sub>n</sub> oft stark. Wiederholt man das Experiment jedoch sehr oft (großes n), stabilisiert sich h<sub>n</sub>(E) um einen festen Wert — die Wahrscheinlichkeit P(E).</p>
${CONCEPT_DIAGRAMS.la2}
<div class="example"><strong>Beispiel Münzwurf:</strong><br>• n = 20 Würfe: 7-mal Wappen → h₂₀ = 7/20 = 0,35 (starke Abweichung von 0,5).<br>• n = 1000 Würfe: 504-mal Wappen → h₁₀₀₀ = 504/1000 = 0,504 (sehr nah an 0,5).</div>
<div class="merke"><strong>Merke:</strong> Je größer die Versuchszahl n, desto besser eignet sich die relative Häufigkeit h<sub>n</sub> als Schätzwert für die Wahrscheinlichkeit P(E).</div>`,
    formulas: [
      { name: "Relative Häufigkeit", html: `h<sub>n</sub>(E) = ${frac("k", "n")}`, quantities: "k absolute Häufigkeit, n Gesamtzahl der Versuche" },
    ],
    quiz: Q(
      "Wann eignet sich eine relative Häufigkeit besonders gut als Schätzwert für die Wahrscheinlichkeit?",
      "Wenn das Zufallsexperiment sehr oft unter gleichen Bedingungen wiederholt wurde (großes n).",
      "Wenn nur ein einziger Versuch durchgeführt wurde.",
      "Nur dann, wenn k gleich n ist.",
      "Nach dem Gesetz der großen Zahlen nehmen zufällige Schwankungen erst bei großem n ab.",
    ),
    lab: labLawLargeNumbers,
    exercises: [exRelFreq, exLawLargeNumbers],
    celebrationMessage: "Du verstehst relative Häufigkeiten und das Gesetz der großen Zahlen.",
  },
  {
    id: "la-3-tabelle-sim",
    section: "5",
    title: "Zufall mit Tabellenkalkulation auswerten",
    subtitle: "Relativer vs. absoluter Zellbezug ($B$5) beim Auswerten von Häufigkeiten",
    whyItMatters: "Ohne $-Fixierung verrutscht beim Herunterziehen einer Formel sofort der Bezug auf die Gesamtzahl n.",
    explanationHtml: `<p>Für große Versuchsreihen nutzt man in der Praxis eine <strong>Tabellenkalkulation</strong>. Beim Kopieren („Herunterziehen“) einer Formel unterscheiden Programme zwei Arten von Zellbezügen:</p>
<ul><li><strong>Relativer Zellbezug (z. B. B2):</strong> Passt sich beim Ziehen nach unten automatisch auf B3, B4, … an — ideal für die einzelnen Trefferzeilen.</li><li><strong>Absoluter Zellbezug (z. B. $B$5):</strong> Die $-Zeichen halten Spalte und Zeile fest — unverzichtbar für die Zelle mit der Gesamtzahl n!</li></ul>
${CONCEPT_DIAGRAMS.la3}
<div class="example"><strong>Beispiel:</strong> In B2 steht 48, in B3 steht 52, in B5 steht die Summe 100.<br>Formel in C2: <code>=B2/$B$5</code> → 0,48.<br>Heruntergezogen nach C3: <code>=B3/$B$5</code> → 0,52! Ohne $ würde dort <code>=B3/B6</code> stehen und durch Null teilen.</div>
<div class="merke"><strong>Merke:</strong> Relativer Bezug wandert mit, absoluter Bezug mit <code>$</code> bleibt beim Kopieren fest verankert.</div>`,
    formulas: [
      { name: "Relative Häufigkeit in Tabelle", html: "<code>=B2/$B$5</code>", quantities: "B2 relativ (Treffer), $B$5 absolut (Gesamtzahl n)" },
    ],
    quiz: Q(
      "Du ziehst die Formel =B2/$B$8 von C2 eine Zeile tiefer nach C3. Wie lautet die Formel in C3?",
      "=B3/$B$8",
      "=B3/$B$9",
      "=B2/$B$8",
      "Der relative Bezug B2 wird zu B3 hochgezählt; der absolute Bezug $B$8 bleibt unverändert stehen.",
    ),
    lab: labSpreadsheetRefs,
    exercises: [exSpreadsheetCellRef, exFreqTableSim],
    celebrationMessage: "Du setzt relative und absolute Zellbezüge sicher ein.",
  },
  {
    id: "la-4-laplace-abgrenzen",
    section: "5",
    title: "Laplace-Experimente abgrenzen",
    subtitle: "Wann sind alle Elementarereignisse gleich wahrscheinlich?",
    whyItMatters: "Die bequeme Formel „günstig durch möglich“ funktioniert falsch, wenn ein Glücksrad oder Würfel nicht fair gebaut ist!",
    explanationHtml: `<p>Ein Zufallsexperiment heißt <strong>Laplace-Experiment</strong>, wenn <strong>alle möglichen Elementarereignisse exakt die gleiche Wahrscheinlichkeit</strong> besitzen (z. B. fairer Würfel, ideale Münze, Glücksrad mit gleich großen Sektoren).</p>
<p>Ist diese Symmetrie verletzt (z. B. Reißzwecke, gezinkter Würfel, ungleich große Glücksrad-Sektoren oder Augensumme zweier Würfel), liegt <em>kein</em> Laplace-Experiment vor — dann darf man nicht einfach 1/|Ω| ansetzen.</p>
${CONCEPT_DIAGRAMS.la4}
<div class="example"><strong>Beispiel Vergleich:</strong><br>• Glücksrad mit 4 Sektoren zu je 90° → alle gleich wahrscheinlich (je 1/4) → <strong>Laplace</strong>.<br>• Glücksrad mit Sektoren 180°, 90°, 90° → 180° ist doppelt so wahrscheinlich (1/2 statt 1/3) → <strong>kein Laplace</strong>!</div>
<div class="merke"><strong>Merke:</strong> Prüfe vor jeder Rechnung: Haben wirklich alle einzelnen Ergebnisse in Ω dieselbe Chance?</div>`,
    formulas: [
      { name: "Laplace-Bedingung", html: `P({ω}) = ${frac("1", "|Ω|")} für alle ω ∈ Ω`, quantities: "alle Elementarereignisse sind gleich wahrscheinlich" },
    ],
    quiz: Q(
      "Warum ist das Bestimmen der Augensumme zweier normaler Würfel (2 bis 12) KEIN Laplace-Experiment?",
      "Weil manche Summen (wie 7) durch viele Paare entstehen und viel häufiger sind als z. B. 2 oder 12.",
      "Weil zwei Würfel keine Zahlen zeigen.",
      "Weil die Summe 12 unmöglich ist.",
      "Für Summe 7 gibt es 6 Paare, für Summe 2 nur ein einziges Paar (1|1) — die elf Summen sind nicht gleich wahrscheinlich.",
    ),
    lab: labLaplaceSymmetryCheck,
    exercises: [exLaplaceCheck, exSectorProb],
    celebrationMessage: "Du erkennst zuverlässig, wann das Laplace-Modell trägt.",
  },
  {
    id: "la-5-laplace-rechnen",
    section: "5",
    title: "Laplace-Wahrscheinlichkeiten berechnen",
    subtitle: "Die Laplace-Formel und die Gegenereignis-Regel P(Ē) = 1 − P(E)",
    whyItMatters: "Mit wenigen Zeilen Rechnung bestimmst du exakte Gewinnchancen — und über 1 − P(Ē) oft mit einem einzigen Schritt.",
    explanationHtml: `<p>Bei einem Laplace-Experiment gilt die zentrale Formel:</p>
<p class="formula-line">P(E) = ${frac("|E|", "|Ω|")} = ${frac("Anzahl der für E günstigen Ergebnisse", "Anzahl aller möglichen Ergebnisse")}</p>
<p>Weil die Wahrscheinlichkeit des sicheren Ereignisses Ω gleich 1 ist, gilt für das Gegenereignis stets <strong>P(Ē) = 1 − P(E)</strong>.</p>
${CONCEPT_DIAGRAMS.la5}
<div class="example"><strong>Beispiel Urne:</strong> 3 rote, 2 blaue, 5 grüne Kugeln (|Ω| = 10).<br>• P(rot) = ${frac("3", "10")} = 0,30 (= 30 %).<br>• P(nicht rot) = 1 − 0,30 = 0,70 (= 70 %).</div>
<div class="merke"><strong>Merke:</strong> Jede Wahrscheinlichkeit liegt zwischen 0 und 1 (bzw. 0 % und 100 %). Bei „mindestens eine“ oder „nicht …“ spart das Gegenereignis oft viel Zählarbeit.</div>`,
    formulas: [
      { name: "Laplace-Formel", html: `P(E) = ${frac("|E|", "|Ω|")}`, quantities: "nur bei gleichwahrscheinlichen Elementarereignissen" },
      { name: "Gegenereignis", html: "P(Ē) = 1 − P(E)", quantities: "P(E) + P(Ē) = 1" },
    ],
    quiz: Q(
      "In einer Box liegen 4 gelbe und 8 blaue Kugeln. Wie groß ist P(nicht gelb)?",
      "2/3 (≈ 0,667)",
      "1/3 (≈ 0,333)",
      "1/2 (= 0,5)",
      "P(gelb) = 4/12 = 1/3, also P(nicht gelb) = 1 − 1/3 = 2/3.",
    ),
    lab: labLaplaceUrnGrid,
    exercises: [exLaplaceBasic, exComplementProb],
    celebrationMessage: "Du berechnest Laplace-Wahrscheinlichkeiten sicher.",
  },
  {
    id: "la-6-zaehlprinzip-baum",
    section: "5",
    title: "Zählprinzip und Baumdiagramme",
    subtitle: "Mehrstufige Laplace-Experimente strukturiert abzählen",
    whyItMatters: "Ob Passwort-Kombinationen oder zwei Würfe nacheinander: Bäume machen alle Pfade sichtbar, das Zählprinzip zählt sie blitzschnell.",
    explanationHtml: `<p>Besteht ein Laplace-Experiment aus mehreren Teilvorgängen (Stufen), hilft ein <strong>Baumdiagramm</strong>: Jede Stufe bildet eine neue Verzweigungsebene, und jedes Blatt ganz rechts entspricht einem vollständigen Ergebnis (Pfad).</p>
<p><strong>Zählprinzip:</strong> Gibt es auf Stufe 1 genau n₁ Möglichkeiten, auf Stufe 2 jeweils n₂ Möglichkeiten usw., so lautet die Gesamtzahl aller Pfade: <strong>|Ω| = n₁ · n₂ · …</strong></p>
${CONCEPT_DIAGRAMS.la6}
<div class="example"><strong>Beispiel Münze + 3er-Glücksrad:</strong><br>Stufe 1: 2 Möglichkeiten (K, Z). Stufe 2: jeweils 3 Möglichkeiten (1, 2, 3).<br>Gesamtzahl der Pfade: |Ω| = 2 · 3 = 6.<br>Jeder Pfad hat als Laplace-Ergebnis dieselbe Wahrscheinlichkeit 1/6.</div>
<div class="merke"><strong>Merke:</strong> Im Baumdiagramm siehst du alle Pfade einzeln; sind auf jeder Stufe die Teilausgänge gleich wahrscheinlich, erhält jeder Pfad denselben Anteil 1 / |Ω|.</div>`,
    formulas: [
      { name: "Zählprinzip", html: "|Ω| = n₁ · n₂ · … · n<sub>k</sub>", quantities: "Produkt der Verzweigungsmöglichkeiten je Stufe" },
    ],
    quiz: Q(
      "Ein fairer Würfel wird zweimal geworfen. Wie viele mögliche Ergebnisse (Pfade) hat Ω?",
      "36 (= 6 · 6)",
      "12 (= 6 + 6)",
      "6",
      "Nach dem Zählprinzip hat jede der 6 Möglichkeiten des ersten Wurfs 6 Möglichkeiten beim zweiten Wurf: 6 · 6 = 36.",
    ),
    lab: labCountingTree,
    exercises: [exCountingPrinciple, exTreeLaplace],
    celebrationMessage: "Etappe 5 geschafft: Du beherrschst Laplace-Experimente, Bäume und das Zählprinzip!",
  },
]);
