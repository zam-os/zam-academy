import { fmt } from "../exercises/format";
import { statistics } from "../models";
import { numberField as num, choiceField as pick } from "./helpers";
import {
  lab,
  range as r,
  choice as c,
  output as o,
  makeLesson as lesson,
  makeStage,
  task,
} from "./builders";
const L = (step: number, content: Parameters<typeof lesson>[3]) =>
  lesson(8, step, [8, 6], content);
const values = (v: Record<string, number>) => [v.a, v.b, v.c, v.d, v.e];
export const sampleExpectation = (a: number, b: number) =>
  a + b === 0 ? null : ((0.2 * a + 0.8 * b) / (a + b)) * 100;

const kennzahlen = L(1, {
  id: "da-1-kenngroessen",
  title: "8.1 Vier statistische Kenngrößen",
  subtitle: "Mittelwert, Median, Modalwert und Spannweite",
  whyItMatters:
    "Eine einzige Zahl kann unterschiedliche Aspekte einer Datenreihe beschreiben. Erst die Bedeutung der Kenngröße macht sie nützlich.",
  explanationHtml: `<p>Das <strong>arithmetische Mittel</strong> ist Summe aller Werte geteilt durch deren Anzahl. Für den <strong>Zentralwert (Median)</strong> ordnest du zuerst der Größe nach. Bei ungerader Anzahl ist es der mittlere Wert; bei gerader Anzahl der Mittelwert der beiden mittleren Werte.</p><p>Der <strong>Modalwert</strong> ist ein am häufigsten vorkommender Wert. Es können mehrere gleich häufigste Werte vorkommen; dann gibt es keinen eindeutigen Modalwert. Die <strong>Spannweite</strong> ist größter minus kleinster Wert; sie zeigt nur die beiden Randwerte.</p><div class="example">Daten 2; 4; 4; 6; 9. Mittelwert: 25 : 5 = 5. Median: 4 (dritter Wert). Modalwert: 4 (zweimal). Spannweite: 9 − 2 = 7. Bei 2; 4; 6; 9 ist der Median (4 + 6) : 2 = 5.</div><div class="merke"><strong>Merke:</strong> Mittelwert: alle Werte. Median: Mitte der sortierten Liste. Modalwert: häufigster Wert. Spannweite: Maximum minus Minimum.</div>`,
  formulas: [
    {
      name: "Arithmetisches Mittel",
      html: "x̄ = (x₁ + … + xₙ) : n",
      quantities: "n Anzahl aller Werte",
    },
    {
      name: "Spannweite",
      html: "R = x<sub>max</sub> − x<sub>min</sub>",
      quantities: "keine Aussage über die Verteilung dazwischen",
    },
  ],
  quiz: {
    question: "Was musst du vor dem Bestimmen des Medians tun?",
    options: [
      "Die Werte der Größe nach ordnen.",
      "Alle Werte addieren.",
      "Den häufigsten Wert streichen.",
    ],
    correctIndex: 0,
    explanation:
      "Nur in der geordneten Liste liegt der Median an der mittleren Position.",
  },
  lab: lab(
    "data",
    "Datenpunkte verschieben",
    "Ziehe die fünf Datenpunkte. Die Anzeige ordnet die Werte und berechnet jede Kenngröße neu.",
    [
      r("a", "Wert A", 0, 12, 2),
      r("b", "Wert B", 0, 12, 4),
      r("c", "Wert C", 0, 12, 4),
      r("d", "Wert D", 0, 12, 6),
      r("e", "Wert E", 0, 12, 9),
    ],
    [
      o("ordered", "Geordnet", (v) => statistics(values(v)).ordered.join("; ")),
      o("mean", "Mittelwert", (v) => statistics(values(v)).mean),
      o("median", "Median", (v) => statistics(values(v)).median),
      o("modes", "Modalwert(e)", (v) => {
        const s = statistics(values(v));
        return s.modes.length === 5
          ? "alle gleich häufig; nicht eindeutig"
          : s.modes.join("; ");
      }),
      o("range", "Spannweite", (v) => statistics(values(v)).range),
    ],
    [
      {
        id: "gleich",
        text: "Setze alle fünf Werte auf 2. Alle Kenngrößen außer der Spannweite sind dann 2.",
        check: (v) => values(v).every((x) => x === 2),
      },
      {
        id: "symmetrisch",
        text: "Stelle die Reihe 1; 3; 5; 7; 9 ein: Mittelwert und Median sind 5.",
        check: (v) =>
          v.a === 1 && v.b === 3 && v.c === 5 && v.d === 7 && v.e === 9,
      },
      {
        id: "haeufig",
        text: "Stelle 2; 6; 6; 6; 10 ein: eindeutiger Modalwert 6.",
        check: (v) =>
          v.a === 2 && v.b === 6 && v.c === 6 && v.d === 6 && v.e === 10,
      },
    ],
  ),
  exercises: [
    {
      id: "fuenf-werte",
      make: (rng, level) => {
        const base = rng.int(1, 8),
          data =
            level === 1
              ? [base, base + 1, base + 1, base + 3, base + 5]
              : [base, base + 1, base + 1, base + 3, base + 5, base + 8],
          s = statistics(data);
        return task(
          level,
          `Bestimme Mittelwert und Median der Daten ${rng.shuffle([...data]).join("; ")}.`,
          `Die Datenreihe ${rng.shuffle([...data]).join("; ")} hat eine gerade Anzahl. Bestimme Mittelwert, Median und Spannweite.`,
          [
            num("Mittelwert =", s.mean, "", 2),
            num("Median =", s.median, "", 2, {
              slips: [
                {
                  value: s.mean,
                  hint: "Das ist der arithmetische Mittelwert. Für den Median sortierst du zuerst und suchst die mittlere Position bzw. die beiden mittleren Werte.",
                },
              ],
            }),
            ...(level === 2 ? [num("Spannweite =", s.range, "", 0)] : []),
          ],
          "Für den Mittelwert addieren und durch die Anzahl teilen; für den Median zuerst sortieren.",
          `Geordnet: ${data.join("; ")}. Summe ${data.reduce((a, b) => a + b, 0)}, Anzahl ${data.length}. ${level === 2 ? "Bei sechs Werten die beiden mittleren Werte mitteln." : "Der dritte Wert ist der Median."}`,
          `Mittel ${fmt(s.mean, 2)}, Median ${fmt(s.median)}, Spannweite ${s.range}.`,
          { base },
        );
      },
    },
    {
      id: "modalwert-spannweite",
      make: (rng, level) => {
        const b = rng.int(1, 7),
          data = [b, b + 2, b + 2, b + 5, b + 7];
        return task(
          level,
          `Bestimme Modalwert und Spannweite der Daten ${data.join("; ")}.`,
          `Die Daten ${data.join("; ")} werden um den Wert ${b + 7} ergänzt. Bestimme die Modalwerte und die Spannweite der neuen Reihe.`,
          [
            ...(level === 1
              ? [num("Modalwert =", b + 2, "", 0)]
              : [
                  pick(
                    "Modalwerte",
                    [`${b + 2} und ${b + 7}`, `nur ${b + 2}`, `nur ${b + 7}`],
                    0,
                  ),
                ]),
            num("Spannweite =", 7, "", 0),
          ],
          "Häufigkeiten zählen; Spannweite = größter minus kleinster Wert.",
          `Ursprünglich kommt ${b + 2} zweimal vor. ${level === 2 ? `Nach Ergänzung kommt auch ${b + 7} zweimal vor.` : ""} Die Randwerte bleiben ${b} und ${b + 7}.`,
          `${level === 1 ? b + 2 : `${b + 2} und ${b + 7}`} am häufigsten; Spannweite 7.`,
          { b },
        );
      },
    },
  ],
});

const ausreisser = L(2, {
  id: "da-2-aussagekraft",
  title: "8.2 Was sagen die Kenngrößen aus?",
  subtitle: "Ausreißer und typische Werte vergleichen",
  whyItMatters:
    "Ein Durchschnitt kann einen typischen Wert schlecht beschreiben, wenn einzelne Werte sehr groß oder klein sind. Mehrere Kenngrößen zusammen helfen beim Beurteilen.",
  explanationHtml: `<p>Das arithmetische Mittel berücksichtigt jeden Wert und reagiert stark auf Ausreißer. Der Median hängt von den mittleren Positionen ab und bleibt bei einem einzelnen sehr großen Wert oft unverändert. Die Spannweite reagiert nur auf das Minimum und Maximum. Der Modalwert beschreibt den häufigsten Wert und ist auch für Kategorien wie Lieblingsfarben sinnvoll, für die ein Mittelwert keinen Sinn ergibt.</p><div class="example">Wartezeiten 3; 4; 4; 5; 24 Minuten: Mittelwert 8 Minuten, Median 4 Minuten. Vier von fünf Personen warteten höchstens 5 Minuten. Der Median beschreibt die typische Wartezeit hier besser; der hohe Mittelwert weist auf die lange Einzelwartezeit hin.</div><p>Gleicher Mittelwert bedeutet nicht gleiche Verteilung: 4; 4; 4 und 0; 4; 8 haben beide Mittelwert 4, aber Spannweiten 0 und 8. Gib deshalb die Daten oder eine ergänzende Kenngröße an.</p><div class="merke"><strong>Merke:</strong> Wähle die Kenngröße passend zur Frage. Ein Median verschweigt die Extremwerte; ein Mittelwert kann von ihnen stark beeinflusst werden.</div>`,
  formulas: [
    {
      name: "Aussagekraft",
      html: "Mittelwert: ausreißerempfindlich; Median: robust gegenüber einzelnen Extremwerten",
      quantities: "nicht mit „alle Werte liegen dort“ verwechseln",
    },
  ],
  quiz: {
    question:
      "Welche Größe bleibt bei 3; 4; 4; 5; 24 gleich, wenn nur 24 zu 100 wird?",
    options: ["Der Median 4.", "Das arithmetische Mittel.", "Die Spannweite."],
    correctIndex: 0,
    explanation:
      "Die mittlere Position bleibt bei 4. Summe und Maximum wachsen dagegen.",
  },
  lab: lab(
    "outlier",
    "Ein Ausreißer verändert die Aussage",
    "Die ersten vier Werte sind 3, 4, 4 und 5. Ziehe den fünften Wert und vergleiche Mittelwert und Median.",
    [r("last", "Fünfter Wert", 5, 100, 10)],
    [
      o("mean", "Mittelwert", (v) => (16 + v.last) / 5),
      o("median", "Median", () => 4),
      o("range", "Spannweite", (v) => v.last - 3),
    ],
    [
      {
        id: "beispiel",
        text: "Stelle den fünften Wert 24 ein: Mittelwert 8, Median 4.",
        check: (v) => v.last === 24,
      },
      {
        id: "extrem",
        text: "Erhöhe den Ausreißer auf 100 und beobachte den unveränderten Median.",
        check: (v) => v.last === 100,
      },
      {
        id: "klein",
        text: "Verringere den fünften Wert auf 5: kleine Spannweite.",
        check: (v) => v.last === 5,
      },
    ],
  ),
  exercises: [
    {
      id: "veraenderung",
      make: (rng, level) => {
        const last = rng.int(2, 8) * 5 + 4,
          mean = (16 + last) / 5;
        return task(
          level,
          `Die Wartezeiten sind 3; 4; 4; 5; ${last} Minuten. Berechne Mittelwert und Median.`,
          `Eine Werbung nennt für Wartezeiten 3; 4; 4; 5; ${last} Minuten nur den Mittelwert. Berechne ihn und wähle die geeignetere Kenngröße für die typische Einzelwartezeit.`,
          [
            num("Mittelwert =", mean, "min", 2),
            ...(level === 1
              ? [num("Median =", 4, "min", 0)]
              : [
                  pick(
                    "Typische Wartezeit hier besser beschrieben durch …",
                    [
                      "Median 4 min",
                      "Maximum allein",
                      "Spannweite als typische Zeit",
                    ],
                    0,
                  ),
                ]),
          ],
          "Die Summe ist 16 plus der letzte Wert; der mittlere Wert bleibt 4.",
          `(${16} + ${last}) : 5 = ${fmt(mean)}. Vier Werte liegen eng zusammen; der einzelne hohe Wert zieht den Mittelwert nach oben.`,
          `Mittel ${fmt(mean)} min; Median 4 min.`,
          { last, mean },
        );
      },
    },
    {
      id: "gleicher-mittelwert",
      make: (rng, level) => {
        const m = rng.int(4, 10),
          d = rng.int(1, 3);
        return task(
          level,
          `Vergleiche A: ${m}; ${m}; ${m} mit B: ${m - d}; ${m}; ${m + d}. Bestimme beide Mittelwerte und die Spannweite von B.`,
          `Zwei Gruppen haben die Daten A: ${m}; ${m}; ${m} und B: ${m - d}; ${m}; ${m + d}. Bestimme die Spannweite von B und beurteile die Aussage „gleicher Mittelwert bedeutet gleiche Streuung“.`,
          [
            ...(level === 1 ? [num("Mittelwert A und B =", m, "", 0)] : []),
            num("Spannweite B =", 2 * d, "", 0),
            ...(level === 2
              ? [
                  pick(
                    "Aussage",
                    [
                      "falsch, die Spannweiten sind verschieden",
                      "richtig, der Mittelwert bestimmt alles",
                      "nur bei drei Werten richtig",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Die Werte von B liegen symmetrisch um m; die Randdifferenz beträgt 2d.",
          `Beide Summen sind ${3 * m}. A hat Spannweite 0, B hat ${m + d} − ${m - d} = ${2 * d}.`,
          `Mittelwerte ${m}; Spannweiten 0 und ${2 * d}.`,
          { m, d },
        );
      },
    },
  ],
});

const stichprobe = L(3, {
  id: "da-3-stichproben",
  title: "8.3 Sinnvolle und repräsentative Stichproben",
  subtitle: "Die Auswahl zählt ebenso wie die Größe",
  whyItMatters:
    "Viele Antworten helfen wenig, wenn nur eine bestimmte Gruppe erreicht wurde. Eine Umfrage soll die gemeinte Grundgesamtheit abbilden.",
  explanationHtml: `<p>Die <strong>Grundgesamtheit</strong> sind alle Personen oder Objekte, über die du eine Aussage machen willst. Eine Stichprobe untersucht einen Teil davon. Eine repräsentative Auswahl bildet wichtige Merkmale der Grundgesamtheit angemessen ab; eine zufällige Auswahl aus der ganzen Zielgruppe vermindert systematische Auswahlverzerrungen.</p><div class="example">Du willst die Verkehrsmittel aller Schülerinnen und Schüler kennen. Nur Fahrräder am Fahrradständer zu zählen vernachlässigt Fußgänger und Buskinder. Eine zufällige Auswahl aus den Klassen aller Jahrgangsstufen ist sinnvoller. Eine freiwillige Onlineumfrage kann Personen mit besonders starkem Interesse überrepräsentieren.</div><p>Eine größere Stichprobe verringert zufällige Schwankungen, beseitigt aber keine falsche Auswahl. Auch eine ausgewogen geplante Stichprobe kann zufällig abweichen. Nenne daher Zielgruppe, Auswahlverfahren, Umfang und mögliche Verzerrung.</p><div class="merke"><strong>Merke:</strong> Prüfe, wer überhaupt die Chance hatte teilzunehmen. „Viele Antworten“ allein bedeutet nicht repräsentativ.</div>`,
  formulas: [
    {
      name: "Umfrage prüfen",
      html: "Grundgesamtheit · Auswahlverfahren · Umfang · mögliche Verzerrung",
      quantities:
        "repräsentativ ist eine Eigenschaft der Auswahl, keine feste Mindestzahl",
    },
  ],
  quiz: {
    question: "Welche Auswahl ist für die ganze Schule am sinnvollsten?",
    options: [
      "Zufällig aus allen Jahrgangsstufen auswählen.",
      "Nur die Mitglieder einer AG befragen.",
      "Nur freiwillige Antworten einer einzelnen Klasse sammeln.",
    ],
    correctIndex: 0,
    explanation:
      "Die Auswahl muss die gesamte Zielgruppe erreichen; eine AG oder einzelne Klasse kann systematisch anders sein.",
  },
  lab: lab(
    "sample",
    "Auswahlverzerrung im Modell",
    "Zwei gleich große Gruppen haben Ja-Anteile 20 % und 80 %. Wähle die Stichprobenzusammensetzung. Die Anzeige zeigt den erwarteten Anteil bei zufälliger Auswahl innerhalb jeder Gruppe; echte Ergebnisse können schwanken.",
    [
      r("a", "Befragte aus Gruppe A", 0, 50, 5, 5),
      r("b", "Befragte aus Gruppe B", 0, 50, 20, 5),
      c(
        "method",
        "Auswahl innerhalb der Gruppen",
        ["freiwillige Meldung", "zufällige Auswahl"],
        0,
      ),
    ],
    [
      o("size", "Umfang", (v) => v.a + v.b),
      o("expected", "Erwarteter Ja-Anteil im Zufallsmodell", (v) => {
        const p = sampleExpectation(v.a, v.b);
        return p === null ? "keine Stichprobe" : fmt(p) + " %";
      }),
      o("population", "Ja-Anteil der Grundgesamtheit", () => "50 %"),
      o("caution", "Auswahlhinweis", (v) =>
        v.method === 0
          ? "Selbstauswahl kann zusätzliche Verzerrung erzeugen"
          : v.a === v.b && v.a > 0
            ? "Gruppen ausgewogen; Zufallsschwankung bleibt"
            : "Gruppen ungleich gewichtet",
      ),
    ],
    [
      {
        id: "ausgewogen",
        text: "Wähle zufällig je 20 Personen aus beiden Gruppen.",
        check: (v) => v.a === 20 && v.b === 20 && v.method === 1,
      },
      {
        id: "einseitig",
        text: "Zeige 50 freiwillige Meldungen nur aus Gruppe B. Die große Zahl beseitigt die Verzerrung nicht.",
        check: (v) => v.a === 0 && v.b === 50 && v.method === 0,
      },
      {
        id: "kleiner",
        text: "Vergleiche eine kleinere ausgewogene Zufallsauswahl mit je 10 Personen.",
        check: (v) => v.a === 10 && v.b === 10 && v.method === 1,
      },
    ],
  ),
  exercises: [
    {
      id: "auswahl",
      make: (rng, level) => {
        const mode = rng.int(0, 2),
          n = rng.pick([30, 60, 120]),
          plans = [
            `${n} zufällig aus allen Jahrgangsstufen ausgewählte Personen`,
            `${n} freiwillige Antworten nur aus einer Sport-AG`,
            `${n} Personen ausschließlich aus der 7a`,
          ];
        return task(
          level,
          `Eine Umfrage soll die ganze Schule beschreiben. Beurteile den Plan: ${plans[mode]}.`,
          `Für eine Aussage über die ganze Schule werden ${plans[mode]} befragt. Prüfe die Auswahl und entscheide, ob eine Verdopplung derselben Auswahlart eine vorhandene systematische Verzerrung sicher beseitigt.`,
          [
            pick(
              "Auswahl",
              [
                "grundsätzlich sinnvoll; Zufallsschwankung bleibt",
                "systematisch eingeschränkte Zielgruppe",
              ],
              mode === 0 ? 0 : 1,
            ),
            ...(level === 2
              ? [
                  pick(
                    "Mehr Antworten beseitigen jede Auswahlverzerrung?",
                    ["nein", "ja"],
                    0,
                  ),
                ]
              : []),
          ],
          "Vergleiche die erreichbaren Personen mit der gesamten Zielgruppe.",
          mode === 0
            ? "Alle Jahrgangsstufen sind grundsätzlich erreichbar. Dennoch bleibt Zufallsschwankung."
            : "Die ausgewählte Teilgruppe muss nicht die ganze Schule abbilden. Mehr Antworten nur aus derselben Teilgruppe lösen das nicht.",
          `${mode === 0 ? "Sinnvoller Ansatz" : "Auswahl verzerrungsgefährdet"}; Umfang allein genügt nicht.`,
          { mode, n },
        );
      },
    },
    {
      id: "gruppenanteile",
      make: (rng, level) => {
        const a = rng.pick([10, 20, 30]),
          b = level === 1 ? a : 3 * a,
          p = sampleExpectation(a, b)!;
        return task(
          level,
          `Zwei gleich große Gruppen haben Ja-Anteile 20 % und 80 %. Es werden je ${a} zufällig Befragte ausgewählt. Welcher Ja-Anteil wird im Modell erwartet?`,
          `Zwei gleich große Gruppen haben Ja-Anteile 20 % und 80 %. Eine Stichprobe enthält ${a} aus A und ${b} aus B, jeweils zufällig ausgewählt. Bestimme den erwarteten Anteil und beurteile die Gruppengewichtung.`,
          [
            num("Erwarteter Anteil =", p, "%", 2),
            ...(level === 2
              ? [
                  pick(
                    "Gruppen sind …",
                    [
                      "ungleich gewichtet",
                      "gleich gewichtet",
                      "wegen großer Zahl automatisch repräsentativ",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Erwartete Ja-Zahl = 0,2 · n_A + 0,8 · n_B; durch Gesamtzahl teilen.",
          `(0,2 · ${a} + 0,8 · ${b}) : ${a + b} · 100. Das ist ein Erwartungswert, keine Garantie für das beobachtete Ergebnis.`,
          `${fmt(p)} %; ${a === b ? "ausgewogene" : "ungleiche"} Gewichtung.`,
          { a, b, p },
        );
      },
    },
  ],
});

const diagramme = L(4, {
  id: "da-4-diagramme",
  title: "8.4 Diagramme kritisch lesen",
  subtitle: "Achsen, Maßstab und Darstellung prüfen",
  whyItMatters:
    "Die Daten können korrekt sein und trotzdem durch die Zeichnung einen falschen Eindruck erzeugen. Du prüfst deshalb Zahlen und Gestaltung gemeinsam.",
  explanationHtml: `<p>Prüfe Titel, Quelle, Zeitraum, Einheit, Achsenbeginn und gleichmäßige Skalierung. Bei Säulendiagrammen vergleicht man Säulenlängen. Eine abgeschnittene y-Achse kann kleine Unterschiede riesig erscheinen lassen; beginne sie für einen fairen Längenvergleich bei 0. Falls ein Ausschnitt fachlich nötig ist, muss er deutlich markiert sein.</p><div class="example">Ein Wert steigt von 90 auf 100. Die reale Zunahme beträgt 10 : 90 · 100 ≈ 11,1 %. Beginnen die Säulen erst bei 80, sind die sichtbaren Höhen 10 und 20: Die zweite Säule wirkt doppelt so hoch. Das ist kein realer Zuwachs von 100 %.</div><p>Auch ungleich breite Zeitabstände, fehlende Gruppen oder mit Höhe und Breite vergrößerte Bildsymbole können täuschen. Bei verdoppelter Symbolhöhe und -breite vervierfacht sich die Fläche. Eine bessere Darstellung benutzt gleiche Breiten, gleichmäßige Achsen und klare Beschriftungen.</p><div class="merke"><strong>Merke:</strong> Lies zuerst die Zahlen und den Maßstab. Beschreibe die Verzerrung konkret und schlage eine passende Darstellung vor.</div>`,
  formulas: [
    {
      name: "Reale relative Zunahme",
      html: "(neuer Wert − alter Wert) : alter Wert · 100 %",
      quantities: "Bezug auf den alten Wert, nicht auf sichtbare Säulenreste",
    },
  ],
  quiz: {
    question:
      "Werte 90 und 100 erscheinen als Säulenreste 10 und 20. Was wurde verändert?",
    options: [
      "Die Achse beginnt bei 80.",
      "Die Daten haben sich verdoppelt.",
      "Der reale Zuwachs ist 100 %.",
    ],
    correctIndex: 0,
    explanation:
      "Mit Achsenbeginn 80 bleiben sichtbare Höhen 90 − 80 = 10 und 100 − 80 = 20.",
  },
  lab: lab(
    "chart",
    "Achsenbeginn verändern",
    "Die Daten bleiben 90 und 100. Ziehe den Achsenbeginn und beobachte den Unterschied zwischen realem Verhältnis und sichtbaren Säulenhöhen.",
    [r("baseline", "Beginn der y-Achse", 0, 85, 20, 5)],
    [
      o(
        "ratio",
        "Verhältnis der sichtbaren Höhen",
        (v) => (100 - v.baseline) / (90 - v.baseline),
      ),
      o("actual", "Reale Zunahme", () => 100 / 9, "%"),
      o("start", "Darstellung", (v) =>
        v.baseline === 0
          ? "vollständige Säulen ab 0"
          : "Ausschnitt: Achse abgeschnitten",
      ),
    ],
    [
      {
        id: "fair",
        text: "Stelle den fairen Längenvergleich ab 0 ein.",
        check: (v) => v.baseline === 0,
      },
      {
        id: "doppelt",
        text: "Lasse die zweite Säule doppelt so hoch wirken: Achsenbeginn 80.",
        check: (v) => v.baseline === 80,
      },
      {
        id: "dreifach",
        text: "Lasse sie dreimal so hoch wirken: Achsenbeginn 85. Die Daten bleiben unverändert.",
        check: (v) => v.baseline === 85,
      },
    ],
  ),
  exercises: [
    {
      id: "reale-zunahme",
      make: (rng, level) => {
        const old = rng.int(5, 10) * 10,
          delta = rng.int(1, 3) * 5,
          next = old + delta,
          baseline = old - delta;
        return task(
          level,
          `Ein Wert steigt von ${old} auf ${next}. Berechne die reale prozentuale Zunahme, bezogen auf den alten Wert.`,
          `Ein Säulendiagramm zeigt ${old} und ${next}, beginnt aber bei ${baseline}. Berechne die reale prozentuale Zunahme und das Verhältnis der sichtbaren Säulenhöhen.`,
          [
            num("Reale Zunahme =", (delta / old) * 100, "%", 2),
            ...(level === 2
              ? [num("Sichtbares Höhenverhältnis =", 2, "", 0)]
              : []),
          ],
          "Differenz durch alten Wert teilen, dann mit 100 multiplizieren.",
          `(${next} − ${old}) : ${old} · 100. ${level === 2 ? `Die sichtbaren Höhen sind ${delta} und ${2 * delta}, also Verhältnis 2.` : ""}`,
          `Real ${fmt((delta / old) * 100, 2)} %${level === 2 ? "; sichtbares Verhältnis 2" : ""}.`,
          { old, next, delta, baseline },
        );
      },
    },
    {
      id: "verbessern",
      make: (rng, level) => {
        const mode = rng.int(0, 2),
          issues = [
            "Ein Säulendiagramm schneidet die Achse bei 80 ab und verschweigt dies.",
            "Ein Zeitdiagramm setzt die Jahre 2020, 2021 und 2025 in gleiche Abstände.",
            "Ein Bildsymbol wird bei doppeltem Wert in Höhe und Breite verdoppelt.",
          ],
          fixes = [
            "Säulen ab 0 und klare Achsenbeschriftung",
            "Zeitabstände proportional zum Kalenderabstand",
            "gleich breite Säulen statt flächenvergrößerter Symbole",
          ];
        return task(
          level,
          `Untersuche die Darstellung: ${issues[mode]} Wähle eine passende Verbesserung.`,
          `In einer Werbung gilt: ${issues[mode]} Wähle eine angemessenere Darstellung und beurteile, ob die Zahlen allein einen fairen Bildeindruck garantieren.`,
          [
            pick(
              "Verbesserung",
              [
                fixes[mode],
                "Beschriftungen entfernen",
                "Maßstab noch stärker verzerren",
              ],
              0,
            ),
            ...(level === 2
              ? [
                  pick(
                    "Korrekte Zahlen garantieren fairen Eindruck?",
                    ["nein", "ja"],
                    0,
                  ),
                ]
              : []),
          ],
          "Prüfe Achsenbeginn, gleichmäßige Zeitabstände und Flächenwirkung.",
          mode === 0
            ? "Abgeschnittene Säulen übertreiben Längenunterschiede."
            : mode === 1
              ? "Vier Jahre brauchen viermal so viel Abstand wie ein Jahr."
              : "Doppelte Höhe und Breite ergeben vierfache Fläche und übertreiben eine Verdopplung.",
          `${fixes[mode]}.`,
          { mode },
        );
      },
    },
  ],
});
export const STAGE_DATEN = makeStage(
  8,
  "Auswertung von Daten",
  "Kenngrößen, Stichproben und faire Diagramme",
  "#e11d48",
  "▥",
  [8, 6],
  [kennzahlen, ausreisser, stichprobe, diagramme],
);
