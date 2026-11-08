# Mathematik 13 Gymnasium

LehrplanPLUS Bayern, Gymnasium, Jahrgangsstufe 13 (erhöhtes Anforderungsniveau):
**27 Lektionen**, **84 ZAM-Karten**. Jeder Lernbereich hat einen eigenen Akzent und
jede Lektion Erklärung, Beispiel, Merksatz, Schnellcheck, Labor mit drei Aufträgen
und mindestens zwei Aufgabengeneratoren auf zwei Stufen.

| Lernbereich | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- |
| M13 LB 1 Flächeninhalt und bestimmtes Integral | 26 | 8 | 9 |
| M13 LB 2 Normalverteilung | 14 | 4 | 4 |
| M13 LB 3 Geraden und Ebenen im Raum | 24 | 6 | 9 |
| M13 LB 4 Anwendungen der Differential- und Integralrechnung | 20 | 4 | 5 |

Am Gymnasium gibt es in Jahrgangsstufe 13 kein zweites Anforderungsniveau in
Mathematik: Der Fachlehrplan führt nur „Mathematik 13 (erhöhtes
Anforderungsniveau)", die einstündige Differenzierungsstunde hat keinen eigenen
Fachlehrplan. Darum gibt es hier keine Zweig- oder Kursauswahl, und die Atome
der Zelle tragen keinen `track`.

Ein Abschluss verlangt Schnellcheck, alle drei Laboraufträge und je drei richtige
Aufgaben auf **beiden** Stufen. Fortschritt bleibt lokal im Browser. Zeichnen mit
dynamischer Geometriesoftware, schriftliche Ausarbeitungen und Präsentationen
geschehen auf Papier oder im Unterricht; die App erläutert und überprüft die
zugehörigen Begriffe und Rechnungen.

**Vorschau:** Dieses Paket ist noch nicht von einer Lehrkraft geprüft, die
Lehrervideos fehlen noch (sie kommen als separater Schritt). Die Kennungen der
Lektionen und Karten sind auch in der Vorschau ein Vertrag.

## Lehrplan und Nachbarjahrgänge

Der offizielle [Fachlehrplan M13](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/13/mathematik)
wurde am 08.11.2026 direkt gelesen. [source.json](src/curriculum/source.json)
hält Lernbereiche, Stunden und alle 22 Kompetenzerwartungen wortgleich fest,
[coverage.json](coverage.json) ordnet sie den Lektionen zu.

Aus M12 kommen Differential- und Integralrechnung, Stammfunktionen und die
natürliche Exponentialfunktion; sie werden in int-5 und aw-1 aufgefrischt und in
allen vier Lernbereichen angewandt. Der Vertiefungskurs M12 (Komplexe Zahlen,
Folgen und Reihen, Matrizen, Zahlentheorie) und Stochastik jenseits des Plans
(etwa der Satz von Moivre-Laplace) bleiben draußen. M13 LB 1 rechnet
uneigentliche Integrale und Rotationskörper, LB 2 führt stetige Zufallsgrößen,
Dichte- und Verteilungsfunktion sowie die Sigma-Regeln ein, LB 3 behandelt
Geraden, Ebenen, Kugeln und Abstände im Raum vollständig analytisch, LB 4
verknüpft beides in Parametern, Extremwertaufgaben und Anwendungen aus
Wirtschaft, Klimaforschung und Technik.

## Karten und alte Historien

Eine Lektion hat ein Atom mit drei Karten in [cell.json](cell.json) (drei Lektionen
haben eine vierte Karte für einen Einzelabruf aus dem Bestand): zwei kurze Abrufe
und eine Transferfrage mit Musterlösung. Alle Kennungen sind einmal erzeugte ULIDs
und in [public-contract.json](tests/fixtures/public-contract.json) festgehalten.

Drei alte Zellen (`de-by:gymnasium-13-mathematik-…`) enthalten 12 Karten.
Bytegleiche Schnappschüsse, Herkunftscommit und SHA-256 stehen in
[replaces-de-by.json](replaces-de-by.json). Der Bestandsabgleich ist ein
**Vorschlag ohne Freigabe** (`"approved": null`, `"status": "proposal-only"`):
fünf A-Zeilen zu je einem Einzelabruf mit passendem Nachfolger, sieben C-Zeilen,
die aktiv bleiben, keine B-Übernahme und keine Stilllegung. Die Zelle erscheint
ohne `replaces` und ohne `retired_items`; erst Thomas' ausdrückliche Freigabe
(setzt `approved` auf das Datum und dokumentiert seine Worte in `source`) darf
die Übernahmen aktivieren.

## Lokal starten und prüfen

```bash
npm ci
npm run dev        # http://localhost:5225/mathematik-gymnasium-13/
npx tsc --noEmit
npm test
npm run build      # eine Datei in dist/index.html
npm run package:zip
```

Vom Wurzelordner aus prüft `node mathematik-gymnasium-13/scripts/validate-migration.mjs`
die Historien in Wegwerf-Datenbanken und probiert den Vorschlag nur dort aus;
`ZAM_CORE` zeigt dabei auf das in CI festgelegte `zam-core`.
