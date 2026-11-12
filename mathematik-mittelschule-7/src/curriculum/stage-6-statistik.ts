import { fmt, frac } from "../exercises/format";
import { choiceField, near, numberField } from "./helpers";
import {
  BOTH,
  lab,
  makeLesson,
  makeStage,
  output,
  range,
  task,
} from "./builders";

const LB = [6, 6] as [number, number];

export const STAGE_STATISTIK = makeStage(
  6,
  "Diagramme und statistische Kennwerte",
  "Darstellungen vergleichen, Manipulationen und Stichproben beurteilen, Mittelwert, Zentralwert & Spannweite nutzen",
  "#db2777",
  "📊",
  LB,
  [
    makeLesson(6, 1, LB, {
      id: "st-1-darstellungen-manipulation",
      title: "Daten darstellen & Manipulation erkennen",
      subtitle: "Text, Tabelle und Diagramm adressatengerecht wählen und optische Tricks entlarven",
      tracks: BOTH,
      whyItMatters:
        "Ob Schulstatistik oder Werbung: Wer Achsen abschneidet oder Balken verbreitert, lässt winzige Unterschiede riesig aussehen.",
      explanationHtml: `
        <p>Daten kann man als <strong>Text, Tabelle oder Diagramm</strong> darstellen. Ein Diagramm zeigt Trends schnell — aber genau dort verstecken sich oft Manipulationen:</p>
        <ul>
          <li><strong>Abgeschnittene y-Achse:</strong> Startet die Achse erst bei 50 statt bei 0, wirkt 75 gegenüber 60 plötzlich dreimal so hoch!</li>
          <li><strong>Unterschiedliche Balkenbreite:</strong> Macht aus einem doppelten Wert leicht eine vierfache Fläche.</li>
        </ul>
        <div class="example">
          <strong>Beispiel:</strong> Firma A hat 60 % Zustimmung, Firma B 70 %. Beginnt die Achse erst bei 55 %, ragen die Balken 5 Einheiten und 15 Einheiten hoch — optisch sieht B wie <strong>3-mal</strong> so groß aus, obwohl es nur 10 Prozentpunkte mehr sind!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Blicke bei jedem Diagramm zuerst auf den <strong>Achsenstart (0?)</strong>, die <strong>Schrittweite</strong> und die <strong>Balkenbreite</strong>!
        </div>
      `,
      formulas: [
        {
          name: "Echtes vs. optisches Verhältnis",
          html: `Echt = ${frac("Wert₂", "Wert₁")} &nbsp;·&nbsp; Optisch = ${frac("Wert₂ − y₀", "Wert₁ − y₀")}`,
          quantities: "y₀ Startwert der Hochachse",
        },
      ],
      quiz: {
        question: "Woran erkennst du sofort ein manipulatives Säulendiagramm?",
        options: [
          "Die y-Achse beginnt nicht bei 0 oder ändert mittendrin ihre Schrittweite.",
          "Die Säulen sind farbig statt grau gezeichnet.",
          "Die Werte stammen aus einer Tabelle.",
        ],
        correctIndex: 0,
        explanation:
          "Wenn die Hochachse abgeschnitten ist (y₀ > 0), werden die Höhenunterschiede zwischen den Säulen stark übertrieben dargestellt.",
      },
      lab: lab(
        "chart-critique",
        "Manipulations-Detektor",
        "Verschiebe den Achsenstart y₀ oder die Balkenbreite und beobachte das optische Verhältnis.",
        [
          range("v1", "Wert A", 50, 80, 60, 5),
          range("v2", "Wert B", 60, 95, 75, 5),
          range("y0", "Achsenstart y₀", 0, 50, 20, 10),
          range("wide", "Balkenbreite B", 1, 2, 1, 1),
        ],
        [
          output("realRatio", "Echtes Verhältnis B:A", (v) => v.v2 / v.v1, ": 1", 2),
          output("visRatio", "Optisches Höhenverhältnis", (v) => (v.v2 - Math.min(v.y0, v.v1 - 5)) / (v.v1 - Math.min(v.y0, v.v1 - 5)), ": 1", 2, true),
        ],
        [
          {
            id: "honest-axis",
            text: "Stelle die ehrliche Achse (y₀ = 0, gleiche Balkenbreite = 1) wieder her.",
            check: (v) => v.y0 === 0 && v.wide === 1,
          },
          {
            id: "exaggerate-3x",
            text: "Übertreibe bei A = 60 und B = 80 die Darstellung auf das genau 3,00-fache (y₀ = 50).",
            check: (v, r) => v.v1 === 60 && v.v2 === 80 && v.y0 === 50 && near(Number(r.visRatio), 3, 0.02),
          },
          {
            id: "wide-trick",
            text: "Aktiviere zusätzlich den Balkenbreiten-Trick (Breite = 2).",
            check: (v) => v.wide === 2,
          },
        ],
      ),
      exercises: [
        {
          id: "visual-distortion-ratio",
          make(rng, level) {
            const v1 = rng.pick([60, 70, 80]);
            const diff = rng.pick([10, 20]);
            const v2 = v1 + diff;
            const y0 = v1 - 10;
            const visualFactor = (v2 - y0) / (v1 - y0);
            return task(
              level,
              `Im Diagramm steht A = ${v1} und B = ${v2}, die y-Achse startet aber erst bei y₀ = ${y0}. Wie vielmal höher wirkt Säule B optisch als A?`,
              `Eine Werbung zeigt Zufriedenheitswerte von ${v1} % (Konkurrenz) und ${v2} % (eigenes Produkt), schneidet aber die y-Achse unterhalb von ${y0} % ab. Um welchen Faktor wirkt der eigene Balken höher als der der Konkurrenz?`,
              [numberField("Optischer Faktor =", visualFactor, "-fach", 1)],
              "Berechne die sichtbaren Balkenhöhen ab y₀: (B − y₀) : (A − y₀).",
              [
                `Sichtbare Höhe A: ${v1} − ${y0} = ${v1 - y0}; Höhe B: ${v2} − ${y0} = ${v2 - y0}`,
                `Verhältnis: ${v2 - y0} : ${v1 - y0} = <strong>${fmt(visualFactor, 1)}-fach</strong>`,
              ],
              { v1, v2, y0, visualFactor },
            );
          },
        },
        {
          id: "pick-best-representation",
          make(rng, level) {
            const cases = [
              ["eine exakte Preisliste aller 12 Getränke nachschlagen", 0],
              ["Anteile am Monatsbudget auf einen Blick als Teile vom Ganzen sehen", 1],
              ["einen Temperaturverlauf über 24 Stunden beobachten", 2],
            ] as const;
            const chosen = rng.pick(cases);
            return task(
              level,
              `Welche Darstellungsform passt am besten, um ${chosen[0]}?`,
              `Für einen Klassenbericht möchtest du ${chosen[0]}. Wähle die sinnvollste Darstellung.`,
              [
                choiceField(
                  "Beste Darstellung",
                  ["Tabelle", "Kreis-/Streifendiagramm", "Liniendiagramm"],
                  chosen[1],
                ),
              ],
              "Genaue Einzelwerte → Tabelle; Anteile am Ganzen → Kreis/Streifen; zeitliche Veränderung → Liniendiagramm.",
              [
                `Zweck: ${chosen[0]}`,
                `<strong>${["Tabelle", "Kreis-/Streifendiagramm", "Liniendiagramm"][chosen[1]]}</strong>`,
              ],
              { idx: chosen[1] },
            );
          },
        },
      ],
    }),

    makeLesson(6, 2, LB, {
      id: "st-2-stichproben-skalierung",
      title: "Qualität von Datenerhebungen beurteilen",
      subtitle: "Stichprobenumfang, Verzerrungen, falsche Aussagen und Skalierungen hinterfragen",
      tracks: BOTH,
      whyItMatters:
        "„9 von 10 Befragten stimmen zu!“ — Klingt stark, bis man erfährt, dass nur 10 Freunde vor dem Sportplatz gefragt wurden.",
      explanationHtml: `
        <p>Eine Umfrage ist nur aussagekräftig, wenn die <strong>Stichprobe</strong> passt:</p>
        <ul>
          <li><strong>Größe der Stichprobe:</strong> Zu wenige Befragte (z. B. 5 Personen) lassen keine Aussage über alle zu.</li>
          <li><strong>Auswahl (Repräsentativität):</strong> Wer vor der Eisdiele fragt, ob alle gerne Eis essen, bekommt ein verzerrtes Ergebnis.</li>
          <li><strong>Skalierung &amp; Bezugsgröße:</strong> „Doppelt so viele Unfälle“ ohne Nennung der gestiegenen Fahrzeugzahl führt oft zu Fehlschlüssen.</li>
        </ul>
        <div class="example">
          <strong>Beispiel:</strong> Ein Zeitungsartikel meldet: „80 % aller Jugendlichen treiben täglich Sport!“ Im Kleingedruckten: Befragt wurden 25 Mitglieder eines Sportvereins. Diese Stichprobe ist viel zu klein und nicht repräsentativ!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Prüfe immer <strong>Wer</strong> wurde gefragt, <strong>wie viele</strong> Personen nahmen teil und <strong>wie</strong> wurde skaliert?
        </div>
      `,
      formulas: [
        {
          name: "Checkliste Datenerhebung",
          html: `Stichprobe (Umfang n?) &nbsp;·&nbsp; Auswahl (zufällig?) &nbsp;·&nbsp; Achse (Start bei 0?)`,
          quantities: "Kriterien für verlässliche Daten",
        },
      ],
      quiz: {
        question:
          "Eine Schule mit 480 Kindern fragt die 12 Mitglieder der Informatik-AG, ob mehr Computer angeschafft werden sollen. Warum ist das Ergebnis kritisch?",
        options: [
          "Die Stichprobe ist winzig (12 von 480) und einseitig ausgewählt (AG-Mitglieder).",
          "Weil nur gerade Zahlen als Stichprobe erlaubt sind.",
          "Weil man immer genau 100 Kinder befragen muss.",
        ],
        correctIndex: 0,
        explanation:
          "12 Kinder bilden keine große Stichprobe, und gerade Mitglieder der Computer-AG antworten natürlich einseitig.",
      },
      lab: lab(
        "chart-critique",
        "Skalierung & Stichprobe prüfen",
        "Untersuche, wie eng gestellte Skalen kleine Stichproben-Unterschiede aufblähen.",
        [
          range("v1", "Umfrage A (%)", 50, 80, 55, 5),
          range("v2", "Umfrage B (%)", 60, 90, 65, 5),
          range("y0", "Skalen-Start y₀", 0, 50, 40, 10),
          range("wide", "Balkenbreite", 1, 2, 1, 1),
        ],
        [
          output("diff", "Echte Differenz", (v) => v.v2 - v.v1, "Pkt.", 0),
          output("visRatio", "Optisches Verhältnis", (v) => (v.v2 - Math.min(v.y0, v.v1 - 5)) / (v.v1 - Math.min(v.y0, v.v1 - 5)), ": 1", 2, true),
        ],
        [
          {
            id: "fair-scale",
            text: "Mache die Skalierung mit y₀ = 0 wieder sachlich fair.",
            check: (v) => v.y0 === 0 && v.wide === 1,
          },
          {
            id: "skew-50",
            text: "Ziehe y₀ auf 50 bei v₁ = 55 und v₂ = 70 (kleiner Unterschied wirkt 4-mal so groß!).",
            check: (v, r) => v.y0 === 50 && v.v1 === 55 && v.v2 === 70 && near(Number(r.visRatio), 4, 0.02),
          },
          {
            id: "same-values",
            text: "Stelle beide Balken auf denselben Prozentwert 60 % (Differenz 0 Pkt.).",
            check: (v, r) => v.v1 === 60 && v.v2 === 60 && Number(r.diff) === 0,
          },
        ],
      ),
      exercises: [
        {
          id: "sample-share-check",
          make(rng, level) {
            const total = rng.pick([200, 400, 500, 800]);
            const sample = rng.pick([8, 10, 20]);
            const pctSample = Number(((sample / total) * 100).toFixed(1));
            return task(
              level,
              `Von ${total} Personen wurden nur ${sample} befragt. Wie viel Prozent der Gesamtzahl sind das?`,
              `Eine Umfrage über das Mensaessen an einer Schule mit ${total} Schülerinnen und Schülern basiert auf nur ${sample} Rückmeldungen. Wie viel Prozent der Schulgemeinschaft haben überhaupt abgestimmt?`,
              [numberField("Anteil =", pctSample, "%", 1)],
              "Anteil = Stichprobe : Gesamtzahl · 100 %.",
              [
                `${sample} : ${total} · 100 %`,
                `<strong>${fmt(pctSample, 1)} %</strong>`,
              ],
              { total, sample, pctSample },
            );
          },
        },
        {
          id: "evaluate-claim",
          make(rng, level) {
            const cases = [
              ["Es wurden 300 zufällig ausgewählte Schülerinnen und Schüler aller Klassen befragt; die Achse startet bei 0.", 0],
              ["Es wurden nur 6 Kinder derselben Fußballmannschaft zu Sportstunden befragt.", 1],
              ["Im Diagramm fehlt jede Zahlenangabe an der Hochachse.", 1],
            ] as const;
            const chosen = rng.pick(cases);
            return task(
              level,
              `Bewerte folgende Datenerhebung als aussagekräftig oder problematisch: „${chosen[0]}“`,
              `Ein Schülerprojekt legt dieses Ergebnis vor: „${chosen[0]}“ Ist die Erhebung verlässlich und sauber dargestellt?`,
              [choiceField("Bewertung", ["aussagekräftig & fair", "problematisch / verzerrt"], chosen[1])],
              "Gute Daten brauchen eine ausreichend große, nicht einseitige Stichprobe und beschriftete Skalen ab 0.",
              [
                `Prüfe Stichprobengröße, Auswahl und Skalierung`,
                `<strong>${chosen[1] === 0 ? "aussagekräftig & fair" : "problematisch / verzerrt"}</strong>`,
              ],
              { idx: chosen[1] },
            );
          },
        },
      ],
    }),

    makeLesson(6, 3, LB, {
      id: "st-3-kennwerte",
      title: "Mittelwert, Zentralwert & Spannweite",
      subtitle: "Statistische Kennwerte berechnen, bei Ausreißern vergleichen und deuten",
      tracks: BOTH,
      whyItMatters:
        "Zwei Klassen können denselben Notendurchschnitt haben — und doch liegt die eine eng beisammen, während die andere extrem streut.",
      explanationHtml: `
        <p>Drei Kennwerte beschreiben eine Datenreihe viel genauer als eine einzige Zahl:</p>
        <ul>
          <li><strong>Arithmetisches Mittel (Durchschnitt):</strong> Summe aller Werte geteilt durch ihre Anzahl.</li>
          <li><strong>Zentralwert (Median):</strong> Der Wert genau in der Mitte der <em>geordneten</em> Liste — unempfindlich gegen einzelne Ausreißer!</li>
          <li><strong>Spannweite:</strong> Größter Wert minus kleinster Wert (zeigt, wie stark die Werte schwanken).</li>
        </ul>
        <div class="example">
          <strong>Beispiel (Notenliste: 1, 2, 2, 3, 6):</strong><br>
          • Mittelwert = (1 + 2 + 2 + 3 + 6) : 5 = 14 : 5 = <strong>2,8</strong><br>
          • Zentralwert = mittlerer (3.) Wert = <strong>2</strong><br>
          • Spannweite = 6 − 1 = <strong>5</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Vor dem Bestimmen von Zentralwert und Spannweite die Werte <strong>immer zuerst der Größe nach ordnen</strong>!
        </div>
      `,
      formulas: [
        {
          name: "Arithmetisches Mittel & Spannweite",
          html: `Mittel = ${frac("Summe aller Werte", "Anzahl")} &nbsp;·&nbsp; Spannweite = x<sub>max</sub> − x<sub>min</sub>`,
          quantities: "Zentralwert = mittlerer Wert der geordneten Reihe",
        },
      ],
      quiz: {
        question: "Gegebene Messwerte: 4, 10, 5, 5, 31. Welcher Kennwert bleibt vom Ausreißer 31 fast unberührt?",
        options: [
          "Der Zentralwert (Median = 5)",
          "Das arithmetische Mittel (= 11)",
          "Die Spannweite (= 27)",
        ],
        correctIndex: 0,
        explanation:
          "Geordnet: 4, 5, 5, 10, 31. Der Zentralwert in der Mitte ist 5 — egal ob ganz rechts 11 oder 31 steht!",
      },
      lab: lab(
        "stats-measures",
        "Kennwerte & Ausreißer-Labor",
        "Ziehe den fünften Datenpunkt (e) nach rechts und beobachte Mittelwert, Zentralwert und Spannweite.",
        [
          range("a", "Wert 1", 1, 5, 2, 1),
          range("b", "Wert 2", 2, 6, 3, 1),
          range("c", "Wert 3", 2, 7, 3, 1),
          range("d", "Wert 4", 3, 8, 4, 1),
          range("e", "Ausreißer e", 4, 15, 4, 1),
        ],
        [
          output("mean", "Mittelwert", (v) => (v.a + v.b + v.c + v.d + v.e) / 5, "", 2, true),
          output("median", "Zentralwert", (v) => [v.a, v.b, v.c, v.d, v.e].sort((x, y) => x - y)[2], "", 0),
          output("span", "Spannweite", (v) => Math.max(v.a, v.b, v.c, v.d, v.e) - Math.min(v.a, v.b, v.c, v.d, v.e), "", 0),
        ],
        [
          {
            id: "outlier-jump",
            text: "Ziehe e auf 15 und beobachte, dass der Zentralwert klein bleibt, während das Mittel stark steigt!",
            check: (v, r) => v.e === 15 && Number(r.mean) > Number(r.median) + 1.5,
          },
          {
            id: "zero-span",
            text: "Erzeuge eine Datenreihe ohne jede Schwankung (Spannweite = 0).",
            check: (_v, r) => Number(r.span) === 0,
          },
          {
            id: "median-4",
            text: "Stelle Werte mit Zentralwert = 4 und Spannweite = 10 ein.",
            check: (_v, r) => Number(r.median) === 4 && Number(r.span) === 10,
          },
        ],
      ),
      exercises: [
        {
          id: "mean-median-span",
          make(rng, level) {
            const nums = [
              rng.int(2, 5),
              rng.int(4, 7),
              rng.int(6, 9),
              rng.int(8, 12),
              rng.int(10, 18),
            ].sort((x, y) => x - y);
            const shown = rng.shuffle(nums);
            const sum = nums.reduce((a, b) => a + b, 0);
            const mean = Number((sum / 5).toFixed(2));
            const median = nums[2];
            const span = nums[4] - nums[0];
            return task(
              level,
              `Datenreihe: ${shown.join(", ")}. Berechne arithmetisches Mittel, Zentralwert und Spannweite.`,
              `Fünf Tage lang wurden die Höchsttemperaturen notiert: ${shown.join(" °C, ")} °C. Berechne Mittelwert, Zentralwert und Spannweite (Temperaturschwankung).`,
              [
                numberField("Mittelwert =", mean, "", 2),
                numberField("Zentralwert =", median, "", 0),
                numberField("Spannweite =", span, "", 0),
              ],
              "Erst sortieren! Mittel = Summe : 5, Zentralwert = 3. Wert, Spannweite = Max − Min.",
              [
                `Geordnet: ${nums.join(" ; ")}`,
                `Mittel = ${sum} : 5 = ${fmt(mean, 2)}, Zentralwert = ${median}, Spannweite = ${nums[4]} − ${nums[0]} = <strong>${span}</strong>`,
              ],
              { mean, median, span },
            );
          },
        },
        {
          id: "compare-consistency",
          make(rng, level) {
            const minA = rng.int(14, 16);
            const maxA = minA + rng.int(2, 3);
            const minB = rng.int(6, 10);
            const maxB = minB + rng.int(12, 18);
            const spanA = maxA - minA;
            const spanB = maxB - minB;
            return task(
              level,
              `Stadt A: min ${minA} °C, max ${maxA} °C. Stadt B: min ${minB} °C, max ${maxB} °C. Berechne die Spannweiten.`,
              `Zwei Orte haben denselben Durchschnitt. Ort A liegt zwischen ${minA} °C und ${maxA} °C, Ort B zwischen ${minB} °C und ${maxB} °C. Welcher Ort hat die geringeren Schwankungen?`,
              [
                numberField("Spannweite A =", spanA, "°C", 0),
                numberField("Spannweite B =", spanB, "°C", 0),
                choiceField("Gleichmäßigere Temperatur", ["Ort A", "Ort B"], 0),
              ],
              "Spannweite = Höchstwert − Tiefstwert. Kleinere Spannweite bedeutet gleichmäßigere Werte.",
              [
                `Spannweite A = ${maxA} − ${minA} = ${spanA} °C`,
                `Spannweite B = ${maxB} − ${minB} = ${spanB} °C → <strong>Ort A ist gleichmäßiger</strong>`,
              ],
              { spanA, spanB },
            );
          },
        },
      ],
    }),
  ],
);
