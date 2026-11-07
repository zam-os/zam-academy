# Mathematik 6 Realschule: Lehrplan, Umfang und Kartenabgleich

Stand: 6. November 2026.

## Offizielle Grundlage

Der aktuelle Fachlehrplan [M6](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/mathematik) wurde am 06.11.2026 direkt abgerufen, keine Archivfassung. Die Adressen `/wpfg1` und `/wpfg2-3` führen in Klasse 6 auf die Startseite der Website, weil es nur einen Fachlehrplan für alle Zweige gibt. Daher hat das Paket einen gemeinsamen Lernpfad, keine Zweigauswahl und keine `track`-Angabe in der Zelle.

[source.json](../mathematik-realschule-6/src/curriculum/source.json) speichert Stunden, alle Kompetenzerwartungen und die HTML-Prüfsumme. [coverage.json](../mathematik-realschule-6/coverage.json) ordnet jede der 32 Erwartungen mit konkreter Evidenz zu.

| Lernbereich | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- |
| 1 Rationale Zahlen | ca. 68 | 10 | 19 |
| 2 Achsenspiegelung und Symmetrie | ca. 13 | 5 | 6 |
| 3 Flächeninhalt ebener Figuren | ca. 18 | 4 | 6 |
| 4 Raumgeometrie | ca. 14 | 2 | 4 |
| 5 Terme und Gleichungen | ca. 15 | 7 | 7 |
| 6 Direkte Proportionalität | ca. 12 | 4 | 5 |

Die Vertragstests prüfen die wortgleichen Erwartungen, mindestens eine Lektion je Zeile, jede Lektion in mindestens einer Zeile und die Bindung an den richtigen Lernbereich. Weiche Trennzeichen aus dem HTML wurden entfernt.

## Fachliche Entscheidungen

Nachbarjahrgänge: M5 und M7 wurden gelesen, die Prüfsummen stehen in `source.json`. Ganze Zahlen, Rechengesetze, ggT und kgV, Dreisatz, Größen, Rechteckfläche, Netze und Schrägbilder sind Vorwissen aus M5. Vorgezogen wird nichts aus M7: Prozentrechnung bleibt beim Dreisatz und der Verhältnisgleichung ohne veränderten Grundwert, Äquivalenzumformungen beschränken sich auf a · x = c und x + b = c, und a · x + b = c wird nur durch Probieren und Rückwärtsrechnen gelöst. Die Lektion zum Vieleck nennt einmal 10 % Verschnitt als Zuschlag, das lässt sich mit dem Anteil 1/10 rechnen.

ℕ steht im Paket für {1; 2; 3; …}. Die Lektion zu den Grundmengen schreibt die Menge aus, damit klar ist, dass die 0 hier nicht dazugehört. Eine Lehrkraft sollte prüfen, ob das zur Schreibweise im Unterricht passt.

Das Labor zu besonderen Figuren benennt gleichseitige Dreiecke nicht, weil Grundseite und Höhe auf dem Reglerraster nie genau dazu passen. Sie stehen im Labor zu den Symmetrieachsen als eigene Figur.

## Grenzen

Die App kann Konstruktionen mit Zirkel und Lineal nur zeigen. Ausführen müssen Lernende sie auf Papier oder in einer Geometriesoftware, bewertet wird das nicht. Dasselbe gilt für das eigene Arbeiten in GeoGebra und für freie Begründungen; die Transferkarten in ZAM fragen sie als Abruf ab. Erklärvideos sind ein eigener späterer Schritt (Entscheidung vom 22.10.2026). Eine Lehrkraft hat die Inhalte noch nicht geprüft.

## Kartenabgleich

Quelle sind die zwei `de-by`-Zellen in zam-os/zam (Commit `f57e6740854a2f91f985b59b9e101b388186d3bc`), bytegleich unter `mathematik-realschule-6/tests/fixtures/` mit SHA-256 in [replaces-de-by.json](../mathematik-realschule-6/replaces-de-by.json). Die Zuordnung ist ein Vorschlag (`approved: null`, `status: proposal-only`). Die Zelle deklariert weder `replaces` noch `retired_items`.

| Kategorie | Anzahl | Bedeutung |
| --- | --- | --- |
| A | 6 | Gleicher Einzelabruf, ein Nachfolger soll die Historie übernehmen |
| B | 0 | Kein mehrteiliger Altabruf wird als Ganzes übernommen |
| C | 10 | Keine Übertragung, die Karte bleibt aktiv |

A-Zeilen:

| Alte Karte | Nachfolger | Abruf |
| --- | --- | --- |
| `01K4M6B0000000000000000J01` | `m6-erweitern-wert` | Wert beim Erweitern |
| `01K4M6B0000000000000000J03` | `m6-gleichnamig-addieren` | Gleichnamige Brüche addieren |
| `01K4M6B0000000000000000J05` | `m6-durch-bruch` | Durch einen Bruch dividieren |
| `01K4M6B0000000000000000J07` | `m6-endlich-nenner` | Endliche Dezimalzahl: Primfaktoren 2 und 5 |
| `01K4M6F0000000000000000J01` | `m6-dreieck-formel` | Dreiecksformel |
| `01K4M6F0000000000000000J05` | `m6-liter-cm3` | 1 l = 1000 cm³ |

Von den C-Zeilen sind sechs mehrteilige Karten, die zu keinem einzelnen Nachfolger passen. Die Quader-Karte zu Ecken und Kanten und der Schrägbildteil gehören zu M5. Die zwei Karten zu relativer Häufigkeit und Laplace stehen nicht im Fachlehrplan M6 der Realschule, sie bleiben aktiv und sollten in `zam-os/zam` eigens geprüft werden.

`scripts/validate-migration.mjs` prüft in Wegwerf-Bibliotheken: Die ausgelieferte Zelle lässt alle 16 Karten aktiv und ändert keine FSRS-Felder oder Reviews. Die Vorschlagsfassung nur im Arbeitsspeicher überträgt sechs Historien unverändert. Wiederholte Installationen ändern nichts, und wer beide Karten besitzt, bekommt eine Ablehnung statt einer automatischen Zusammenführung.
