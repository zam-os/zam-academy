# Mathematik 6 Gymnasium

LehrplanPLUS Bayern, Gymnasium, Jahrgangsstufe 6: **47 Lektionen**, **141 ZAM-Karten**. Jeder Lernbereich hat einen eigenen Akzent und jede Lektion Erklärung, Beispiel, Merksatz, Schnellcheck, Labor mit drei Aufträgen und mindestens zwei Aufgabengeneratoren auf zwei Stufen.

| Lernbereich | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- |
| LB 1 Rationale Zahlen | 68 | 19 | 27 |
| LB 2 Flächeninhalt und Volumen | 24 | 9 | 12 |
| LB 3 Prozentrechnung, Daten und Diagramme | 20 | 5 | 8 |

Am Gymnasium gibt es in Jahrgangsstufe 6 keine Zweige. Darum gibt es hier keine Zweigauswahl, und die Atome der Zelle tragen keinen `track`.

Ein Abschluss verlangt Schnellcheck, alle drei Laboraufträge und je drei richtige Aufgaben auf **beiden** Stufen. Fortschritt bleibt lokal im Browser. Zeichnen, Messen, Recherche und das Präsentieren geschehen auf Papier oder im Unterricht; die App erläutert und überprüft die zugehörigen Begriffe und Rechnungen. Lehrervideos folgen in einem späteren Schritt.

## Lehrplan und Nachbarjahrgänge

Der aktuelle offizielle [Fachlehrplan M6](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/mathematik) wurde am 08.11.2026 direkt gelesen. [source.json](src/curriculum/source.json) hält Lernbereiche, Stunden und alle 33 Kompetenzerwartungen wortgleich fest, [coverage.json](coverage.json) ordnet sie den Lektionen zu.

Aus der Grundschule und aus Mathematik 5 am Gymnasium kommen das Rechteck, die Primfaktorzerlegung und das Rechnen mit ganzen Zahlen. Mathematik 7 wird nicht vorgezogen: keine Terme mit Variablen, keine binomischen Formeln, keine Achsenspiegelung, keine Winkelpaare, keine linearen Gleichungen, kein Zinseszins, kein Median und keine allgemeinen Prismen.

## Karten und alte Historien

Eine Lektion hat ein Atom mit drei Karten in [cell.json](cell.json): zwei kurze Abrufe und eine Transferfrage mit Musterlösung. Alle Kennungen sind einmal erzeugte ULIDs und in [public-contract.json](tests/fixtures/public-contract.json) festgehalten.

Zwei alte Zellen enthalten 16 Karten. Bytegleiche Schnappschüsse, Herkunftscommit und SHA-256 stehen in [replaces-de-by.json](replaces-de-by.json). Die Zuordnung ist ein Vorschlag: sieben A-Karten, keine B-Karte, neun C-Karten bleiben aktiv. Sie ist nicht freigegeben. Die veröffentlichte Zelle trägt weder `replaces` noch `retired_items`.

## Lokal starten und prüfen

```bash
npm ci
npm run dev        # http://localhost:5224/mathematik-gymnasium-6/
npx tsc --noEmit
npm test
npm run build      # eine Datei in dist/index.html
npm run package:zip
```

Vom Wurzelordner aus prüft `node mathematik-gymnasium-6/scripts/validate-migration.mjs` die Historien in Wegwerf-Datenbanken; `ZAM_CORE` zeigt dabei auf das in CI festgelegte `zam-core`.
