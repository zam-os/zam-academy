import { sub } from "../chemistry/model";
import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, lesson, numberField, withSlips } from "./helpers";

const id = "arbeiten";

const FORMULA_SAMPLES: ReadonlyArray<{
  name: string;
  formula: string;
  kind: "Molekül" | "Formeleinheit";
  aSym: string;
  aCount: number;
  bSym: string;
  bCount: number;
}> = [
  { name: "Wasser", formula: "H₂O", kind: "Molekül", aSym: "H", aCount: 2, bSym: "O", bCount: 1 },
  { name: "Kohlenstoffdioxid", formula: "CO₂", kind: "Molekül", aSym: "C", aCount: 1, bSym: "O", bCount: 2 },
  { name: "Ammoniak", formula: "NH₃", kind: "Molekül", aSym: "N", aCount: 1, bSym: "H", bCount: 3 },
  { name: "Methan", formula: "CH₄", kind: "Molekül", aSym: "C", aCount: 1, bSym: "H", bCount: 4 },
  { name: "Distickstofftrioxid", formula: "N₂O₃", kind: "Molekül", aSym: "N", aCount: 2, bSym: "O", bCount: 3 },
  { name: "Aluminiumoxid", formula: "Al₂O₃", kind: "Formeleinheit", aSym: "Al", aCount: 2, bSym: "O", bCount: 3 },
  { name: "Eisen(III)-chlorid", formula: "FeCl₃", kind: "Formeleinheit", aSym: "Fe", aCount: 1, bSym: "Cl", bCount: 3 },
];

export const STAGE_ARBEITEN: Stage = {
  id,
  stageNumber: 1,
  title: "Wie Chemiker denken und arbeiten",
  subtitle: "Sicherheit, Experiment, Modelle und Fachsprache",
  icon: "🥽",
  accent: "#0d9488",
  badgeTitle: "Laborprofi",
  lehrplanLabel: "C8 LB 1 (I)",
  lessons: [
    lesson(id, 1, {
      id: "ch-gefahrstoffe-sicherheit",
      title: "Gefahrstoffe, Laborregeln und Entsorgung",
      subtitle: "GHS-Piktogramme lesen, Schutzmaßnahmen und Sammelwege ableiten",
      bindings: { I: 1 },
      why: "Jedes Etikett auf einer Chemikalienflasche verrät dir vor Versuchsbeginn, wie du dich und die Umwelt schützt.",
      html: "<p>Im Chemieraum arbeitest du erst nach der <strong>Sicherheitsunterweisung</strong> und nur nach Anweisung. Chemikalien sind nach dem weltweit einheitlichen <strong>GHS-System</strong> gekennzeichnet: rot umrandete Piktogramme, ein Signalwort (<strong>‚Gefahr‘</strong> für schwerwiegende Gefahren, <strong>‚Achtung‘</strong> für weniger schwere Kategorien) sowie <strong>H-Sätze</strong> (Gefahrenhinweise) und <strong>P-Sätze</strong> (Sicherheitshinweise). Die Schutzbrille trägst du bei jedem Experiment; bei ätzenden Stoffen kommen Schutzhandschuhe hinzu, giftige oder stechend riechende Gase und Dämpfe gehören in den Abzug, entzündbare Flüssigkeiten weit weg von offenen Flammen.</p><p>Auch die <strong>Entsorgung</strong> richtet sich nach den Stoffeigenschaften: Schwermetallsalze, organische Lösungsmittel sowie saure oder alkalische Reste werden niemals einfach in den Ausguss geschüttet, sondern in beschrifteten <strong>Sammelbehältern</strong> getrennt erfasst.</p><div class=\"example\"><strong>Beispiel:</strong> Ethanol trägt das Piktogramm Flamme (GHS02) und das Signalwort ‚Gefahr‘. Daraus folgt: Vorratsflasche sofort verschließen, Gasbrenner in der Nähe löschen, Reste in den Sammelbehälter für halogenfreie organische Lösungsmittel geben.</div>",
      rule: "GHS-Piktogramm + H-/P-Sätze lesen → Gefahr erkennen → Schutzmaßnahme ergreifen → Reste getrennt entsorgen",
      terms: [
        ["GHS02 / GHS03", "Flamme (entzündbar) · Flamme über Kreis (brandfördernd)", "Zündquellen bzw. brennbare Stoffe fernhalten"],
        ["GHS05 / GHS06", "Ätzwirkung · Akute Toxizität (Totenkopf)", "Schutzbrille, Handschuhe, Abzug"],
        ["GHS07 / GHS08 / GHS09", "Achtung (reizend) · Gesundheitsgefahr · Gewässergefährdend", "Sammelbehälter statt Ausguss"],
      ],
      quiz: [
        "Eine Lösung trägt die Piktogramme Ätzwirkung (GHS05) und Umwelt (GHS09). Welche Kombination aus Schutz und Entsorgung ist richtig?",
        "Schutzbrille und Schutzhandschuhe tragen; Reste in den vorgesehenen Sammelbehälter geben.",
        "Nur am offenen Fenster arbeiten und die Reste stark verdünnt in den Ausguss spülen.",
        "GHS05 verlangt Augen- und Hautschutz, GHS09 verbietet das Einleiten ins Abwasser.",
      ],
      lab: makeLab("ghs"),
      exercises: [
        cases(
          "ghs-massnahmen",
          [
            cc(
              "Welche Gefahr kennzeichnet das Piktogramm Flamme über einem Kreis (GHS03)?",
              "Der Stoff wirkt brandfördernd und facht Brände auch ohne Luftzufuhr an.",
              ["Der Stoff ist wasserlöslich und löscht Flammen.", "Der Stoff ist ausschließlich umweltgefährlich."],
              "GHS03 steht für oxidierende, also brandfördernde Gase, Flüssigkeiten oder Feststoffe.",
              "Unterscheide Flamme (brennbar) und Flamme über Kreis (liefert Sauerstoff für Brände).",
            ),
            cc(
              "Was bedeutet das Signalwort ‚Gefahr‘ im Vergleich zu ‚Achtung‘ auf einem Chemikalienetikett?",
              "‚Gefahr‘ warnt vor einer schwerwiegenderen Gefahrenkategorie als ‚Achtung‘.",
              ["Beide Wörter sind frei austauschbar.", "‚Achtung‘ steht für die höhere Gefahr."],
              "Im GHS-System kennzeichnet ‚Gefahr‘ die strengeren Gefahrenkategorien.",
              "Welches der beiden Signalwörter klingt dringlicher?",
            ),
            cc(
              "Welche Information liefern P-Sätze auf einem Gefahrstoffetikett?",
              "Sicherheitsratschläge zu Schutzmaßnahmen, Lagerung, Erster Hilfe und Entsorgung.",
              ["Den aktuellen Marktpreis der Chemikalie.", "Die Schmelz- und Siedetemperatur des Reinstoffs."],
              "H-Sätze nennen die Gefahren (Hazard), P-Sätze die Sicherheitsmaßnahmen (Precautionary Statements).",
              "P steht für Precautionary — Vorsichtsmaßnahme.",
            ),
          ],
          [
            cc(
              "Du sollst mit verdünnter Natronlauge (GHS05) experimentieren. Ein Mitschüler setzt die Schutzbrille ab, weil sein eigener Brenner schon aus ist. Wie reagierst du fachgerecht?",
              "Die Schutzbrille bleibt auf, solange irgendwo im Raum mit Chemikalien gearbeitet oder aufgeräumt wird.",
              ["Ohne offene Flamme ist keine Schutzbrille nötig.", "Es genügt, beim Umschütten die Augen kurz zuzukneifen."],
              "Spritzer ätzender Lösungen können auch beim Nachbartisch oder beim Spülen ins Auge gelangen.",
              "Schützt die Brille nur vor Feuer oder vor allen Chemikalienspritzern?",
            ),
            cc(
              "Im Abzug entsteht ein stechend riechendes Gas mit GHS06 (Totenkopf). Welche Arbeitsweise ist zwingend?",
              "Frontschieber tief halten, Lüftung eingeschaltet lassen und niemals direkt daran riechen.",
              ["Gefäß aus dem Abzug tragen, um den Geruch am Platz zu prüfen.", "Das Gas mit dem Mund aus dem Reagenzglas pusten."],
              "Akut giftige Gase dürfen nicht in die Raumluft gelangen; der Abzug saugt sie kontrolliert ab.",
              "Wozu dient der Abzug im Chemiesaal?",
            ),
          ],
        ),
        cases(
          "entsorgung-laborregeln",
          [
            cc(
              "Wie prüfst du im Chemieunterricht vorschriftsmäßig den Geruch einer freigegebenen Probe?",
              "Gefäß mit Abstand halten und die Dämpfe vorsichtig mit der Hand zur Nase fächeln.",
              ["Nase direkt über die Gefäßöffnung halten und kräftig einatmen.", "Einen Tropfen zwischen den Fingern verreiben."],
              "Durch Zufächeln gelangt nur eine stark verdünnte Gasprobe zur Nase.",
              "Wie vermeidest du das Einatmen hoher Dampfkonzentrationen?",
            ),
            cc(
              "Wohin gehören kupfersalzhaltige Versuchslösungen (GHS09) nach dem Experiment?",
              "In den beschrifteten Sammelbehälter für schwermetallhaltige Abfälle.",
              ["Mit viel Leitungswasser in das Waschbecken.", "In den Papierkorb im Klassenzimmer."],
              "Kupferionen schädigen Wasserorganismen und Mikroorganismen in Kläranlagen.",
              "Was verlangt das Umweltpiktogramm GHS09?",
            ),
          ],
          [
            cc(
              "Beim Umfüllen gelangt ein Spritzer verdünnter Säure auf deinen Handrücken. Was ist die richtige Sofortmaßnahme?",
              "Sofort unter fließendem, kaltem Wasser gründlich abspülen und umgehend der Lehrkraft Bescheid geben.",
              ["Mit einer starken Lauge auf der Haut neutralisieren.", "Ein Pflaster darüberkleben und weiterarbeiten."],
              "Viel fließendes Wasser verdünnt und entfernt den Gefahrstoff schnell; Neutralisation auf der Haut würde zusätzliche Wärme freisetzen.",
              "Verdünnen mit Wasser + Meldepflicht im Labor.",
            ),
            cc(
              "Nach einer Extraktion bleibt ein Gemisch aus Benzin (GHS02, GHS09) und gelöstem Iod übrig. Welcher Entsorgungsweg stimmt?",
              "In den Sammelbehälter für halogenhaltige organische Lösungsmittelabfälle.",
              ["Auf dem Fenstersims verdunsten lassen.", "In den Ausguss kippen, da es flüssig ist."],
              "Organische, iodhaltige Lösungsmittel sind brennbar und gewässergefährdend; sie werden getrennt gesammelt.",
              "Benzin ist organisch, Iod ist ein Halogen.",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-experiment-protokoll",
      title: "Fragestellung, Experiment und Versuchsprotokoll",
      subtitle: "Hypothesen prüfen, Arbeitstechniken nutzen, Beobachtung und Deutung trennen",
      bindings: { I: 1 },
      why: "Nur wenn du Beobachtung auf der Stoffebene und Erklärung auf der Teilchenebene sauber trennst, wird aus einem Versuch belastbare Erkenntnis.",
      html: "<p>Naturwissenschaftliches Arbeiten folgt einem klaren roten Faden: Aus einem Phänomen entwickelst du eine <strong>Fragestellung</strong> und formulierst eine überprüfbare <strong>Hypothese</strong> (begründete Vermutung). Danach planst du einen fairen Versuch mit passenden <strong>Laborgeräten und Arbeitstechniken</strong> (z.&nbsp;B. Gasbrenner mit rauschender Flamme, Reagenzglasklammer, pneumatische Gasauffangwanne, Nachweisreagenz), bei dem immer nur eine Einflussgröße verändert wird.</p><p>Im <strong>Versuchsprotokoll</strong> dokumentierst du Aufbau (auch als beschriftete Skizze), Durchführung, <strong>Beobachtung</strong> und <strong>Auswertung/Deutung</strong>. Die Beobachtung beschreibt ausschließlich sinnlich wahrnehmbare oder messbare Stoff- und Energieänderungen (Farbumschlag, Gasbläschen, Erwärmung, Leuchten). Erst in der Deutung erklärst du die Ursache auf der <strong>Teilchenebene</strong> und entscheidest, ob deine Hypothese bestätigt (verifiziert) oder widerlegt (falsifiziert) wurde. Ergebnisse stellst du adressatengerecht in Texten, Tabellen, Diagrammen oder Versuchsskizzen dar.</p><div class=\"example\"><strong>Beispiel:</strong> Beim Erhitzen eines Kupferblechs in der Brennerflamme — <em>Beobachtung (Stoffebene):</em> Das rötlich glänzende Blech überzieht sich mit einer schwarzen, spröden Schicht. <em>Deutung (Teilchenebene):</em> Kupferatome reagieren mit Sauerstoffmolekülen der Luft zu schwarzem Kupfer(II)-oxid.</div>",
      rule: "Fragestellung → Hypothese → Experiment → Beobachtung (Stoffebene) → Deutung (Teilchenebene) → Rückbezug auf Hypothese",
      terms: [
        ["Hypothese", "prüfbare Vermutung zu einer Fragestellung", "wird im Versuch bestätigt oder widerlegt"],
        ["Beobachtung (Stoffebene)", "was man sieht, hört, riecht oder misst", "noch ohne Teilchenerklärung"],
        ["Deutung (Teilchenebene)", "Erklärung mit Teilchen, Atomen, Ionen oder Molekülen", "knüpft an die Beobachtung an"],
      ],
      quiz: [
        "Welcher Satz gehört im Versuchsprotokoll eindeutig in den Abschnitt ‚Beobachtung‘?",
        "Das weiße Pulver färbt sich bei Zugabe eines Wassertropfens blau und das Glas erwärmt sich.",
        "Wassermoleküle lagern sich exotherm an die Ionen im Gitter an.",
        "Farbwechsel und Erwärmung sind auf der Stoffebene wahrnehmbar; Wassermoleküle und Ionen gehören in die Deutung.",
      ],
      lab: makeLab("protokoll"),
      exercises: [
        cases(
          "beobachtung-deutung",
          [
            cc(
              "„Ein glimmender Holzspan flammt im Reagenzglas hell wieder auf.“ Welchem Protokollabschnitt ordnest du den Satz zu?",
              "Beobachtung (Stoffebene)",
              ["Deutung (Teilchenebene)", "Geräte- und Chemikalienliste"],
              "Das Aufleuchten des Spans ist unmittelbar sichtbar und enthält noch keine Aussage über Sauerstoffmoleküle.",
              "Sieht man den Vorgang direkt mit den Augen?",
            ),
            cc(
              "„Im Reagenzglas lag eine erhöhte Konzentration an Sauerstoffmolekülen vor, die die Verbrennung beschleunigten.“ Wohin gehört dieser Satz?",
              "Deutung / Auswertung (Teilchenebene)",
              ["Beobachtung (Stoffebene)", "Versuchsdurchführung"],
              "Sauerstoffmoleküle sind unsichtbar; hier wird die Beobachtung fachlich erklärt.",
              "Werden hier Teilchen genannt, um den Befund zu erklären?",
            ),
            cc(
              "Welche Arbeitstechnik nutzt du beim Erhitzen einer Flüssigkeit im Reagenzglas über dem Gasbrenner?",
              "Reagenzglas mit der Klammer schräg halten, leicht schwenken und die Öffnung von Personen wegrichten.",
              ["Reagenzglas mit dem Daumen fest verschließen und senkrecht in die Flamme halten.", "Reagenzglas bis zum Rand füllen und ohne Schutzbrille von oben hineinschauen."],
              "Durch Siedeverzüge kann heiße Flüssigkeit herausspritzen; Schwenken und sichere Ausrichtung verhindern Verletzungen.",
              "Wohin darf siedende Flüssigkeit niemals spritzen?",
            ),
          ],
          [
            cc(
              "Ein Schüler schreibt unter ‚Beobachtung‘: „Es entsteht Kohlenstoffdioxid.“ Warum korrigiert die Lehrkraft diesen Eintrag?",
              "Kohlenstoffdioxid ist ein farbloses, geruchloses Gas; sichtbar sind nur aufsteigende Gasbläschen und die Trübung von Kalkwasser.",
              ["Weil Kohlenstoffdioxid immer violett gefärbt ist.", "Weil Gasbildung in einem Protokoll grundsätzlich nicht erwähnt werden darf."],
              "Die Identifizierung des Gases folgt erst aus dem Nachweis in der Deutung; beobachtbar sind Bläschen und Trübung.",
              "Was nimmt das Auge tatsächlich wahr, bevor gedeutet wird?",
            ),
            cc(
              "Deine Hypothese lautete: ‚Kochsalz leitet schon als trockener Kristall den elektrischen Strom.‘ Im Experiment bleibt die Lampe dunkel. Was folgt daraus?",
              "Die Hypothese ist durch das Experiment widerlegt (falsifiziert) und wird im Protokoll begründet verworfen.",
              ["Die Messwerte werden im Heft geändert, damit die Hypothese stimmt.", "Das Experiment war wertlos, weil eine Hypothese immer wahr sein muss."],
              "Auch eine widerlegte Hypothese liefert echten Erkenntnisgewinn: Feste Salze besitzen keine frei beweglichen Ionen.",
              "Wie geht die Naturwissenschaft mit widerlegten Vermutungen um?",
            ),
          ],
        ),
        cases(
          "hypothese-dokumentation",
          [
            cc(
              "Du misst beim Erhitzen von Salzwasser jede Minute die Temperatur. Welche Darstellungsform zeigt den zeitlichen Verlauf am übersichtlichsten?",
              "Ein Temperatur-Zeit-Diagramm mit beschrifteten Achsen und Einheiten.",
              ["Ein Fließtext ohne Zahlenangaben.", "Ein einzelnes Gefahrensymbol."],
              "Zusammenhänge zweier Messgrößen (Zeit t und Temperatur θ) lassen sich im Liniendiagramm sofort ablesen.",
              "Welche Darstellungsform macht Trends und Siedebereiche sichtbar?",
            ),
            cc(
              "Worauf achtest du bei einer fachgerechten Skizze eines Versuchsaufbaus?",
              "Übersichtliche Schnittzeichnung mit Lineal und eindeutiger Beschriftung der Geräte und Chemikalien.",
              ["Dreidimensionale Kunstzeichnung mit Schattierungen, aber ohne Beschriftung.", "Nur die Flamme zeichnen und alle Glasgeräte weglassen."],
              "Chemische Versuchsskizzen sind zweidimensionale Schnittdarstellungen, an denen jeder den Aufbau nachvollziehen kann.",
              "Wie zeichnet man Laborgeräte im Chemieheft?",
            ),
          ],
          [
            cc(
              "Du willst prüfen, ob der Zerteilungsgrad von Eisen die Verbrennung beschleunigt. Welche Versuchsplanung ist fair?",
              "Gleiche Masse an Eisennagel und Eisenwolle unter gleichen Bedingungen in die gleiche Brennerflamme halten.",
              ["Einen Eisennagel in Luft mit Eisenwolle in reinem Sauerstoff vergleichen.", "Eisennagel im Eisbad und Magnesiumband in der Flamme vergleichen."],
              "Bei Variablenkontrolle darf sich nur der Zerteilungsgrad unterscheiden, nicht gleichzeitig Stoffart oder Sauerstoffgehalt.",
              "Wie viele Größen dürfen sich zwischen beiden Ansätzen unterscheiden?",
            ),
            cc(
              "Für ein Kurzreferat über das Linde-Verfahren bereitest du Folien für deine Klasse vor. Was macht die Präsentation adressaten- und sachgerecht?",
              "Klare Fließschemata, korrekte Fachbegriffe und Siedetemperaturen in °C statt überladener Textwände.",
              ["Reine Alltagssprache ohne chemische Formeln oder Temperaturen.", "Kopierte Fachtexte aus einem Hochschullehrbuch ohne Erklärung."],
              "Gute naturwissenschaftliche Präsentationen verbinden präzise Fachsprache mit anschaulichen Skizzen und Tabellen.",
              "Was hilft Mitschülerinnen und Mitschülern beim Verstehen?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-modelle-fachsprache",
      title: "Modelle, Modellgrenzen und chemische Fachsprache",
      subtitle: "Vom Alltagswort zur präzisen Formel- und Modellvorstellung",
      bindings: { I: 1 },
      why: "Modelle machen das Unsichtbare denkbar — aber nur wer ihre Grenzen kennt und Formeln exakt liest, vermeidet Fehlschlüsse.",
      html: "<p>Da Atome, Ionen und Moleküle selbst im Lichtmikroskop unsichtbar sind, nutzt die Chemie <strong>Modelle</strong>. Ein Modell hebt genau die Eigenschaften hervor, die zur Erklärung eines Phänomens nötig sind, und lässt anderes bewusst weg. Das einfache <strong>Teilchenmodell</strong> (identische, starre Kugeln) erklärt Aggregatzustände und Diffusion, versagt aber bei chemischen Reaktionen — deshalb wird es zum <strong>Daltonschen Atommodell</strong> und später zum <strong>Kern-Hülle-, Energiestufen- und Kugelwolkenmodell</strong> weiterentwickelt.</p><p>Ebenso grenzt sich die <strong>chemische Fachsprache</strong> von den Ungenauigkeiten der Alltagssprache ab: Im Alltag ‚verschwindet‘ Würfelzucker im Tee; fachlich verteilen sich die Zuckermoleküle beim Lösen gleichmäßig zwischen den Wassermolekülen. In der <strong>Formelsprache</strong> gibt eine tiefgestellte Zahl (<strong>Index</strong>) die Atomzahl bzw. das Zahlenverhältnis an, eine vorangestellte Zahl (<strong>Koeffizient</strong>) die Anzahl ganzer Teilchen oder Formeleinheiten. Dabei unterscheidest du strikt zwischen einer <strong>Molekülformel</strong> (z.&nbsp;B. CO<sub>2</sub>: ein abgegrenztes Molekül aus 1 C-Atom und 2 O-Atomen) und der <strong>Verhältnisformel von Salzen</strong> (z.&nbsp;B. MgCl<sub>2</sub>: Zahlenverhältnis Mg<sup>2+</sup> : Cl<sup>−</sup> = 1 : 2 im Ionengitter).</p><div class=\"example\"><strong>Beispiel:</strong> Die Schreibweise <strong>3 H<sub>2</sub>O</strong> steht für 3 getrennte Wassermoleküle mit insgesamt 3 · 2 = 6 Wasserstoffatomen und 3 · 1 = 3 Sauerstoffatomen (zusammen 9 Atome).</div>",
      rule: "Modelle sind zweckgebunden und haben Grenzen · Koeffizient zählt Teilchen/Formeleinheiten, Index zählt gebundene Atome bzw. das Ionenverhältnis",
      terms: [
        ["Molekülformel", "gibt die genaue Atomzahl in einem einzelnen Molekül an", "z. B. H<sub>2</sub>O, NH<sub>3</sub>, CH<sub>4</sub>"],
        ["Verhältnisformel", "kleinstes ganzzahliges Ionenverhältnis im Salzgitter", "z. B. NaCl, Al<sub>2</sub>O<sub>3</sub>"],
        ["Koeffizient vs. Index", "3 H<sub>2</sub>O: 3 Moleküle, je 2 H-Atome und 1 O-Atom", "Index 1 wird weggelassen"],
      ],
      quiz: [
        "Worin liegt der entscheidende Unterschied zwischen der Molekülformel H₂O und der Verhältnisformel NaCl?",
        "H₂O beschreibt ein einzelnes, abgegrenztes Molekül; NaCl gibt das Zahlenverhältnis 1 : 1 von Na⁺- und Cl⁻-Ionen im Gitter an.",
        "Beide Formeln beschreiben isolierte zweiatomige bzw. dreiatomige Gasmoleküle bei Raumtemperatur.",
        "Salze bilden kein einzelnes NaCl-Molekül, sondern ein ausgedehntes Ionengitter.",
      ],
      lab: makeLab("modellgrenzen"),
      exercises: [
        {
          id: "formel-indizes",
          make(rng, level) {
            const sample = rng.pick(FORMULA_SAMPLES);
            const coeff = rng.int(2, 5);
            const perUnit = sample.aCount + sample.bCount;
            const totalAtoms = coeff * perUnit;
            const totalB = coeff * sample.bCount;
            if (level === 1) {
              return {
                prompt: `Betrachte den Ausdruck <strong>${coeff} ${sample.formula}</strong> (${sample.name}). Wie viele Atome (bzw. Ionen) sind in diesen ${coeff} ${sample.kind === "Molekül" ? "Molekülen" : "Formeleinheiten"} insgesamt enthalten?`,
                given: [
                  `1 ${sample.kind} ${sample.formula}: ${sample.aCount} ${sample.aSym} und ${sample.bCount} ${sample.bSym}`,
                  `Koeffizient davor: ${coeff}`,
                ],
                formulaHint: "Gesamtzahl = Koeffizient · (Summe der Indizes in der Formel); fehlender Index zählt als 1",
                fields: [
                  withSlips(
                    numberField("Teilchen gesamt", totalAtoms),
                    [perUnit, "Das ist nur 1 Einheit — multipliziere noch mit dem Koeffizienten davor."],
                    [coeff * sample.bCount + sample.aCount, "Der Koeffizient vor der Formel gilt für alle Elementsymbole der Formel, nicht nur für eines."],
                  ),
                ],
                steps: [
                  `In 1 ${sample.kind} ${sample.formula} stecken ${sample.aCount} + ${sample.bCount} = ${perUnit} Teilchen.`,
                  `Mit dem Koeffizienten ${coeff} multiplizieren: ${coeff} · ${perUnit} = ${totalAtoms}.`,
                  `<strong>${totalAtoms}</strong>`,
                ],
              };
            }
            const askB = sample.bCount > 1;
            const targetSym = askB ? sample.bSym : sample.aSym;
            const targetPerUnit = askB ? sample.bCount : sample.aCount;
            const answer = coeff * targetPerUnit;
            return {
              prompt: `In einer Reaktionsgleichung steht der Term <strong>${coeff} ${sample.aSym}${sub(sample.aCount)}${sample.bSym}${sub(sample.bCount)}</strong> (${sample.name}). Wie viele <strong>${targetSym}</strong>-Teilchen und wie viele Teilchen aller Sorten zusammen werden dadurch beschrieben?`,
              given: [],
              formulaHint: "Fehlender Index bedeutet 1; der Koeffizient multipliziert jedes Elementsymbol in der Formel",
              fields: [
                withSlips(
                  numberField(`Anzahl ${targetSym}`, answer),
                  [targetPerUnit, `Vergiss den Koeffizienten ${coeff} vor der Formel nicht.`],
                  [coeff + targetPerUnit, "Koeffizient und Index werden multipliziert, nicht addiert."],
                ),
                withSlips(
                  numberField("Gesamtzahl aller Teilchen", totalAtoms),
                  [perUnit, `Multipliziere die Summe ${perUnit} mit dem Koeffizienten ${coeff}.`],
                  [totalB, "Zähle beide Elementsorten der Formel zusammen."],
                ),
              ],
              steps: [
                `Je Einheit ${sample.formula}: ${sample.aCount} ${sample.aSym} und ${sample.bCount} ${sample.bSym} (zusammen ${perUnit}).`,
                `Für ${targetSym}: ${coeff} · ${targetPerUnit} = ${answer}.`,
                `Insgesamt: ${coeff} · ${perUnit} = <strong>${totalAtoms}</strong> (${answer} ${targetSym}).`,
              ],
            };
          },
        },
        cases(
          "modelle-fachsprache",
          [
            cc(
              "Im Alltag sagt man: ‚Die Kerze verbrennt und ist danach weg.‘ Wie lautet die korrekte Aussage in der Fachsprache?",
              "Das Kerzenwachs reagiert mit Sauerstoff zu den farblosen Gasen Kohlenstoffdioxid und Wasserdampf, die in die Luft entweichen.",
              ["Die Atome des Kerzenwachses lösen sich in Wärme auf und verschwinden.", "Das Kerzenwachs gefriert durch die Hitze zu unsichtbarem Eis."],
              "Bei chemischen Reaktionen gehen keine Atome verloren; es entstehen neue, hier gasförmige Reaktionsprodukte.",
              "Können Atome bei einer Verbrennung vernichtet werden?",
            ),
            cc(
              "Warum reicht das einfache Teilchenmodell (eine einzige Kugelart für einen Stoff) nicht aus, um die Elektrolyse von Wasser zu erklären?",
              "Weil bei der Elektrolyse Wassermoleküle in zwei neue Stoffe (Wasserstoff und Sauerstoff) zerlegt werden, wofür man verschiedene Atomsorten braucht.",
              ["Weil Kugeln im Heft nicht gezeichnet werden können.", "Weil Wasser überhaupt nicht aus Teilchen besteht."],
              "Stoffumbildung durch Umgruppierung von Atomen lässt sich erst mit dem Daltonschen Atommodell darstellen.",
              "Was ändert sich bei einer chemischen Reaktion im Gegensatz zum bloßen Verdampfen?",
            ),
          ],
          [
            cc(
              "Eine Mitschülerin behauptet: ‚Ein Kupferatom ist rötlich glänzend und leitet den Strom.‘ Welcher Modellfehler steckt darin?",
              "Makroskopische Stoffeigenschaften wie Farbe, Glanz und Leitfähigkeit entstehen erst im Verband vieler Teilchen, nicht am einzelnen Atom.",
              ["Ein einzelnes Kupferatom ist in Wirklichkeit blau gefärbt.", "Kupfer besteht nicht aus Atomen, sondern aus Wassermolekülen."],
              "Stoffebene und Teilchenebene dürfen nicht verwechselt werden: Einzelne Atome haben keine Farbe und keinen Schmelzpunkt.",
              "Hat ein einzelnes Atom dieselben Eigenschaften wie ein Metallblech?",
            ),
            cc(
              "Warum nutzen Chemikerinnen und Chemiker weiterhin das Daltonsche Atommodell, obwohl das Kern-Hülle-Modell genauer ist?",
              "Für Massenerhaltung und das Ausgleichen einfacher Reaktionsgleichungen ist das Dalton-Modell völlig ausreichend und viel übersichtlicher.",
              ["Weil das Kern-Hülle-Modell im letzten Jahr widerlegt wurde.", "Weil Elektronen bei gar keinem chemischen Phänomen eine Rolle spielen."],
              "Modelle sind Werkzeuge: Man wählt stets das einfachste Modell, das die jeweilige Fragestellung zutreffend erklärt.",
              "Muss ein Modell immer alle Details enthalten oder zum Zweck passen?",
            ),
          ],
        ),
      ],
    }),
  ],
};
