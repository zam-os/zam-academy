# Mathematik 7 Realschule: Lehrplan, Umfang und Nachweise

Stand: 23. Oktober 2026. Der vollständige lokale Ausbau umfasst 42 Lektionen für Zweig I und 31 für II/III mit insgesamt 42 Atomen und 126 Karten. Branch `codex/mathematik-realschule-7`, Basis Academy `8740026` (einschließlich PR 23). Noch keine Veröffentlichung.

## Offizielle Grundlage

Die aktuellen Fachlehrpläne [M7 I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/mathematik/wpfg1) und [M7 II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/mathematik/wpfg2-3) wurden am 23.10.2026 direkt abgerufen, keine Archivfassung. [source.json](../mathematik-realschule-7/src/curriculum/source.json) speichert Stunden, alle Kompetenzerwartungen und die HTML-Prüfsummen; [coverage.json](../mathematik-realschule-7/coverage.json) ordnet jede der 62 Erwartungen mit konkreter Evidenz zu.

| Inhalt | I: LB / Stunden / Erwartungen | II/III: LB / Stunden / Erwartungen | Lektionen I / II/III |
| --- | --- | --- | --- |
| Potenzen | 1 / 10 / 3 | 1 / 10 / 3 | 5 / 5 |
| Parallelverschiebung | 2 / 23 / 7 | 2 / 21 / 7 | 8 / 6 |
| Dreiecke | 3 / 14 / 4 | Folgejahrgang | 4 / – |
| Raumgeometrie | 4 / 10 / 3 | kein eigener M7-LB | 3 / – |
| Ortslinien und Ortsbereiche | 5 / 12 / 5 | 3 / 10 / 4 | 8 / 6 |
| Terme, Gleichungen und Ungleichungen | 6 / 22 / 4 | 4 / 22 / 4 | 5 / 5 |
| Proportionalitäten | 7 / 12 / 5 | 5 / 12 / 5 | 5 / 5 |
| Auswertung von Daten | 8 / 9 / 4 | 6 / 9 / 4 | 4 / 4 |

Die Lehrplan-/Vertragstests prüfen die wortgleichen 35 Erwartungen in I und 27 in II/III, mindestens eine passende Lektion je Zeile, jeden Lektionseintrag und die Bindung an den richtigen Zweig/LB. I erhält zusätzlich Vektoraddition, allgemeine Vielecke, Dreieckskonstruktion/Kongruenzbeweise, Raumgeometrie, Tangentenkonstruktion vom äußeren Punkt und Schwerpunkt. Navigation und sichtbare Nummerierung berücksichtigen die Auswahl; Kartenlinks behalten ihre Kennungen.

## Fachliche Entscheidungen

M6 und beide M8-Fachlehrpläne wurden als Nachbarjahrgänge geprüft; Quellen und Prüfsummen stehen ebenfalls in `source.json`. Rationale Zahlen, Vorzeichenregeln und Spiegelungen sind Vorwissen. Komplexere Summenterme, binomische Formeln und quadratische Extremwerte bleiben im Folgejahrgang. Potenzen beschränken sich auf ganzzahlige Exponenten und Größen; keine Potenzfunktionen oder rationalen Exponenten.

Dreiecke behandeln Existenzbedingungen samt Seiten-Winkel-Ordnung, SSS/SWS/WSW und das bedingte SsW. Der Sonderfall eines Winkels gegenüber der kürzeren Seite wird nicht pauschal als eindeutig oder als immer zweifach behauptet. Beweise verwenden explizite Voraussetzungen und entsprechende Größen.

Raumgeometrie nutzt Lagebeziehungen, Projektionswinkel, Normalschnitt, Schrägbildachse, Verzerrungswinkel und Verkürzungsfaktor. Wahre Längen und Winkel werden über unverzerrte Hilfsfiguren konstruiert und gemessen. Interne Zeichenrechnung ist kein Unterricht zu Pythagoras oder Trigonometrie. Freie Handkonstruktionen und Messgenauigkeit werden nicht automatisch bewertet; das Paket fordert die praktische Ausführung auf Papier oder in Geometriesoftware auf.

Ortsbereiche unterscheiden Kreisrand, Halbebene, Abstandsband, strenge und geschlossene Grenzen sowie Schnitt/Vereinigung. Algebra umfasst Definitionsbedingungen beim Kürzen, leere/volle Lösungsmenge, negative Division, Intervall- und Mengenschreibweise über ℚ und ganzzahlige Sachgrenzen. Prozentrechnung verwendet wechselnde Grundwerte und Rückwärtsrechnung; Zinsen beziehen sich ausdrücklich auf ein Anlagejahr. Bei Stichproben unterscheidet das Modell Erwartungswert, zufällige Schwankung und Auswahlverzerrung. Videos bleiben gemäß Paketstandard ein separater Folgeschritt.

## Alte Karten und Historien

Vier bytegleich gesicherte Zellen aus ZAM `3ff6ee18389b6b2ac602a7265a2ecd695f395107` enthalten 30 alte Items. [replaces-de-by.json](../mathematik-realschule-7/replaces-de-by.json) dokumentiert jedes Item mit Frage, Herkunft und Einzelbegründung.

| Kategorie | Anzahl | Bedeutung dieses Entwurfs |
| --- | --- | --- |
| A | 7 | identischer Einzelabruf als vorgeschlagener Nachfolger |
| B | 0 | keine vollständige alte Mehrfachfrage auf einem eigenen Nachfolger erhalten |
| C | 23 | geteilter, abweichender oder außerhalb des M7-Nachweises liegender Abruf; alte Karte bleibt aktiv |

Die A-Vorschläge betreffen Nebenwinkelsumme, Dreieckswinkelsumme, SsW-Bedingung, Umkreismittelpunkt, denselben Verbindungsvektor A(2|1) nach B(7|4), Faktor 0,8 bei 20 % Rabatt und Kapital als Grundwert. Es gibt keine Freigabe: `approved` bleibt `null`; in `cell.json` fehlen `replaces` und `retired_items`.

`validate-migration.mjs` verwendet nur Wegwerfdatenbanken. Die tatsächliche Zelle bewahrt 30 vollständige FSRS-Stände und 60 Reviewereignisse, lässt alle alten Karten aktiv und legt 126 neue Karten ohne Beherrschung an. Eine getrennte Simulation fügt nur im Arbeitsspeicher die sieben vorgeschlagenen Ersetzungen hinzu: alle Evidenzfelder bleiben erhalten, sieben alte IDs verlassen die aktive Queue, 23 bleiben aktiv. Wiederholtes Installieren/Einschreiben ist idempotent; vorhandene Historien auf altem und neuem Item führen zur Ablehnung statt zu einer automatischen Verschmelzung. Das ist eine technische Probe, keine Zuordnungsfreigabe.

## Verifikation

Im Paket: `npm ci`, `npm run typecheck`, `npm test` (49 Tests), `npm run build`, `npm run package:zip`. Am Stamm: `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs` (28 Tests), Zellen-/Distraktorenprüfung und Historienprobe mit dem in CI festgelegten veröffentlichten `zam-core@0.54.0`.

Die Laborprüfungen verwenden die Reglergitter der Mathematik-Referenz, alle 126 Zielzeugen und Zeigerpositionen. Sie erkennen auch unerlaubte Startziele und unendliche/ungültige Ausgaben. 80 Aufgaben pro Lektion und Stufe werden mit Punkt und Komma eingelesen: 6720 erzeugte Aufgaben. Zusätzliche mathematische Gegenproben rekonstruieren Seiten/Winkel, prüfen Um-/Inkreis und Tangenten geometrisch, setzen Gleichungslösungen ein, testen beide Nachbarn von Sachgrenzen und rechnen Preis-, Zins-, Produkt- und Datenbeispiele unabhängig nach.

Browserprüfung der gebauten Einzeldatei über die lokale Vorschau: 42 Lektionen jeweils in Hell und Dunkel, Laborzeichnung, sichtbare Aufgaben beider Stufen, keine leeren SVGs, keine ungültigen Ausgaben oder horizontalen Überläufe. Zusätzlich gefilterter II/III-Pfad mit 31 Lektionen/sechs Etappen, fortlaufende Nummerierung, Überspringen der I-Inhalte sowie Formelsammlung. Die Offline-Datei enthält alle Ressourcen eingebettet; zum Start ist kein Server nötig. Screenshots und DOM-Protokoll der lokalen Prüfung liegen während dieser Arbeit unter `/private/tmp/zam-mathe7-qa`.
