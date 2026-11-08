# Mathematik 12 Gymnasium

LehrplanPLUS Bayern, Gymnasium, Jahrgangsstufe 12: **30 Lektionen**, **90 ZAM-Karten**. Jeder der fünf Lernbereiche hat einen eigenen Akzent und jede Lektion enthält Erklärung mit Merksatz und Beispiel, Schnellcheck mit drei Optionen, ein interaktives Labor mit drei Aufträgen und mindestens zwei Aufgabengeneratoren auf zwei Stufen.

| Lernbereich | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- |
| LB 1: Untersuchung von Funktionen – Stammfunktion, Produkt- und Kettenregel | 33 | 8 | 8 |
| LB 2: Zufallsgrößen und Binomialverteilung | 22 | 5 | 5 |
| LB 3: Einseitiger Signifikanztest (bei als binomialverteilt angenommenen Merkmalen) | 8 | 4 | 4 |
| LB 4: Untersuchung von Funktionen – Quotientenregel, Umkehrfunktion | 29 | 8 | 8 |
| LB 5: Grundlagen der Koordinatengeometrie im Raum | 20 | 5 | 5 |

Am Gymnasium gibt es in der Jahrgangsstufe 12 keine Zweige. Darum gibt es keine Zweigauswahl, und die Atome der Zelle tragen keinen `track`.

Ein Lektionsabschluss verlangt Schnellcheck, alle drei Laboraufträge und je drei richtige Aufgaben auf **beiden** Stufen. Der Fortschritt bleibt lokal im Browser. Zeichnungen mit dynamischer Geometriesoftware und CAS-Einsatz geschehen im Unterricht oder am Rechner; die App erläutert und überprüft die mathematischen Konzepte, Formeln und Rechnungen.

## Lehrplan und Nachbarjahrgänge

Der aktuelle offizielle [Fachlehrplan M12](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/12/mathematik/regulaer) wurde am 08.11.2026 direkt gelesen. [source.json](src/curriculum/source.json) hält Lernbereiche, Stunden (112 Std. gesamt) und alle 30 Kompetenzerwartungen wortgleich fest, [coverage.json](coverage.json) ordnet sie den Lektionen zu.

Aus der Jahrgangsstufe 11 kommen Differentialrechnung ganzrationaler Funktionen, Integralbegriff und grundlegende Wahrscheinlichkeitsrechnung; hier werden sie zu Funktionenscharen, Ketten- und Produktregel, Stammfunktionen, Exponential- und trigonometrischen Funktionen, Binomialverteilung, Hypothesentests, gebrochen-rationalen Kurven, Wurzelfunktionen, Logarithmen und 3D-Vektorgeometrie erweitert. Lehrervideos folgen gemäß Standard in einem separaten Schritt.

## Karten und Bestandsabgleich

Jede Lektion hat ein Atom mit drei Karten in [cell.json](cell.json): zwei kurze Abrufe (`tier1_fast` mit `fast_check`) und eine Transferfrage mit Musterlösung (`tier2_transfer`). Alle Kennungen sind einmalig erzeugte Crockford-Base32-ULIDs und in [public-contract.json](tests/fixtures/public-contract.json) festgehalten.

Drei alte `de-by`-Zellen enthalten 12 Karten. Bytegleiche Schnappschüsse, Herkunfts-Repository und SHA-256 stehen in [replaces-de-by.json](replaces-de-by.json). Thomas hat die Zuordnung am 08.11.2026 freigegeben (`"approved": "2026-11-08"`): Zwei Karten geben ihre Historie an genau einen Nachfolger weiter (Kategorie A, `replaces` in der ersten Veröffentlichung), zehn Karten bleiben ohne Nachfolger aktiv (Kategorie C). Die Zelle hat kein `retired_items`.

## Lokal starten und prüfen

```bash
npm ci
npm run dev        # http://localhost:5222/mathematik-gymnasium-12/
npx tsc --noEmit
npm test
npm run build      # eine Datei in dist/index.html
npm run package:zip
```

Vom Wurzelordner aus prüft `ZAM_CORE=<file URL> node mathematik-gymnasium-12/scripts/validate-migration.mjs` die freigegebene Historienübernahme in temporären SQLite-Datenbanken; `ZAM_CORE` verweist auf das in CI festgelegte `zam-core`.
