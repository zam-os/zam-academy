# Wirtschaft und Beruf 8 Mittelschule · Lehrplanabdeckung und Bestandsabgleich

Stand: 28. November 2026 (`version: "0.0"`, Lehrkraftprüfung und Erklärvideos noch offen).

## 1. Amtliche Lehrplanquellen und Wortlautprüfung

Das Paket deckt beide Klassenarten von **Wirtschaft und Beruf (WiB) 8** an der bayerischen Mittelschule ab: `28` Lektionen in der Regelklasse **R8**, `29` Lektionen in der Mittlere-Reife-Klasse **M8** (`31` Lektionen insgesamt).

Beide Fachlehrpläne wurden am 28. November 2026 direkt von lehrplanplus.bayern.de abgerufen (`curl -A "Mozilla/5.0"`, kein Wayback-Snapshot nötig), byte-genau als Fixtures gesichert und mit [`wirtschaft-mittelschule-8/scripts/check-curriculum.mjs`](../wirtschaft-mittelschule-8/scripts/check-curriculum.mjs) gegen [`coverage.json`](../wirtschaft-mittelschule-8/coverage.json) geprüft: `34 verbatim competence rows (16 R, 18 M), 0 not found; both curriculum SHA-256 hashes match.`

| Klassenart | Amtliche Quelle | SHA-256 des Abrufs | Kompetenzerwartungen | Lektionen |
| --- | --- | --- | --- | --- |
| Regelklasse (R8) | [WiB R8](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/wib/regelklasse) | `7637e3263ece0f6b7b5d23a6dbcc63faec048ac0c93fbdfa26fd00a695445d67` | `16` (`6 implemented`, `10 supported`) | `28` |
| Mittlere-Reife-Klasse (M8) | [WiB M8](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/wib/mittlere-reife-klasse) | `2019c423daca265a5b00bb147ad67e0c30e38644cb0c0cd0b61d7577a67d1e12` | `18` (`7 implemented`, `11 supported`) | `29` |

Die Seiten nennen keine Stundenzahlen je Lernbereich; die Stundentafel steht in [BayMSO Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayMSO-ANL_1).

## 2. Lernbereiche und Lektionen

| LB | Lernbereich | Lektionen R8 / M8 | Nur R8 | Nur M8 | Labore |
| --- | --- | --- | --- | --- | --- |
| 1 | Projekt | `3` / `4` | — | `pr-leittext-selbstaendig` (Leittextmethode selbständig) | `projectPlan` |
| 2 | Berufsorientierung | `10` / `9` | `bo-bewerbungsmappe-ausbildung`, `bo-vorstellungsgespraech` | `bo-lebensplan-schullaufbahn` | `careerMatch` |
| 3 | Wirtschaft | `8` / `8` | — | — | `shopGuV`, `circularFlow`, `wageForms`, `netPay` |
| 4 | Recht | `3` / `3` | — | — | `internshipCheck` |
| 5 | Technik | `4` / `5` | — | `te-vor-nachteile-abwaegen` | `noiseProtection`, `productionCompare` |

Unterschiede zwischen den Klassenarten folgen dem Wortlaut: R8 hat zwei Betriebspraktika sowie Bewerbungsmappe und Vorstellungsgespräch; M8 hat ein Praktikum, den Lebensplanentwurf, die Praktikumsbewerbung als eigene Kompetenz, den Aspekt des mittleren Schulabschlusses auf dem Ausbildungsmarkt und das Abwägen von Vor- und Nachteilen des Technikeinsatzes. Projekt und Erkundung sind in R8 „weitgehend selbständig“, in M8 „selbständig“.

Jede Lektion hat zwei Absätze mit Rechenbeispiel, einen Merksatz, einen Schnellcheck mit zwei plausiblen Fehlantworten, eine Fallwerkstatt, ein dreiteiliges SVG-Schaubild und Schreibaufgaben auf zwei Niveaus. 17 Lektionen haben Rechenaufgaben aus Generatoren auf zwei Niveaus (Niveau 1 mit Leitfragen, Niveau 2 Transfer); jede Lektion mit Rechenaufgaben braucht drei selbst gelöste Aufgaben auf Niveau 1 für den Abschluss.

## 3. Unterrichtsbegleitende Kompetenzen (`status: "supported"`)

Was nur im echten Leben geschieht, beansprucht die App nicht: die Projektdurchführung im Team, der Besuch bei der Berufsberatung, die Recherche auf dem lokalen Ausbildungsmarkt, das Führen des eigenen Portfolios, die Betriebspraktika selbst, die Präsentation vor der Klasse, das Rollenspiel zum Vorstellungsgespräch, die Betriebserkundung vor Ort und das Schreiben der eigenen Bewerbung. Die App bereitet diese Tätigkeiten vor (Fragen, Checklisten, Strukturen, Fallbeispiele); `evidence` in `coverage.json` nennt je Zeile, was die App leistet und was im Unterricht bleibt.

## 4. Rechtsgrundlagen und Zahlen, die die Lektionen nennen

Alle Normen wurden am 28. November 2026 auf gesetze-im-internet.de gelesen (Seitentitel und Normtext):

- **Betriebspraktikum:** § 2 JArbSchG (Kind unter 15; vollzeitschulpflichtige Jugendliche wie Kinder), § 5 Abs. 2 Nr. 2 (Praktikum erlaubt; es gelten § 7 Satz 1 Nr. 2 und §§ 9 bis 46), § 7 (7 Std./Tag, 35 Std./Woche), § 11 (30 bzw. 60 Min. Pause, mindestens 15 Min. am Stück), § 12 (Schichtzeit 10 Std.), § 14 (6 bis 20 Uhr), § 15 (fünf Tage), §§ 16, 17, § 22, § 23 (kein Akkord), § 29 (Unterweisung). Die 8-/40-Stunden-Grenze aus § 8 gilt für das Praktikum ausdrücklich nicht.
- **Lohn:** § 1 und § 22 MiLoG (Ausnahmen: Pflichtpraktikum, Jugendliche unter 18 ohne Berufsabschluss, Auszubildende), Mindestlohn 13,90 € seit 1. Januar 2026 laut [BMAS](https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html), § 17 BBiG (Mindestvergütung +18 %, +35 %, +40 %, auf volle Euro gerundet), § 1 TVG, Art. 9 GG.
- **Abgaben:** § 38 EStG, § 3 SolzG 1995 (Freigrenze), § 241 SGB V (14,6 %), § 249 SGB V, § 341 SGB III (2,6 %), § 168 SGB VI (je zur Hälfte), § 150 SGB VII (Unfallversicherung: Arbeitgeber). Renten- und Pflegebeitragssatz und Zusatzbeitrag nennt die App bewusst nicht, weil sie per Verordnung bzw. je Kasse festgesetzt werden (§ 55 SGB XI nennt noch 3,4 %); Rechenaufgaben arbeiten mit ausdrücklich angenommenen Sätzen und einer Lohnsteuer „laut Tabelle“. Die Kirchensteuer erscheint nur als angenommener Satz von 8 % der Lohnsteuer in Beispielen.
- **Arbeitsschutz:** §§ 3, 4, 5, 15 ArbSchG (Gefahren an der Quelle, individuelle Schutzmaßnahmen nachrangig), §§ 6, 8 LärmVibrationsArbSchV (80 und 85 dB(A)), § 2 Abs. 1 Nr. 8 SGB VII (Unfallversicherung von Schülern), § 43 IfSG (Belehrung bei Lebensmitteln).

Das Lärmlabor zieht Dämmwerte vereinfacht ab und sagt das; das Kreislauflabor zeigt nur Haushalte und Unternehmen mit Sparen als Ausblick. Fallbeispiele, Betriebe, Löhne und Tariflöhne sind erfundene Lernmodelle.

## 5. Nachbarklassen

- **WiB 7** ([`wirtschaft-mittelschule-7`](../wirtschaft-mittelschule-7/)) führt Leittextmethode, Berufswahlportfolio, Berufsberatung und Kammern, Ferienjob und Kinderarbeitsverbot ein. WiB 8 setzt darauf auf (Leittextmethode weitgehend selbständig bzw. selbständig, Praktikum statt Ferienjob).
- **WiB 9** ([R9](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/9/wib/regelklasse), [M9](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/9/wib/mittlere-reife-klasse), am 28. November 2026 abgerufen) bringt die Grundfunktion Verwaltung, Geldinstitute, Zahlungsverkehr, Geldanlagen und Kredite, soziale Marktwirtschaft, Berufsausbildungsvertrag und im M-Zug Bewerbungsmappe und Vorstellungsgespräch. Diese Inhalte nimmt WiB 8 nicht vorweg; Bewerbungsmappe und Vorstellungsgespräch stehen deshalb nur im R8-Pfad.
- [`docs/wirtschaft-mittelschule-7-coverage.md`](wirtschaft-mittelschule-7-coverage.md) nannte für WiB 8 zuerst „Berufsausbildungsvertrag, Konsumkredite/Verschuldung, Kaufvertrag/Gewährleistung sowie Globalisierung“. Das ist berichtigt: Die Abgrenzung dort nennt jetzt die Inhalte des Fachlehrplans WiB 8, ordnet Ausbildungsvertrag, Geldinstitute, Kredite und Globalisierung WiB 9 zu und hält fest, dass Kaufvertrag und Gewährleistung weder in WiB 8 noch in WiB 9 vorkommen.

## 6. Bestandsabgleich vorhandener ZAM-Karten

[`replaces-de-by.json`](../wirtschaft-mittelschule-8/replaces-de-by.json) ist `"status": "proposal-only"`, `"approved": null`, mit leeren `sources` und `rows`. In `zam-os/zam` (Stand `c92f4e383385ee487cd8b30f73b3bf3cb27b0860`, `tests/fixtures/curriculum/`) gibt es keine `de-by:mittelschule-*`-Zelle; die Wirtschaftszellen gehören zu Realschule und Gymnasium (u. a. `de-by:realschule-8-wirtschaft-recht-konsum-geld-jugend`, `de-by:realschule-10-wirtschaft-recht-strafrecht-arbeitsrecht-sozialstaat`, `de-by:gymnasium-9-wirtschaft-recht-arbeitsrecht-soziale-marktwirtschaft-konjunktur`) und bleiben dort. [`cell.json`](../wirtschaft-mittelschule-8/cell.json) deklariert `31` neue Atome und `62` neue Karten ohne `replaces` oder `retired_items`.

**Entscheidung (`AGENTS.md` § 6):** Thematisch benachbarte Zellen anderer Schularten, etwa die Arbeitsrecht-Zellen der Realschule 10 und des Gymnasiums 9, bleiben bei ihrer Schulart und werden nicht in `wirtschaft-mittelschule-8` gemappt. Thomas am 28. November 2026 im Gespräch zu PR #225: „Nachbarzellen bleiben bei ihrer Schulart“. Das Mapping bleibt damit ohne Zeilen und braucht keine Freigabe.

## 7. Datenschutz

Lernstand und freie Texte bleiben im `localStorage` (`wib_ms8_academy_progress_v1`). Neben jedem Textfeld erklärt ein kleiner aufklappbarer Hinweis die Speicherung; „Fortschritt zurücksetzen“ löscht Lernstand und Texte. Die App sendet keine Anfragen an Dritte; Quellen sind einfache Links.
