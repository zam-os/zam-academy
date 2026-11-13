import { choiceField, near, numberField } from "./helpers";
import {
  BOTH,
  lab,
  makeLesson,
  makeStage,
  output,
  range,
  state,
  task,
} from "./builders";
import { fmt, frac } from "../exercises/format";

const LB: [number | null, number] = [6, 6];

// Deterministischer Pseudo-Zufallsgenerator fuer reproduzierbare Spin-Buttons im Labor
function simulateSpins(trialsNow: number, count: number, win: number, totalSeg: number): number {
  let addHits = 0;
  for (let i = 1; i <= count; i++) {
    const h = (((trialsNow + i) * 2654435761) >>> 0) % totalSeg;
    if (h < win) addHits++;
  }
  return addHits;
}

export const STAGE_ZUFALL = makeStage(
  6,
  "Zufallsexperimente & Wahrscheinlichkeit",
  "Zufallsexperimente und Laplace-Versuche verstehen, absolute sowie relative Häufigkeiten bestimmen, Gesetz der Großen Zahl erforschen und Gewinnchancen bewerten",
  "#dc2626",
  "🎲",
  LB,
  [
    // 6.1 Zufallsexperimente, Laplace & absolute Häufigkeiten (R + M)
    makeLesson(6, 1, LB, {
      id: "zf-1-zufall-laplace",
      title: "Zufallsexperimente & Laplace-Versuche",
      subtitle: "Ergebnisse erfassen, Laplace-Eigenschaft erkennen und absolute Häufigkeiten vergleichen",
      tracks: BOTH,
      whyItMatters:
        "Im Physik- oder Chemieunterricht führt dieselbe Bedingung meist zum gleichen Resultat — beim Würfeln, Münzwurf oder Glücksrad ist das einzelne Ergebnis nicht vorhersehbar.",
      explanationHtml: `
        <p>Ein <strong>Zufallsexperiment</strong> lässt sich beliebig oft unter gleichen Bedingungen wiederholen, hat mindestens zwei mögliche Ergebnisse und sein Ausgang ist nicht sicher vorhersagbar.</p>
        <div class="example">
          <strong>Beispiel:</strong> Ein fairer 6-seitiger Würfel ist ein <strong>Laplace-Experiment</strong>: Jede der 6 Zahlen hat exakt dieselbe Chance (1/6).<br>
          Ein Reißzweckenwurf (Spitze oben vs. Seite) oder ein Glücksrad mit unterschiedlich breiten Feldern ist <em>kein</em> Laplace-Experiment!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Die <strong>absolute Häufigkeit H</strong> zählt schlicht, wie oft ein Ereignis eingetreten ist (z. B. 14 Treffer). Sie reicht für faire Vergleiche nur aus, wenn beide Spieler gleich viele Versuche hatten!
        </div>
      `,
      formulas: [
        {
          name: "Laplace-Wahrscheinlichkeit",
          html: `P(E) = ${frac("Anzahl günstiger Ergebnisse", "Anzahl aller möglichen Ergebnisse")}`,
          quantities: "Gilt nur, wenn alle Ergebnisse genau gleich wahrscheinlich sind",
        },
      ],
      quiz: {
        question: "Welches dieser Experimente ist ein echtes Laplace-Experiment?",
        options: [
          "Werfen eines symmetrischen 6-seitigen Spielwürfels",
          "Werfen einer Reißzwecke auf den Tisch",
          "Drehen eines Glücksrads mit 1 großen und 2 schmalen Feldern",
        ],
        correctIndex: 0,
        explanation:
          "Nur beim fairen Würfel hat jede Seite exakt dieselbe Form und dieselbe Wahrscheinlichkeit 1/6.",
      },
      lab: lab(
        "chance-wheel",
        "Glücksrad & Laplace-Bedingung testen",
        "Wähle gleiche vs. ungleiche Trefferfelder und drehe per Button eine Versuchsserie am Glücksrad.",
        [
          range("win", "Trefferfelder", 1, 7, 3, 1),
          range("totalSeg", "Felder gesamt", 4, 8, 8, 2),
          state("trials", 0),
          state("hits", 0),
        ],
        [
          output("theoPct", "Chance P (Theorie)", (v) => (Math.min(v.win, v.totalSeg) / v.totalSeg) * 100, "%", 1, true),
          output("relPct", "Rel. Häufigkeit h", (v) => (v.trials > 0 ? (v.hits / v.trials) * 100 : 0), "%", 1),
        ],
        [
          {
            id: "fair-50",
            text: "Baue ein faires 50-%-Glücksrad mit 8 Feldern (4 Treffer von 8).",
            check: (v, r) => v.totalSeg === 8 && v.win === 4 && near(Number(r.theoPct), 50, 0.01),
          },
          {
            id: "spin-20",
            text: "Führe mindestens 20 Ziehungen mit den Dreh-Buttons aus.",
            check: (v) => v.trials >= 20,
          },
          {
            id: "laplace-quarter",
            text: "Stelle ein Glücksrad mit exakt 25 % Chance bei 4 Gesamtfeldern ein.",
            check: (v, r) => v.totalSeg === 4 && v.win === 1 && near(Number(r.theoPct), 25, 0.01),
          },
        ],
        [
          {
            id: "spin-10",
            label: "10× drehen",
            apply: (v) => {
              const w = Math.min(v.win, v.totalSeg);
              return {
                trials: v.trials + 10,
                hits: v.hits + simulateSpins(v.trials, 10, w, v.totalSeg),
              };
            },
          },
          {
            id: "reset",
            label: "Zurücksetzen",
            apply: () => ({ trials: 0, hits: 0 }),
          },
        ],
      ),
      exercises: [
        {
          id: "identify-laplace",
          make(rng, level) {
            const items = [
              { text: "Fairer 10-seitiger Spielwürfel (Ziffern 0–9)", idx: 0 },
              { text: "Zweifacher Münzwurf auf ebener Fläche? (Einstufig: einmaliger Münzwurf Zahl/Wappen)", idx: 0 },
              { text: "Streichholzschachtel-Wurf (breite Fläche vs. schmale Kante)", idx: 1 },
              { text: "Ziehen einer blauen Kugel aus 4 blauen und 4 roten (Treffer = Farbe)", idx: 0 },
            ];
            const pick = rng.pick(items);
            return task(
              level,
              `Handelt es sich bei „${pick.text}“ um ein Laplace-Experiment?`,
              `Für ein Schulfest-Spiel wird folgendes Zufallsexperiment getestet: „${pick.text}“. Bewerte, ob ein Laplace-Versuch vorliegt.`,
              [
                choiceField(
                  "Bewertung",
                  [
                    "Ja — alle einzelnen Ergebnisse sind gleich wahrscheinlich",
                    "Nein — ungleiche Flächen/Wahrscheinlichkeiten liegen vor",
                  ],
                  pick.idx,
                ),
              ],
              "Bei Laplace-Versuchen hat jedes Elementarergebnis dieselbe Wahrscheinlichkeit.",
              [
                pick.idx === 0 ? "Symmetrie / gleiche Anteile gegeben." : "Flächen bzw. Kanten sind verschieden wahrscheinlich.",
                `<strong>${pick.idx === 0 ? "Laplace-Experiment" : "Kein Laplace-Experiment"}</strong>`,
              ],
              { idx: pick.idx },
            );
          },
        },
        {
          id: "laplace-dice-chance",
          make(rng, level) {
            const cases = [
              { desc: "eine Zahl größer als 4 beim normalen 6er-Würfel", fav: 2, total: 6 },
              { desc: "eine gerade Zahl beim normalen 6er-Würfel", fav: 3, total: 6 },
              { desc: "eine rote Zahl beim 8-Felder-Glücksrad mit 2 roten Feldern", fav: 2, total: 8 },
              { desc: "eine durch 3 teilbare Zahl bei einem 12-seitigen Würfel (1–12)", fav: 4, total: 12 },
            ];
            const c = rng.pick(cases);
            const pct = Number(((c.fav / c.total) * 100).toFixed(1));
            return task(
              level,
              `Berechne die Laplace-Wahrscheinlichkeit in Prozent für: ${c.desc}.`,
              `In einem Brettspiel gewinnt man genau dann, wenn man ${c.desc} würfelt bzw. dreht. Wie viel Prozent beträgt die Gewinnwahrscheinlichkeit?`,
              [numberField("Wahrscheinlichkeit P =", pct, "%", 1, { absTolerance: 0.2 })],
              "P = (günstige Ergebnisse : alle möglichen) · 100 %",
              [
                `${c.fav} von ${c.total} gleich möglichen Ergebnissen`,
                `P = ${frac(c.fav, c.total)} = <strong>${fmt(pct, 1)} %</strong>`,
              ],
              { fav: c.fav, total: c.total, pct },
            );
          },
        },
      ],
    }),

    // 6.2 Relative Häufigkeit & Gesetz der großen Zahlen (R + M)
    makeLesson(6, 2, LB, {
      id: "zf-2-relative-haeufigkeit-gdz",
      title: "Relative Häufigkeit & Gesetz der großen Zahl",
      subtitle: "Brüche & Prozente berechnen und das Stabilisieren bei vielen Versuchen beobachten",
      tracks: BOTH,
      whyItMatters:
        "Bei nur 5 Würfen kann die Zahl 6 rein zufällig dreimal fallen (60 %) — erst bei hunderten oder tausenden Versuchen nähert sich der Anteil dem echten Wert 16,7 % an.",
      explanationHtml: `
        <p>Die <strong>relative Häufigkeit h</strong> teilt die Trefferzahl (absolute Häufigkeit H) durch die Gesamtzahl aller durchgeführten Versuche n:</p>
        <div class="example">
          <strong>Beispiel:</strong> Luca trifft beim Elfmeterschießen 18-mal bei 25 Versuchen.<br>
          Relative Häufigkeit: h = ${frac(18, 25)} = ${frac(72, 100)} = <strong>0,72 = 72 %</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> <strong>Gesetz der großen Zahl:</strong> Je häufiger man ein Zufallsexperiment unter gleichen Bedingungen wiederholt (großes n), desto weniger schwankt die relative Häufigkeit und desto näher pendelt sie sich um die wahre Wahrscheinlichkeit P ein!
        </div>
      `,
      formulas: [
        {
          name: "Relative Häufigkeit h",
          html: `h = ${frac("H (Treffer)", "n (Versuche)")}`,
          quantities: "Angabe als Bruch, Dezimalzahl (0 bis 1) oder Prozent (0 % bis 100 %)",
        },
      ],
      quiz: {
        question: "Bei 1 000 Würfen mit einem fairen Würfel fällt die Augenzahl 6 ungefähr …",
        options: [
          "etwa 160- bis 170-mal (nahe 16,7 %)",
          "garantiert exakt 166-mal ohne Abweichung",
          "genau 500-mal (50 %)",
        ],
        correctIndex: 0,
        explanation:
          "1/6 von 1 000 ist ca. 166,7 — nach dem Gesetz der großen Zahl liegen reale Versuchsreihen nahe daran, treffen ihn aber selten auf den exakten Wurf.",
      },
      lab: lab(
        "chance-wheel",
        "Gesetz der großen Zahl simulieren",
        "Starte zuerst eine kleine Serie (10×) und dann viele Drehungen (50×) — vergleiche die rote Theorie-Linie mit deinem Balken h!",
        [
          range("win", "Trefferfelder", 1, 6, 3, 1),
          range("totalSeg", "Felder gesamt", 6, 8, 8, 2),
          state("trials", 0),
          state("hits", 0),
        ],
        [
          output("theoPct", "Theorie P", (v) => (Math.min(v.win, v.totalSeg) / v.totalSeg) * 100, "%", 1, true),
          output("relPct", "Rel. Häufigkeit h", (v) => (v.trials > 0 ? (v.hits / v.trials) * 100 : 0), "%", 1),
        ],
        [
          {
            id: "reach-100",
            text: "Drehe mit dem 50×-Button mindestens 100 Versuche insgesamt.",
            check: (v) => v.trials >= 100,
          },
          {
            id: "reach-200",
            text: "Steigere auf mindestens 200 Versuche und vergleiche h mit P.",
            check: (v) => v.trials >= 200,
          },
          {
            id: "set-3-of-6",
            text: "Stelle genau 3 Treffer von 6 Feldern ein (Theorie 50 %).",
            check: (v, r) => v.win === 3 && v.totalSeg === 6 && near(Number(r.theoPct), 50, 0.01),
          },
        ],
        [
          {
            id: "spin-50",
            label: "50× drehen",
            apply: (v) => {
              const w = Math.min(v.win, v.totalSeg);
              return {
                trials: v.trials + 50,
                hits: v.hits + simulateSpins(v.trials, 50, w, v.totalSeg),
              };
            },
          },
          {
            id: "reset",
            label: "Zurücksetzen",
            apply: () => ({ trials: 0, hits: 0 }),
          },
        ],
      ),
      exercises: [
        {
          id: "calc-rel-freq",
          make(rng, level) {
            const total = rng.pick([20, 25, 40, 50, 80, 100]);
            const hits = rng.int(4, total - 4);
            const pct = Number(((hits / total) * 100).toFixed(1));
            return task(
              level,
              `Bei ${total} Würfen landet ein Spielstein ${hits}-mal auf einem Bonusfeld. Berechne die relative Häufigkeit in Prozent.`,
              `Tim trifft in einer Trainingsserie ${hits}-mal bei ${total} Freiwürfen, Mia trifft 13-mal bei 20 Versuchen (65 %). Wie viel Prozent schafft Tim?`,
              [
                numberField("Relative Häufigkeit h =", pct, "%", 1, {
                  slips: [
                    {
                      value: hits,
                      hint: `${hits} ist die absolute Trefferzahl — teile durch alle ${total} Versuche und multipliziere mit 100!`,
                    },
                  ],
                }),
              ],
              "h = (H : n) · 100 %",
              [
                `h = ${hits} : ${total} = ${fmt(hits / total, 3)}`,
                `Als Prozent: <strong>${fmt(pct, 1)} %</strong>`,
              ],
              { hits, total, pct },
            );
          },
        },
        {
          id: "law-large-numbers-judge",
          make(rng, level) {
            const scenarios = [
              {
                text: "Bei 10 Münzwürfen fällt 8-mal Zahl (80 %). Bedeutet das, dass die Münze gefälscht ist?",
                idx: 0,
              },
              {
                text: "Bei 2 000 Drehungen eines roten/blauen Glücksrads fällt 1 492-mal Rot (74,6 %). Wie viele Viertel des Rades dürften etwa rot sein?",
                idx: 1,
              },
            ];
            const s = rng.pick(scenarios);
            return task(
              level,
              s.text,
              `Nach einer Auswertung stellst du fest: ${s.text}`,
              [
                choiceField(
                  "Folgerung",
                  [
                    "Nein — bei nur 10 Versuchen sind starke Zufallsschwankungen normal",
                    "Etwa drei Viertel (75 %), da 2 000 Versuche nah am echten Anteil liegen",
                    "Man kann überhaupt keine Schlüsse aus vielen Versuchen ziehen",
                  ],
                  s.idx,
                ),
              ],
              "Kleine Serien schwanken stark; erst große Versuchsreihen (n groß) nähern P zuverlässig an.",
              [
                s.idx === 0
                  ? "n = 10 ist viel zu klein für ein Urteil über Fairness."
                  : "Bei n = 2 000 ist 74,6 % sehr nah am wahren Wert 75 % = 3/4.",
                `<strong>Gesetz der großen Zahl angewendet.</strong>`,
              ],
              { s: s.idx },
            );
          },
        },
      ],
    }),

    // 6.3 Einstufige Gewinnchancen & veränderte Bedingungen (R + M)
    makeLesson(6, 3, LB, {
      id: "zf-3-gewinnchancen-aenderungen",
      title: "Gewinnchancen & veränderte Bedingungen",
      subtitle: "Faire Spiele erkennen und Auswirkungen geänderter Bedingungen beurteilen",
      tracks: BOTH,
      whyItMatters:
        "Tombola-Losteams, Brettspiele oder Gewinnaktionen verändern oft die Regeln (eine Kugel dazulegen oder wegnehmen) — du berechnest sofort, wem das hilft.",
      explanationHtml: `
        <p>Bei einstufigen Zufallsexperimenten erkennst du <strong>Gewinnchancen</strong> direkt an den Anteilen als Bruch oder Prozentwert. Ändert man die Anzahl der Lose oder Felder, ändert sich P sofort!</p>
        <div class="example">
          <strong>Beispiel:</strong> In einem Beutel liegen 3 Gewinne und 7 Nieten (Chance 3/10 = 30 %).<br>
          Werden 2 Nieten herausgenommen (bleiben 3 Gewinne und 5 Nieten = 8 gesamt), steigt deine Gewinnchance auf 3/8 = <strong>37,5 %</strong>!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Ein Spiel ist <strong>fair</strong>, wenn Gewinn- und Verlustchance (oder erwarteter Gewinn und Einsatz) gleich sind. Sowohl Zähler (günstig) als auch Nenner (alle Kugeln) vor jedem Zug genau zählen!
        </div>
      `,
      formulas: [
        {
          name: "Gewinnchance bei Urnen / Losen",
          html: `P(Gewinn) = ${frac("Anzahl Gewinnlose", "Alle Lose im Lostopf")}`,
          quantities: "Vergrößert sich bei mehr Gewinnen oder weniger Nieten",
        },
      ],
      quiz: {
        question: "In einer Box liegen 2 Gewinne und 3 Nieten. Was verbessert die Gewinnchance stärker: 1 Gewinn dazulegen oder 1 Niete herausnehmen?",
        options: [
          "1 Gewinn dazulegen (3/6 = 50 % statt 2/4 = 50 % — beide gleich 50 %!)",
          "1 Gewinn dazulegen ergibt 60 %, Niete weg nur 40 %",
          "Beide Aktionen senken die Gewinnchance",
        ],
        correctIndex: 0,
        explanation:
          "Mit 1 Gewinn mehr gibt es 3/6 = 50 %; mit 1 Niete weniger gibt es 2/4 = 50 % — hier sind beide Veränderungen zufällig exakt gleich stark!",
      },
      lab: lab(
        "chance-wheel",
        "Gewinnchancen gezielt verändern",
        "Verändere Trefferfelder oder Gesamtfelder und prüfe sofort die Auswirkung auf die theoretische Gewinnchance P.",
        [
          range("win", "Trefferfelder", 1, 5, 2, 1),
          range("totalSeg", "Felder gesamt", 4, 8, 8, 2),
          state("trials", 0),
          state("hits", 0),
        ],
        [
          output("theoPct", "Gewinnchance P", (v) => (Math.min(v.win, v.totalSeg) / v.totalSeg) * 100, "%", 1, true),
          output("relPct", "Test-Häufigkeit", (v) => (v.trials > 0 ? (v.hits / v.trials) * 100 : 0), "%", 1),
        ],
        [
          {
            id: "double-chance-drop-total",
            text: "Halbiere nur die Gesamtfelder auf 4 (bei 2 Trefferfeldern) — Chance steigt auf 50 %!",
            check: (v, r) => v.win === 2 && v.totalSeg === 4 && near(Number(r.theoPct), 50, 0.01),
          },
          {
            id: "chance-5-of-8",
            text: "Steigere die Gewinnchance bei 8 Gesamtfeldern über 60 % (5 Treffer).",
            check: (v, r) => v.win === 5 && v.totalSeg === 8 && near(Number(r.theoPct), 62.5, 0.1),
          },
          {
            id: "chance-1-of-6",
            text: "Stelle genau 1 Trefferfeld bei 6 Gesamtfeldern ein (16,7 %).",
            check: (v, r) => v.win === 1 && v.totalSeg === 6 && near(Number(r.theoPct), 100 / 6, 0.2),
          },
        ],
        [
          {
            id: "spin-25",
            label: "25× testen",
            apply: (v) => {
              const w = Math.min(v.win, v.totalSeg);
              return {
                trials: v.trials + 25,
                hits: v.hits + simulateSpins(v.trials, 25, w, v.totalSeg),
              };
            },
          },
        ],
      ),
      exercises: [
        {
          id: "urn-change-chance",
          make(rng, level) {
            const win = rng.int(2, 6);
            const lose = rng.int(4, 10);
            const addWin = rng.int(1, 3);
            const newTotal = win + addWin + lose;
            const newPct = Number((((win + addWin) / newTotal) * 100).toFixed(1));
            return task(
              level,
              `In einem Beutel liegen ${win} Gewinne und ${lose} Nieten. Es kommen ${addWin} Gewinne hinzu. Berechne die neue Gewinnchance in Prozent.`,
              `Auf dem Schulfest liegen zunächst ${win} rote Gewinne und ${lose} weiße Nieten im Lostopf. Die Klasse füllt ${addWin} weitere rote Gewinne nach. Wie hoch ist jetzt die Gewinnchance beim ersten Griff?`,
              [numberField("Neue Gewinnchance =", newPct, "%", 1, { absTolerance: 0.2 })],
              "Sowohl neue Gewinnzahl als auch neue Gesamtzahl im Nenner berücksichtigen!",
              [
                `Neue Anzahlen: ${win + addWin} Gewinne bei ${newTotal} Losen gesamt`,
                `P = (${win + addWin} : ${newTotal}) · 100 % = <strong>${fmt(newPct, 1)} %</strong>`,
              ],
              { win, lose, addWin, newPct },
            );
          },
        },
        {
          id: "compare-two-wheels",
          make(rng, level) {
            const configs = [
              { aW: 3, aT: 8, bW: 2, bT: 5, best: 1 }, // 37,5 % vs 40 %
              { aW: 5, aT: 12, bW: 3, bT: 8, best: 0 }, // 41,7 % vs 37,5 %
              { aW: 4, aT: 10, bW: 7, bT: 20, best: 0 }, // 40 % vs 35 %
            ];
            const c = rng.pick(configs);
            return task(
              level,
              `Glücksrad A hat ${c.aW} von ${c.aT} Treffern, Glücksrad B hat ${c.bW} von ${c.bT} Treffern. Welches Rad bietet die größere Chance?`,
              `Du darfst für dein Endspiel ein Glücksrad aussuchen: Rad A (${c.aW} Gewinnfelder bei ${c.aT} gleichen Feldern) oder Rad B (${c.bW} Gewinnfelder bei ${c.bT} Feldern). Welches wählst du?`,
              [
                choiceField(
                  "Besseres Rad",
                  [
                    `Rad A (${fmt((c.aW / c.aT) * 100, 1)} %)`,
                    `Rad B (${fmt((c.bW / c.bT) * 100, 1)} %)`,
                  ],
                  c.best,
                ),
              ],
              "Beide Brüche in Dezimalzahlen oder Prozent umwandeln und vergleichen.",
              [
                `Rad A: ${c.aW}/${c.aT} ≈ ${fmt((c.aW / c.aT) * 100, 1)} %; Rad B: ${c.bW}/${c.bT} ≈ ${fmt((c.bW / c.bT) * 100, 1)} %`,
                `<strong>${c.best === 0 ? "Rad A" : "Rad B"}</strong> hat die höhere Gewinnchance.`,
              ],
              c,
            );
          },
        },
      ],
    }),
  ],
);
