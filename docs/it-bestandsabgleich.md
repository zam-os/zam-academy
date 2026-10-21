# Algorithmen und Datennetze: Lehrplanabgleich und Lernstandsübernahme

Stand: 21. Oktober 2026. Beide Academy-Pakete werden gemeinsam veröffentlicht.
Thomas hat die konkreten acht Zuordnungen am 21.10.2026 nach dem Review von
zam-os/zam-academy#18 freigegeben, einschließlich J04 als B und J07 als A.
Beide Mappingdateien tragen dieses Freigabedatum.

## Fachlicher Umfang

Maßgeblich ist der [Fachlehrplan Informationstechnologie der Realschule
Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/it).
Die Module werden schulabhängig über die Jahrgangsstufen 5–10 verteilt. Die
Ziffer 9 in der alten Zellenkennung belegt keine allgemeine Zuordnung zu Klasse 9
oder Wahlpflichtfächergruppe I.

- **Algorithmen und Programmieren**: IT 2.6.1 „Modellieren und Codieren von
  Algorithmen“, ca. 14 Unterrichtsstunden; 20 Lektionen und 40 Karten. Modelle in Quellcode umsetzen,
  Variablen und Datentypen, Funktionen sowie systematische Fehlersuche.
  [Abdeckungsmatrix](../algorithmen/coverage.json).
- **Datennetze und Internet**: IT 2.5.1 „Datennetze I“, ca. 14
  Unterrichtsstunden; 18 Kernlektionen, eine HTTPS-Ergänzung und 38 Karten.
  Komponenten und Medien, Adressen und Subnetze, DHCP und
  DNS, Protokolle und Kommunikationsablauf. HTTPS ist eine gekennzeichnete
  Ergänzung aus IT 2.5.2; dessen gesellschaftliche, rechtliche und ethische
  Kompetenzen sind damit nicht vollständig abgedeckt.
  [Abdeckungsmatrix](../datennetze/coverage.json).

Beide Angebote sind Übungsumgebungen. Sie ersetzen weder sämtliche Module des
IT-Fachs noch die Arbeit in einer vollständigen Entwicklungsumgebung oder an
einem realen Netzwerk. Die Karten stehen ausschließlich in den jeweiligen
`cell.json`-Dateien und verlinken die zugehörigen Lektionen.

Beide Apps bieten den vollständigen Lernpfad auf Deutsch und Englisch an,
einschließlich Aufgaben, Hilfen und Rückmeldungen. Die englische Fassung eignet
sich damit auch als Auffrischung für Kollegen. Ein Sprachwechsel verwendet die
gleichen Lektionsanker und denselben Übungsfortschritt. Ein englischer Link
ergänzt den Anker um `&lang=en`, beispielsweise
`/algorithmen/#lesson=algo-while&lang=en` oder
`/datennetze/#lesson=net-dns&lang=en`.

Wie bei den zweisprachigen Apps SQL und UML bleiben die ZAM-Karten deutsch.
Die englische App-Fassung ändert weder Karten-IDs noch die nachfolgende
Lernstandszuordnung.

## Acht Altkarten, genau eine Entscheidung je Karte

Quelle ist `de-by:realschule-9-informatik-algorithmen-strukturen`, Version
`2026.08.1`. Die unveränderte Datei liegt unter
[`tests/fixtures/de-by-realschule-9-informatik-algorithmen-strukturen-kvt.json`](../tests/fixtures/de-by-realschule-9-informatik-algorithmen-strukturen-kvt.json).
SHA-256: `7eb4b02d35be4d8561e41ec4057f41813f9b0ba3ff212dcd789de0d0820e2805`.
Die vollständigen Originalfragen und Begründungen stehen in
[`algorithmen/replaces-de-by.json`](../algorithmen/replaces-de-by.json) und
[`datennetze/replaces-de-by.json`](../datennetze/replaces-de-by.json).

| Alte ID (Endung) | Bisheriger Abruf | Zuordnung | Behandlung |
| --- | --- | --- | --- |
| J01 | Eindeutigkeit | A → Algorithmen | Sicher gleicher Einzelabruf |
| J02 | Algorithmus, vier Eigenschaften, Struktogramm | C | Endliche Beschreibung und Terminierung fachlich trennen; neue Fragen beginnen ohne übernommenen Lernstand |
| J03 | WHILE mit anfangs falscher Bedingung | A → Algorithmen | Sicher gleicher Einzelabruf |
| J04 | Sequenz, Verzweigung, FOR-Zählschleife, WHILE, DO-WHILE | B → Algorithmen | Gesamter bisheriger Vergleich bleibt auf einer Synthesekarte erhalten |
| J05 | Boolescher Datentyp | A → Algorithmen | Sicher gleicher Einzelabruf |
| J06 | Variable, vier Datentypen und Zuweisung | C | Sprachabhängige Typen und JavaScript-Bindungen korrekt erklären; keine Übertragung auf korrigierte oder einzelne Teilfragen |
| J07 | DNS-Namensauflösung | A → Datennetze | Sicher gleicher Einzelabruf |
| J08 | Client/Server, IP, DNS, TCP/IP und HTTPS | C | TCP verspricht keine absolut fehlerfreie Übertragung; Gesamtabruf wird korrigiert und aufgeteilt |

**Freigegeben: 4 A, 1 B, 3 C.** Eine A- oder B-Zuordnung hat genau einen
Nachfolger, dessen `replaces` die alte Karten-ID nennt. Kategorie C verwendet
`retired_items`: Die alte Karte und ihre Reviews bleiben auf der bisherigen ID
erhalten und verlassen die aktive Wiederholung. Neue Teilfragen erhalten keine
abgeleitete Beherrschung. Die vollständigen IDs stehen in den Mappingdateien;
die Endungen in dieser Tabelle sind nur eine Lesehilfe.

## Prüfung mit veröffentlichtem ZAM-Kern

`scripts/validate-it-migration.mjs` verwendet ausschließlich temporäre
Bibliotheken und den gleichen veröffentlichten `zam-core` wie die Academy-CI.
Es prüft insbesondere die Aufteilung in zwei Zellen statt nur einen Nachfolger:

- Alle acht Original-IDs sind genau einmal zugeordnet; Quellprüfsumme,
  Originalfragen, Mapping und Deklarationen in den Zellen stimmen überein.
- Beide Installationsreihenfolgen erhalten Karten, vollständige FSRS-Zustände
  und alle Review-Ereignisse. Erneutes Installieren bleibt unverändert.
- Eine Person kann alle, nur die Algorithmen-, nur die Netzwerkkarten oder keine
  Altkarte besitzen; es entstehen keine zusätzlichen persönlichen Karten.
- Bei eigenen Reviews auf alter und neuer Karte verweigert der Kern eine
  automatische Zusammenführung. Beide getrennten Bibliotheksthemen behalten
  ihre jeweiligen Quellenlinks.

Aufruf: `ZAM_CORE=<Datei-URL des veröffentlichten dist/index.js> node
scripts/validate-it-migration.mjs`. Die Prüfung benötigt keine Freigabe und
öffnet keine persönliche Bibliothek. Katalogbau und Pages-Prüfung verweigern
die Veröffentlichung von Lernstandsänderungen, solange eine der beiden
Freigaben fehlt.

Am 21.10.2026 mit den tatsächlichen beiden Zellen und `zam-core@0.54.0`
bestanden: acht Varianten (zwei Reihenfolgen, jeweils vier Bestandsumfänge)
sowie alle fünf Kollisionsfälle. Im vollständigen Altbestand bleiben alle
acht Karten und 16 Review-Ereignisse erhalten. Zusätzlich lassen sich alle elf
Academy-Zellen einschließlich der 78 neuen IT-Karten mit diesem veröffentlichten
Kern installieren.

Die App-Prüfungen bestehen mit 90 Tests für Algorithmen und 128 für Datennetze.
Beide Produktionsbuilds einschließlich Typprüfung und beide Offline-Zips sind
erfolgreich; die HTML-Datei im jeweiligen Zip stimmt bytegenau mit dem Build
überein und benötigt keine externen Skripte oder Stylesheets. Im Browser geprüft
wurden unter anderem mehrere Code-Testfälle, gespeicherter und unmittelbar
aktualisierter Fortschritt, Ablaufspur und Haltepunkte, der DNS-Reparaturauftrag
von der Lektion bis zum erfolgreichen Webaufruf sowie die Subnetz- und
Datenratenwerkzeuge. Zusätzlich sind alle 39 Lektionen in beiden Sprachen,
lokalisierte Laufzeitfehler und Protokollspuren, englische Direktlinks sowie
Sprachwechsel mit erhaltenem Fortschritt, getrennten Codeentwürfen und noch
nicht abgesendeten Laboreingaben geprüft. Die zwölf bestehenden
Katalog-Schutztests bestehen; mit beiden Freigaben baut der reale Katalog alle
elf Zellen.

## Anschließende ZAM-Integration

1. Erledigt: Die acht konkreten Zuordnungen sind am 21.10.2026 freigegeben;
   beide Mappingdateien dokumentieren Freigabedatum und Quelle.
2. Beide Pakete gemeinsam in Academy veröffentlichen. Beide Zellen müssen im
   gleichen Katalogstand verfügbar sein, bevor die alte Zelle abgelöst wird.
3. In ZAM beide Zellen gezielt mit `npm run academy:sync` übernehmen. Die
   gebündelten Academy-Kopien nicht von Hand bearbeiten.
4. Erst mit beiden Nachfolgern die alte IT-Zelle aus dem aktiven Bundle
   entfernen, das eingefrorene Fixture für Integrationstests erhalten und die
   Erwartungen für die verbleibenden Klasse-9-Zellen aktualisieren.
5. Auffinden, Importvorrang und Aufnahme über den tatsächlichen IT-Lehrplanpfad
   testen. Die offizielle Fachkennung ist `it`; keine neue pauschale Bindung an
   `informatik`, Jahrgang 9 oder Zweig I ergänzen. Das ZAM-Manifest führt aktuell
   die übergeordneten Lernbereiche; die Modulabdeckung muss beim Import als
   Teilabdeckung erkennbar bleiben.
6. Die Migration zusätzlich durch ZAMs tatsächlichen Installationseinstieg,
   wiederholte Aufnahme, gefüllte Wiederholungswarteschlange und Kollisionsfälle
   prüfen; erst danach mit den vorgeschriebenen Gesamtprüfungen ausliefern.

Dieser Academy-Änderungsstand verändert keine persönliche Bibliothek; die alte
aktive Zelle wird erst in ZAM mit beiden Nachfolgern entfernt.
