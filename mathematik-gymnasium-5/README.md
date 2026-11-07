# Mathematik 5 Gymnasium

LehrplanPLUS Bayern, Gymnasium, Jahrgangsstufe 5: **55 Lektionen**, **165 ZAM-Karten**. Jeder Lernbereich hat einen eigenen Akzent und jede Lektion Erklärung, Beispiel, Merksatz, Schnellcheck, Labor mit drei Aufträgen und mindestens zwei Aufgabengeneratoren auf zwei Stufen.

| Lernbereich | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- |
| LB 1 Natürliche und ganze Zahlen – Addition und Subtraktion | 30 | 12 | 15 |
| LB 2 Geometrische Figuren und Lagebeziehungen | 14 | 5 | 9 |
| LB 3 Natürliche und ganze Zahlen – Multiplikation und Division | 34 | 12 | 16 |
| LB 4 Größen und ihre Einheiten | 34 | 10 | 15 |

Am Gymnasium gibt es in Jahrgangsstufe 5 keine Zweige. Darum gibt es hier keine Zweigauswahl, und die Atome der Zelle tragen keinen `track`.

Ein Abschluss verlangt Schnellcheck, alle drei Laboraufträge und je drei richtige Aufgaben auf **beiden** Stufen. Fortschritt bleibt lokal im Browser. Zeichnen und Messen mit dem Geodreieck, Skizzen, Recherche und mündliches Präsentieren geschehen auf Papier oder im Unterricht; die App erläutert und überprüft die zugehörigen Begriffe und Rechnungen.

## Lehrplan und Nachbarjahrgänge

Der aktuelle offizielle [Fachlehrplan M5](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/mathematik) wurde am 07.11.2026 direkt gelesen. [source.json](src/curriculum/source.json) hält Lernbereiche, Stunden und alle 39 Kompetenzerwartungen wortgleich fest, [coverage.json](coverage.json) ordnet sie den Lektionen zu.

Aus der Grundschule 3/4 kommen die schriftlichen Verfahren bis zur Million, Größen und einfache Sachaufgaben; hier werden sie über die Million hinaus vertieft. M6 wird nicht vorgezogen: keine Dezimalbrüche, keine Brüche, kein Prozent, kein Volumen, keine Dreiecksfläche. Ein Komma steht nur bei Geld, Länge, Masse und Flächen, wie es der Plan verlangt, und die Zeit bleibt ohne Komma. Der Realschulstoff der 5. Klasse wurde nicht übernommen, wo der Gymnasialplan abweicht: kein Dualsystem, kein ggT und kgV, keine Dreiecke und keine Daten, dafür ganze Zahlen von Anfang an, Lagebeziehungen von Kreisen, Primfaktorzerlegung, Zählprinzip und Oberflächen.

## Karten und alte Historien

Eine Lektion hat ein Atom mit drei Karten in [cell.json](cell.json): zwei kurze Abrufe und eine Transferfrage mit Musterlösung. Alle Kennungen sind einmal erzeugte ULIDs und in [public-contract.json](tests/fixtures/public-contract.json) festgehalten.

Zwei alte Zellen enthalten 16 Karten. Bytegleiche Schnappschüsse, Herkunftscommit und SHA-256 stehen in [replaces-de-by.json](replaces-de-by.json). Thomas hat die Zuordnung am 2026-11-07 freigegeben: Fünf Karten übernehmen mit `replaces` die Historie desselben Einzelabrufs (A), elf C-Karten bleiben aktiv, die Zelle hat keine `retired_items`.

## Lokal starten und prüfen

```bash
npm ci
npm run dev        # http://localhost:5221/mathematik-gymnasium-5/
npx tsc --noEmit
npm test
npm run build      # eine Datei in dist/index.html
npm run package:zip
```

Vom Wurzelordner aus prüft `node mathematik-gymnasium-5/scripts/validate-migration.mjs` die Historien in Wegwerf-Datenbanken; `ZAM_CORE` zeigt dabei auf das in CI festgelegte `zam-core`.
