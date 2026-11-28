# Mathematik 8 Gymnasium

LehrplanPLUS Bayern, Gymnasium, Jahrgangsstufe 8: **42 Lektionen**, **126 ZAM-Karten**. Jeder Lernbereich trägt eine eigene Akzentfarbe (`--accent`), und jede Lektion enthält Erklärung mit Konzeptgrafik, Beispiel, Merksatz, Schnellcheck, interaktives Labor mit drei Aufträgen sowie zwei Aufgabengeneratoren auf zwei Stufen.

| Lernbereich | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- |
| LB 1 Funktion und Term | 8 | 3 | 5 |
| LB 2 Lineare Funktionen | 16 | 5 | 8 |
| LB 3 Elementare gebrochen-rationale Funktionen | 13 | 3 | 5 |
| LB 4 Bruchterme und Bruchgleichungen | 13 | 5 | 7 |
| LB 5 Laplace-Experimente | 14 | 4 | 6 |
| LB 6 Lineare Gleichungssysteme | 10 | 3 | 5 |
| LB 7 Kreis und Zylinder | 10 | 4 | 6 |

Am Gymnasium gibt es in Jahrgangsstufe 8 keine Zweige. Darum hat das Paket keine Zweigauswahl, und die Atome in [cell.json](cell.json) tragen kein Feld `track`.

Ein Lektionsabschluss verlangt Schnellcheck, alle drei Laboraufträge und je drei richtige Aufgaben auf **beiden** Stufen. Fortschritt bleibt lokal im Browser. Eigenständige Arbeit in externen Tabellenkalkulations-, Funktionenplotter- oder dynamischen Geometrieprogrammen, händisches Zeichnen von Hyperbeln, Schrägbildern und Netzen, reale Mess- und Zufallsversuche sowie Internetrecherche und Präsentation von Lösungswegen bleiben Teil des Unterrichts (`status: "supported"` in [coverage.json](coverage.json)); die App übt die zugehörigen Begriffe, Begründungen und Berechnungen. Lehrkraftprüfung und Lehrervideos stehen noch aus (`version: "0.0"`).

## Lehrplan und Nachbarjahrgänge

Der aktuelle offizielle [Fachlehrplan M8](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/mathematik) wurde am 28.11.2026 direkt abgerufen (SHA-256 `609b4a0efdd58aa72d818d2905ecc9dbeeebb070cc4654f774dc18731cd9e190`), die zwei eingebetteten amtlichen Formel-SVGs im Lernbereich 3 (`x ↦ a/(x + b) + c` und `y = a/x`) wurden per Browser gerendert geprüft. [source.json](src/curriculum/source.json) hält die 7 Lernbereiche, 84 Stunden und alle 27 Kompetenzerwartungen wortgleich fest, [coverage.json](coverage.json) ordnet sie den 42 Lektionen zu.

Aus Mathematik 7 knüpfen Termstrukturen, das Distributivgesetz sowie die Äquivalenzumformungen bei Gleichungen an (`M8 LB 2` und `LB 4`). Inhalte aus Mathematik 9+ (quadratische Funktionen, Satz des Pythagoras, Strahlensätze, Trigonometrie, Pyramide/Kegel/Kugel, 1./2. Pfadregel und bedingte Wahrscheinlichkeit) werden nicht vorgezogen.

## Karten und Bestandsabgleich (`proposal-only`)

Eine Lektion besitzt genau ein Atom mit drei Karten in [cell.json](cell.json): zwei `tier1_fast`-Karten mit binärem `fast_check` und zwei kuratierten Distraktoren sowie eine `tier2_synthesis`-Karte mit `sample_solution` und kuratierten Distraktoren. Alle IDs sind frisch erzeugte ULIDs und in [public-contract.json](tests/fixtures/public-contract.json) festgehalten.

Zwei bestehende `de-by`-Zellen für Mathematik 8 Gymnasium enthalten zusammen 8 Karten. Bytegleiche Schnappschüsse, Commit (`c92f4e383385ee487cd8b30f73b3bf3cb27b0860` in `zam-os/zam`) und SHA-256 stehen in [replaces-de-by.json](replaces-de-by.json). Die Zuordnung ist ein ungeprüfter Vorschlag (`status: "proposal-only"`, `approved: null`: **2 A-Vorschläge**, **0 B**, **6 C-Karten** `keep-active`), weshalb [cell.json](cell.json) bis zur Freigabe durch Thomas weder `replaces` noch `retired_items` enthält. Siehe [Abgleichdokumentation](../docs/mathematik-gymnasium-8-coverage.md).

## Lokal starten und prüfen

```bash
npm ci
npm run dev        # http://localhost:5305/mathematik-gymnasium-8/
npx tsc --noEmit
npm test
npm run build      # eine Datei in dist/index.html
npm run package:zip
```
