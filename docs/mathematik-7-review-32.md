# Mathematik 7: Nachbesserungen zu PR 32

Stand: 23.10.2026. Grundlage sind die beiden Reviews von Josefczak in [PR 32](https://github.com/zam-os/zam-academy/pull/32), abgegeben um 15:17 und 15:32 UTC. Die Lehrervideos bleiben im getrennten Entwurf [PR 34](https://github.com/zam-os/zam-academy/pull/34).

## Fachliche und didaktische Korrekturen

| Reviewpunkt | Änderung und Nachweis |
| --- | --- |
| SsW-Beispiel konstruiert um den gesuchten Punkt B | Festes AC = 6 cm; Kreis um C mit Radius a = 4 cm schneidet den 30°-Schenkel in B₁/B₂. Eine unabhängige Schnittpunktrechnung in `tests/review-regressions.test.ts` prüft beide positiven Lösungen und BC = 4 cm. Das andere, korrekte Setup des Labors bleibt erhalten. |
| Strenge Budgetgrenze wird mit ≤ erklärt | Der Hinweis unterscheidet ≤ und <. Die Lösung zeigt Kosten bei der maximal erlaubten Anzahl und beim ausgeschlossenen Nachbarn. Der Regressionstest zählt die zulässigen ganzen Anzahlen unabhängig auf beiden Stufen durch und prüft, dass der nächste Wert abgelehnt wird. |
| Auswahl durch Länge und erste Position erkennbar | Die benannten Kongruenz-, Raum-, Thales-, Mittelpunkt-, Proportionalitäts- und Diagrammaufgaben haben plausible, ähnlich ausführliche Alternativen. Die App mischt jede erzeugte Auswahl mit ihrem Aufgaben-Zufallsstrom und verschiebt den Lösungsschlüssel mit. Tests prüfen Lösbarkeit, unveränderte Ausgangsaufgabe, reproduzierbare Reihenfolge und alle drei Positionen. Ein zusätzlicher Test prüft die bisherige Quiz-Mischung für alle 42 Lektionen und die vorkommenden Positionen 0–3 (einige Quizzes haben vier Optionen). |
| Oder-Aufgaben immer positiv | Beide Abstände variieren über und unter dem Radius. Der Regressionstest erreicht alle acht Kombinationen aus zwei Wahrheitswerten und und/oder, einschließlich „oder: nein“, und prüft den Lösungstext. |
| Gemeinsamer Wert bei Gleichungen fehlt im Lösungsweg | Die letzte Zeile zeigt x und den gemeinsamen Seitenwert mit Einsetzung. Der Test setzt die Lösung unabhängig in beide ursprünglichen Seiten ein. |
| Algebra-Schreibweise | `linear`, `term`, `sum` und `paren` formatieren Gleichungen, Ungleichungen, Schwerpunkt-Koordinaten und Algebra-Labore ohne `+ (−…)` oder `1x`. |
| Erwartungswertrechnung außerhalb M7 | Das Stichprobenlabor und `gruppenanteile` berechnen jetzt den tatsächlichen Anteil der befragten Gruppe A und vergleichen ihn mit 50 % in der Schule. Gleichmäßige Anteile allein garantieren weiterhin keine repräsentative Auswahl. Keine gewichtete Erwartungswertrechnung. |
| Fehlende Lehrplanbegriffe | Schrägbildachse als unverzerrte Bezugslinie AB, Verzerrungswinkel ω und Verzerrungsmaßstab q sind ausdrücklich erläutert. Die verkürzte Tiefenrichtung ist von der Schrägbildachse getrennt. |
| Lehrplan-Labels und Katalog | Jede Lektion und Etappe nennt LB, Zweig und Thema im selben Format. Der Katalog nutzt die offiziellen Lernbereichsnamen; die README verlinkt die nach dem Merge veröffentlichte App und sortiert die Entwicklungsports. |
| Kleine Textfehler | Grundkantenmitte statt Kantenmitte, ausgeschriebene Breite/Tiefe/Höhe statt mehrdeutiger Maßketten; sachfremde Farb-Antwort beim SsW-Satz entfernt. |

Zur Schrägbildachse wurden die Unterrichtsunterlagen der [Staatlichen Realschule Geisenfeld](https://www.rs-geisenfeld.de/wp-content/uploads/2018/01/schraegbilder_92.pdf) und die [Grundlegenden Inhalte der Realschule Karlstadt, M7 I](https://www.realschule-karlstadt.org/images/Fachschaft_Mathematik/RS_M_07_I_M_Grundlegende_Inhalte.pdf) gegengelesen: AB ist die unverzerrte Grundlinie; die dazu senkrechten Grundflächenkanten werden verkürzt und unter ω gezeichnet.

## Tests und Belegmatrix

Die leeren Schleifen zu `lab.actions` und `anyOrder` wurden aus den Pakettests entfernt. Die allgemeinen Funktionen der übernommenen App-Schale bleiben verfügbar, werden aber nicht als Abdeckung einer M7-Lektion ausgegeben. Die Evidenztexte zu den einzelnen Potenz-Kompetenzen sowie zu Schrägbildern und Stichproben nennen nun die jeweils passenden Aufgaben und Labore.

`tests/checker.test.ts` ergänzt Dezimalkomma, Brüche, Einheiten, Vorzeichen, vertauschte Felder, genaue Ganzzahlen, Rundungstoleranz und fachliche Fehlhinweise auf Stufe 2. Die numerische Gegenprobe akzeptiert 7,2 für √52, lehnt aber 7,3 ab; das ist ein Checker-Test, kein vorgezogener Wurzel-Unterricht. Ein eigener M7-Wurzel-Hinweis wäre deshalb unpassend. Die Kreisentscheidung verwendet den tatsächlichen Abstand, auch wenn Innen-/Außenwerte gleich gerundet angezeigt werden.

Ausgeführt im Paket: `npm ci --offline --cache /private/tmp/zam-mathe7-npm-cache --no-audit --no-fund`, `npm run typecheck`, `npm test` (**63 Tests in sechs Dateien**), `npm run build` und `npm run package:zip`. Der Aufgabenstrom-Test prüft weiterhin 80 Aufgaben je Lektion und Stufe, insgesamt 6720. Die Labortests prüfen alle 126 Zielzeugen, Reglergitter, Startzustände und Ziehpunkte.

Am Stamm: `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs` (**28 Tests**), `node scripts/build-catalog.mjs /private/tmp/zam-mathe7-review-catalog.json` (**16 Zellen**) sowie `scripts/validate-cells.mjs` und `mathematik-realschule-7/scripts/validate-migration.mjs` mit veröffentlichtem `zam-core@0.54.0`. Alle Zellen und ihre kuratierten Distraktoren bestehen; die 126 M7-Karten und 252 Distraktoren sind unverändert. Typprüfung, Paketformatierung und Fehler-Lint der geänderten TS/MJS-Dateien bestehen.

Die gebaute App wurde über `http://127.0.0.1:5195/` geprüft: alle 42 Lektionen auf beiden Stufen in Hell/Dunkel, jeweils Labor am Start; zusätzlich Lernpfad, II/III-Filter, Formelsammlung und die korrigierten Budget-/Gleichungs-/Diagrammhinweise. Lokale Screenshots und DOM-Protokolle liegen unter `/private/tmp/zam-mathe7-review-qa`.

## Alte Karten: ausschließlich ein unfreigegebener Vorschlag

`approved: null` und `status: proposal-only` bleiben bestehen. `cell.json` enthält weiterhin weder `replaces` noch `retired_items`. **Die tatsächlich ausgelieferte Fassung erhält alle 30 alten Karten samt Historien aktiv.**

Die vorgeschlagene spätere Fassung hat A:7, B:0, C:23. Davon bleiben 22 C-Karten aktiv; für `01K4M7K0000000000000000J02` wird die Stilllegung ohne Übertragung vorgeschlagen, weil die alte Musterlösung den kürzeren SsW-Fall pauschal als zweifach lösbar behandelt. Ihre Karte und Reviews sollen unter derselben alten ID erhalten bleiben und lediglich die aktive Queue verlassen. Thomas muss die sieben Übertragungen und diese Stilllegung ausdrücklich freigeben. Die nicht für M7 verwendeten alten Zins-Karten zur 30/360-Methode und zum Dispo bleiben bewusst aktiv: ein anderer curricularer Platz ist kein Grund, persönliche Lernbelege zu entfernen. Auch diese Behandlung steht zur Prüfung im Vorschlag.

Die 30 `de_by_question`-Felder spiegeln nun die ursprünglichen Fragen exakt; fünf segmentierte Originalfragen bleiben vollständige Segmentarrays einschließlich TeX und `speech`. Der Migrationsprüfer gleicht jedes Feld mit dem gehashten Fixture ab.

Die Wegwerfdatenbanken prüfen jetzt auch `tokens` und `practice_item_replacements`. Die tatsächliche Fassung ist einschließlich aller Tokenfelder bei Wiederinstallation unverändert. Die Simulation der sieben Ersetzungen bewahrt sämtliche FSRS- und Reviewfelder; nach zusätzlicher Stilllegung sind 22 alte Karten aktiv, die acht übrigen Historien bleiben erhalten. Beim Doppelbesitz prüft der Test die exakte Fehlermeldung samt altem/neuem Item und Nutzer sowie das vollständige Zurückrollen von Tokens, Ersetzungsdeklarationen, Karten und Reviews.

**Bekannte Einschränkung der veröffentlichten Kernversion:** zam-core 0.54.0 setzt bei jedem `retired_items`-Durchlauf `tokens.updated_at` neu, auch wenn die Karte schon stillgelegt ist. Die Probe erlaubt ausschließlich diesen Zeitstempel an genau der vorgeschlagenen C-Karte und prüft alle anderen Felder streng unverändert. Das ist keine vollständige Byte-Idempotenz dieser späteren Stilllegungsfassung und muss vor deren Anwendung geklärt werden. Die aktuelle Fassung ohne Historienänderungen ist davon nicht betroffen. Es wurde weder ZAM-Code geändert noch eine Freigabe vorweggenommen.
