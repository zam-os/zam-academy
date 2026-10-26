# Biologie 8: neuer Academy-Kurs und vorhandener Bestand

Stand: 26. Oktober 2026. Maßgeblich ist [LehrplanPLUS Biologie 8 Realschule](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/biologie). Die [Abdeckungsmatrix](../biologie-realschule-8/coverage.json) führt alle 46 Kompetenzerwartungen im offiziellen Wortlaut, konkrete Lektions- und Aufgabenbezüge sowie die zusätzlich nötige Praxis auf.

| Bestand | Verhältnis zum neuen Kurs | Umgang |
| --- | --- | --- |
| `de-by:realschule-8-biologie-atmung-blutkreislauf` | Blut und Abwehr überschneiden sich teilweise mit Lernbereich 3. Atmung und Kreislauf sind keine Grundlage für die gesamte neue Jahrgangsabdeckung. | Keine Zuordnung von Beherrschung, kein Austausch und keine Stilllegung. |
| `de-by:realschule-8-biologie-ernaehrung-verdauung` | Ernährung und Verdauung bilden den aktuellen Biologie-8-Lehrplan mit Mikroorganismen, Abwehr, Entwicklung und Evolution nicht ab. | Bleibt unberührt; keine Übertragung auf neue Fragen. |
| Biologie 10: fünf optionale Evolutionseinheiten aus Klasse 8 | Die eigenen Academy-Erklärungen werden teilweise wiederverwendet. Die neuen Fragen und ihre Jahrgangsbindung sind ein eigener Kursvertrag. | Keine Änderung der veröffentlichten IDs, Quellenanker, Karten oder Reviews des Zehnerkurses. |

Die neue Zelle heißt `zam-academy:biologie-realschule-8` und besitzt 30 neue Atome sowie 60 neue Item-IDs. Sie enthält weder `replaces` noch `retired_items`; es wird kein Mapping anhand von Slugs, Fragen oder Ähnlichkeit entschieden. Bestehende Evolutionseinheiten können daher weiterhin parallel vorhanden sein. Eine künftige Konsolidierung wäre eine eigene, ausdrücklich zu prüfende Zuordnung.

Der Installationstest hält die beiden alten Pakete als unveränderte Fixtures vor, erzeugt für ihre 16 Items persönliche Karten mit je zwei echten Ratings und vergleicht anschließend alle Kartenfelder und alle 32 Reviews. Zweifache Installation der neuen Zelle verändert diese Daten nicht und erzeugt keine neuen persönlichen Karten. Erst die ausdrücklich im Test ausgeführte Aufnahme legt 60 neue Karten mit null Wiederholungen und null Stabilität an. Wiederholung beider Schritte erzeugt keine Duplikate.

Der Kurs wird im Academy-Repository gepflegt. Gebündelte Zellen in `zam-os/zam`, die persönliche Bibliothek und bestehende Lernstände werden durch die Kursautorschaft nicht geändert. Ein Merge in den Academy-Hauptzweig veröffentlicht Kurs und Zelle gemeinsam über Pages, Atlas und Katalog. Die Synchronisierung der gebündelten Zellen und deren Auslieferung mit einem ZAM-Release folgen gesondert; die Aufnahme persönlicher Karten bleibt eine Handlung der Lernenden.

## Zeilenweiser Vorschlag

`biologie-realschule-8/replaces-de-by.json` erfasst alle 16 Altfragen mit Herkunfts-Commit und SHA-256 der LF-Fixtures. **1 A, 0 B, 15 C** sind ein Vorschlag (`status: proposal-only`, `approved: null`): Der einzelne Sauerstofftransport-Abruf könnte später genau `b8-blut-check` zugeordnet werden. Alle anderen Abrufe sind außerhalb des Kurses, mehrteilig oder nicht sicher identisch. Die erste Kursfassung setzt keinen dieser Vorschläge um und enthält keine Stilllegungen. Eine spätere Konsolidierung braucht Thomas' ausdrückliche Freigabe.
