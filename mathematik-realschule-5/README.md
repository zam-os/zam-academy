# Mathematik 5 Realschule

LehrplanPLUS Bayern, ein Fachlehrplan für alle Schülerinnen und Schüler: **52 Lektionen**, **156 ZAM-Karten**. Jeder Lernbereich hat einen eigenen Akzent und jede Lektion Erklärung, Beispiel, Merksatz, Schnellcheck, ein veränderbares Labor mit drei Aufträgen sowie mindestens zwei Aufgabengeneratoren auf zwei Stufen.

| Lernbereich | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- |
| LB 1 Natürliche Zahlen | 50 | 12 | 18 |
| LB 2 Ganze Zahlen | 20 | 5 | 6 |
| LB 3 Geometrische Grundvorstellungen und Grundbegriffe | 30 | 6 | 12 |
| LB 4 Größen | 20 | 6 | 7 |
| LB 5 Umfang und Flächeninhalt ebener Figuren | 15 | 6 | 6 |
| LB 6 Auswertung von Daten | 5 | 3 | 3 |

Wahlpflichtfächergruppen beginnen erst in Jahrgangsstufe 7. Darum gibt es hier keine Zweigauswahl, und die Atome der Zelle tragen keinen `track`.

Ein Abschluss verlangt Schnellcheck, alle drei Laboraufträge und je drei richtige Aufgaben auf **beiden** Stufen. Fortschritt bleibt lokal im Browser. Zeichnen, Messen, Falten und Spannen am Geobrett übst du auf Papier und mit echtem Material; die App erläutert und überprüft die zugehörigen Begriffe und Rechnungen. Lehrervideos folgen nach dem Paketstandard als eigener Schritt, darum verlinkt dieses Paket noch keine.

## Lehrplan und Nachbarjahrgänge

Der aktuelle offizielle [Fachlehrplan M5](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/mathematik) wurde am 06.11.2026 direkt gelesen. [source.json](src/curriculum/source.json) hält Lernbereiche, Stunden und Kompetenzerwartungen sowie die Prüfsumme der gelesenen Seite fest; die Erwartungen wurden automatisch aus dieser Seite übernommen. [coverage.json](coverage.json) ordnet alle 38 Erwartungen konkreten Lektionen zu und nennt die Labore und Generatoren als Nachweis.

Aus M3/4 kommen die schriftlichen Verfahren, das Rechnen bis zur Million, Größen und einfache Kombinatorik; diese Teile sind als Vertiefung angelegt. M6-Inhalte werden nicht vorgezogen: kein Rechnen mit Brüchen und Dezimalzahlen (nur Kommaschreibweise und Alltagsbrüche bei Größen), keine Flächenformeln für Dreieck und Parallelogramm, kein Volumen, keine Gleichungen, keine Prozente, kein Begriff „direkt proportional“. Details stehen im [Lehrplanbericht](../docs/mathematik-5-coverage.md).

## Karten und alte Historien

Eine Lektion hat ein Atom mit drei Karten in [cell.json](cell.json): zwei kurze Abrufe und eine Transferfrage mit Musterlösung. Alle Kennungen sind einmal erzeugte ULIDs und in [public-contract.json](tests/fixtures/public-contract.json) fixiert.

Zwei alte Zellen enthalten 16 Karten. Bytegleiche Schnappschüsse, Herkunftscommit und SHA-256 stehen in [replaces-de-by.json](replaces-de-by.json). Acht A-Zeilen übertragen denselben Einzelabruf auf einen Nachfolger, acht C-Zeilen für mehrteilige Karten bleiben `keep-active`. Thomas hat die Zuordnung am 8. November 2026 **freigegeben**. Ab `2026.11.2` trägt jeder A-Nachfolger ein `replaces` auf seine alte Karte, deren Historie damit unverändert übergeht; `retired_items` gibt es nicht.

## Lokal starten und prüfen

Es werden die vorhandenen TypeScript-, Vite- und Vitest-Werkzeuge der Mathematik-Referenz verwendet, keine neue Bibliothek.

```bash
npm ci
npm run dev          # http://localhost:5220/mathematik-realschule-5/
npm run typecheck
npm test
npm run build
npm run package:zip
```

Die Einzeldatei liegt in `dist/index.html`, das Offlinepaket in `release/ZAM-Academy-Mathematik-5-offline.zip`. Am Repository-Stamm, mit zam-core in der in CI festgelegten Version:

```bash
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=<Datei-URL von zam-core/dist/index.js> node scripts/validate-cells.mjs
ZAM_CORE=<Datei-URL von zam-core/dist/index.js> node mathematik-realschule-5/scripts/validate-migration.mjs
```
