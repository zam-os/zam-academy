# Mathematik 7 Gymnasium

LehrplanPLUS Bayern, Gymnasium, Jahrgangsstufe 7: **44 Lektionen**, **132 ZAM-Karten**. Jeder Lernbereich hat eine eigene Akzentfarbe, und jede Lektion enthält Erklärung, Beispiel, Merksatz, Schnellcheck, interaktives Labor mit drei Aufträgen sowie mindestens zwei Aufgabengeneratoren auf zwei Stufen.

| Lernbereich | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- |
| LB 1 Terme mit Variablen | 37 | 9 | 12 |
| LB 2 Geometrische Figuren: Symmetrie und Winkel | 21 | 7 | 10 |
| LB 3 Lineare Gleichungen und Vertiefung der Prozentrechnung | 17 | 4 | 7 |
| LB 4 Kenngrößen von Daten | 8 | 3 | 5 |
| LB 5 Kongruenz, besondere Dreiecke und Dreieckskonstruktionen | 29 | 9 | 10 |

Am Gymnasium gibt es in Jahrgangsstufe 7 keine Zweige. Darum gibt es hier keine Zweigauswahl, und die Atome der Zelle tragen keinen `track`.

Ein Abschluss verlangt Schnellcheck, alle drei Laboraufträge und je drei richtige Aufgaben auf **beiden** Stufen. Fortschritt bleibt lokal im Browser. Zeichnen mit Zirkel und Lineal, eigenständige Nutzung externer Tabellenkalkulations- bzw. Geometriesoftware und Schülervorträge bleiben im Unterricht; die App erläutert und überprüft die zugehörigen Begriffe, Begründungen und Rechnungen. Lehrervideos folgen in einem späteren Schritt.

## Lehrplan und Nachbarjahrgänge

Der aktuelle offizielle [Fachlehrplan M7](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/mathematik) wurde am 13.11.2026 direkt abgerufen (SHA-256 `0d3b0fe5c8823049f0f118a19fbf7aab66f64ee34781e743aef7f3a6c4785676`). [source.json](src/curriculum/source.json) hält Lernbereiche, Stunden und alle 32 Kompetenzerwartungen wortgleich fest, [coverage.json](coverage.json) ordnet sie den 44 Lektionen zu.

Aus Mathematik 6 stammen die Rechenregeln für rationale Zahlen sowie einfache Potenzen mit ganzzahligen Exponenten als Wiederholung bei Termwerten (`tv-3-termwerte`). Die Potenzgesetze in `tu-1-potenzgesetze` bleiben gemäß Lehrplan bei natürlichen Exponenten. Inhalte aus Mathematik 8+ (lineare Funktionen, Gleichungssysteme, Strahlensätze, Bruchterme, Wahrscheinlichkeitsrechnung) werden nicht vorgezogen.

## Karten und Bestandsabgleich (Vorschlag)

Eine Lektion hat ein Atom mit drei Karten in [cell.json](cell.json): zwei `tier1_fast`-Abrufe mit binärem `fast_check` und zwei kuratierten Distraktoren sowie eine `tier2_synthesis`-Karte mit `sample_solution` und kuratierten Distraktoren. Alle Kennungen sind einmal erzeugte ULIDs und in [public-contract.json](tests/fixtures/public-contract.json) festgehalten.

Zwei alte `de-by`-Zellen enthalten zusammen 12 Karten. Bytegleiche Schnappschüsse, Herkunftscommit (`0dd65c8f58b7ece3edcf6aff1d5eced099b74e6c` in `zam-os/zam`) und SHA-256 stehen in [replaces-de-by.json](replaces-de-by.json). Die vorgeschlagene Zuordnung (`status: "proposal-only"`, `approved: null`) umfasst **4 A-Karten** (`propose-replace-after-approval`), **0 B-Karten** und **8 C-Karten** (`keep-active`). Solange Thomas nicht ausdrücklich freigibt, deklariert `cell.json` weder `replaces` noch `retired_items`.

## Lokal starten und prüfen

```bash
npm ci
npm run dev        # http://localhost:5242/mathematik-gymnasium-7/
npx tsc --noEmit
npm test
npm run build      # eine Datei in dist/index.html
npm run package:zip
```

Vom Wurzelordner aus prüft `node mathematik-gymnasium-7/scripts/validate-cell.mjs` mit `ZAM_CORE` auf dem in CI festgelegten `zam-core`, dass die Zelle störungsfrei neben den 12 unveränderten Bestandskarten installiert wird und der Bestandsvorschlag konsistent bleibt.
